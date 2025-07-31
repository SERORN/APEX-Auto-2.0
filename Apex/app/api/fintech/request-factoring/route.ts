import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Invoice from '@/models/Invoice';
import User from '@/models/User';
import { requestFactoring } from '@/lib/partners/konfio';

/**
 * POST /api/fintech/request-factoring
 * Solicita factoring para una factura específica
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Obtener datos del cuerpo de la petición
    const { invoiceId, partnerId = 'konfio' } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'ID de factura es requerido' },
        { status: 400 }
      );
    }

    // Buscar la factura
    const invoice = await Invoice.findById(invoiceId).populate('userId');
    if (!invoice) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el propietario de la factura
    if (invoice.userId._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para esta factura' },
        { status: 403 }
      );
    }

    // Verificar que la factura puede ser factorizada
    if (!invoice.canBeFactored) {
      return NextResponse.json(
        { 
          error: 'Esta factura no puede ser factorizada',
          reasons: [
            invoice.status !== 'pendiente' ? 'La factura no está pendiente' : null,
            invoice.amount < 1000 ? 'Monto mínimo $1,000' : null,
            invoice.daysUntilDue <= 1 ? 'Debe tener al menos 2 días hasta vencimiento' : null,
            invoice.factoringData?.status ? 'Ya tiene una solicitud de factoring' : null
          ].filter(Boolean)
        },
        { status: 400 }
      );
    }

    // Obtener información del usuario
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar KYC del usuario
    if (!user.kycCompleted) {
      return NextResponse.json(
        { 
          error: 'Debes completar tu verificación KYC antes de solicitar factoring',
          kycRequired: true
        },
        { status: 400 }
      );
    }

    // Preparar datos para el partner de factoring
    const factoringRequest = {
      invoiceId: invoice._id,
      userId: user._id,
      amount: invoice.amount,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      clientInfo: invoice.clientInfo,
      userCreditScore: user.creditScore,
      userKycStatus: user.kycCompleted,
      invoiceAge: Math.floor((new Date().getTime() - invoice.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    };

    // Solicitar factoring al partner
    const factoringResult = await requestFactoring(factoringRequest);

    // Actualizar la factura con la información del factoring
    invoice.factoringData = {
      partnerId: partnerId,
      partnerName: factoringResult.partnerName,
      requestedAt: new Date(),
      anticipatedAmount: factoringResult.anticipatedAmount,
      feePercentage: factoringResult.feePercentage,
      status: factoringResult.status
    };

    if (factoringResult.status === 'aprobado') {
      invoice.factoringData.approvedAt = new Date();
      invoice.status = 'anticipado';
    }

    await invoice.save();

    // Preparar respuesta
    const response = {
      success: true,
      invoice: {
        id: invoice._id,
        amount: invoice.amount,
        status: invoice.status,
        factoringData: invoice.factoringData
      },
      factoring: {
        status: factoringResult.status,
        anticipatedAmount: factoringResult.anticipatedAmount,
        feePercentage: factoringResult.feePercentage,
        netAmount: factoringResult.anticipatedAmount,
        processingTime: factoringResult.processingTime,
        message: factoringResult.message
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error en request-factoring:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/fintech/request-factoring
 * Obtiene el estado de las solicitudes de factoring del usuario
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Construir filtros
    const filters: any = {
      userId: session.user.id,
      factoringData: { $exists: true }
    };

    if (status) {
      filters['factoringData.status'] = status;
    }

    // Buscar facturas con factoring
    const invoices = await Invoice.find(filters)
      .sort({ 'factoringData.requestedAt': -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('userId', 'name email');

    // Contar total de documentos
    const total = await Invoice.countDocuments(filters);

    const response = {
      success: true,
      data: invoices.map(invoice => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate,
        factoringData: invoice.factoringData,
        createdAt: invoice.createdAt
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error al obtener solicitudes de factoring:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
