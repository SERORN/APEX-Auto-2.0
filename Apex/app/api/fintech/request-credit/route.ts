import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import CreditLine from '@/models/CreditLine';
import { requestBNPL } from '@/lib/partners/kueski';

/**
 * POST /api/fintech/request-credit
 * Solicita una línea de crédito BNPL
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
    const { 
      requestedAmount, 
      partnerId = 'kueski',
      paymentTerms = 30,
      monthlyIncome,
      purpose = 'Compra de productos en marketplace'
    } = await request.json();

    if (!requestedAmount || requestedAmount < 1000) {
      return NextResponse.json(
        { error: 'El monto mínimo de solicitud es $1,000 MXN' },
        { status: 400 }
      );
    }

    if (requestedAmount > 100000) {
      return NextResponse.json(
        { error: 'El monto máximo de solicitud es $100,000 MXN' },
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
          error: 'Debes completar tu verificación KYC antes de solicitar crédito',
          kycRequired: true
        },
        { status: 400 }
      );
    }

    // Verificar si ya tiene una línea de crédito activa
    const existingCreditLine = await CreditLine.findOne({
      userId: user._id,
      status: { $in: ['activa', 'pendiente_aprobacion'] },
      partner: partnerId
    });

    if (existingCreditLine) {
      return NextResponse.json(
        { 
          error: 'Ya tienes una línea de crédito activa o en proceso de aprobación',
          existingCreditLine: {
            id: existingCreditLine._id,
            status: existingCreditLine.status,
            maxAmount: existingCreditLine.maxAmount,
            availableAmount: existingCreditLine.availableAmount,
            partner: existingCreditLine.partner
          }
        },
        { status: 400 }
      );
    }

    // Verificar score de crédito mínimo
    if (user.creditScore < 600) {
      return NextResponse.json(
        { 
          error: 'Score de crédito insuficiente para aprobación automática',
          currentScore: user.creditScore,
          minimumRequired: 600,
          canReapply: true
        },
        { status: 400 }
      );
    }

    // Preparar datos para la solicitud de crédito
    const creditRequest = {
      userId: user._id,
      userProfile: {
        name: user.name,
        email: user.email,
        creditScore: user.creditScore,
        registeredAt: user.registeredAt,
        kycCompleted: user.kycCompleted,
        walletBalance: user.walletBalance
      },
      requestDetails: {
        amount: requestedAmount,
        paymentTerms,
        monthlyIncome: monthlyIncome || 0,
        purpose
      }
    };

    // Solicitar crédito al partner
    const creditResult = await requestBNPL(creditRequest);

    // Crear nueva línea de crédito
    const creditLine = new CreditLine({
      userId: user._id,
      maxAmount: creditResult.approvedAmount || requestedAmount,
      currency: 'MXN',
      status: creditResult.approved ? 'activa' : 'pendiente_aprobacion',
      partner: partnerId,
      interestRate: creditResult.interestRate || 0,
      paymentTerms: creditResult.paymentTerms || paymentTerms,
      fees: {
        originationFee: creditResult.fees?.originationFee || 0,
        lateFee: creditResult.fees?.lateFee || 0,
        prepaymentFee: creditResult.fees?.prepaymentFee || 0
      }
    });

    if (creditResult.approved) {
      creditLine.approvalData = {
        creditScore: user.creditScore,
        monthlyIncome: monthlyIncome || 0,
        debtToIncomeRatio: creditResult.debtToIncomeRatio || 0,
        approvedBy: `${partnerId}_auto`,
        conditions: creditResult.conditions || []
      };
      creditLine.approve(creditLine.approvalData);
    }

    await creditLine.save();

    // Preparar respuesta
    const response = {
      success: true,
      approved: creditResult.approved,
      creditLine: {
        id: creditLine._id,
        maxAmount: creditLine.maxAmount,
        availableAmount: creditLine.availableAmount,
        status: creditLine.status,
        partner: creditLine.partner,
        interestRate: creditLine.interestRate,
        paymentTerms: creditLine.paymentTerms,
        fees: creditLine.fees
      },
      terms: {
        monthlyPayment: creditResult.monthlyPayment || 0,
        totalPayments: creditResult.totalPayments || 0,
        apr: creditResult.apr || 0,
        conditions: creditResult.conditions || []
      },
      message: creditResult.message,
      nextSteps: creditResult.approved 
        ? ['Tu línea de crédito está activa y lista para usar']
        : ['Tu solicitud está en revisión', 'Recibirás una notificación en 24-48 horas']
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error en request-credit:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/fintech/request-credit
 * Obtiene las líneas de crédito del usuario
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
    const partner = searchParams.get('partner');

    // Construir filtros
    const filters: Record<string, any> = {
      userId: session.user.id
    };

    if (status) {
      filters.status = status;
    }

    if (partner) {
      filters.partner = partner;
    }

    // Buscar líneas de crédito
    const creditLines = await CreditLine.find(filters)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    // Calcular estadísticas
    const stats = {
      totalCreditLines: creditLines.length,
      totalMaxAmount: creditLines.reduce((sum, cl) => sum + cl.maxAmount, 0),
      totalUsedAmount: creditLines.reduce((sum, cl) => sum + cl.usedAmount, 0),
      totalAvailableAmount: creditLines.reduce((sum, cl) => sum + cl.availableAmount, 0),
      activeCreditLines: creditLines.filter(cl => cl.status === 'activa').length
    };

    const response = {
      success: true,
      data: creditLines.map(cl => ({
        id: cl._id,
        maxAmount: cl.maxAmount,
        usedAmount: cl.usedAmount,
        availableAmount: cl.availableAmount,
        currency: cl.currency,
        status: cl.status,
        partner: cl.partner,
        interestRate: cl.interestRate,
        paymentTerms: cl.paymentTerms,
        utilizationRate: cl.utilizationRate,
        isExpired: cl.isExpired,
        daysUntilExpiry: cl.daysUntilExpiry,
        outstandingBalance: cl.outstandingBalance,
        approvedAt: cl.approvedAt,
        expiresAt: cl.expiresAt,
        lastUsedAt: cl.lastUsedAt,
        fees: cl.fees,
        createdAt: cl.createdAt
      })),
      stats
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error al obtener líneas de crédito:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
