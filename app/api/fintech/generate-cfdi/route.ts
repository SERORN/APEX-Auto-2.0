import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Invoice from '@/models/Invoice';
import User from '@/models/User';
import { FacturamaService } from '@/lib/partners/facturama';

/**
 * POST /api/fintech/generate-cfdi
 * Genera una factura CFDI usando el servicio de Facturama
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
      invoiceId,
      clientData,
      items,
      paymentMethod = 'PUE', // Pago en una sola exhibición
      paymentForm = '03', // Transferencia electrónica
      cfdiUse = 'G03', // Gastos en general
      currency = 'MXN',
      additionalData
    } = await request.json();

    // Validar datos requeridos
    if (!invoiceId && !items) {
      return NextResponse.json(
        { error: 'ID de factura o items son requeridos' },
        { status: 400 }
      );
    }

    let invoice;
    let userData;

    // Si se proporciona invoiceId, buscar la factura existente
    if (invoiceId) {
      invoice = await Invoice.findById(invoiceId).populate('customerId');
      
      if (!invoice) {
        return NextResponse.json(
          { error: 'Factura no encontrada' },
          { status: 404 }
        );
      }

      // Verificar que el usuario tenga acceso a esta factura
      if (invoice.customerId._id.toString() !== session.user.id && 
          invoice.providerId?.toString() !== session.user.id) {
        return NextResponse.json(
          { error: 'No autorizado para acceder a esta factura' },
          { status: 403 }
        );
      }

      userData = await User.findById(session.user.id);
    } else {
      // Si no hay invoiceId, crear factura temporal
      userData = await User.findById(session.user.id);
      
      if (!userData) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      // Crear factura temporal para CFDI
      invoice = {
        _id: `temp_${Date.now()}`,
        invoiceNumber: `APX-${Date.now()}`,
        customerId: userData,
        items: items || [],
        subtotal: items?.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0) || 0,
        tax: 0,
        total: 0,
        currency: currency,
        status: 'draft'
      };

      // Calcular impuestos (IVA 16%)
      invoice.tax = Math.round(invoice.subtotal * 0.16 * 100) / 100;
      invoice.total = invoice.subtotal + invoice.tax;
    }

    // Validar datos del cliente
    const clientInfo = clientData || {
      name: userData.name || 'Cliente General',
      email: userData.email,
      rfc: userData.fiscalData?.rfc || 'XAXX010101000',
      address: userData.fiscalData?.address || 'Sin dirección fiscal',
      fiscalRegime: userData.fiscalData?.fiscalRegime || '601'
    };

    // Validar que hay items para facturar
    const invoiceItems = invoice.items || [];
    if (invoiceItems.length === 0) {
      return NextResponse.json(
        { error: 'No hay items para facturar' },
        { status: 400 }
      );
    }

    // Preparar datos para Facturama
    const cfdiData = {
      // Datos del emisor (nuestra empresa)
      issuer: {
        rfc: process.env.COMPANY_RFC || 'AAA010101AAA',
        name: process.env.COMPANY_NAME || 'Apex Fintech & Automotive',
        fiscalRegime: process.env.COMPANY_FISCAL_REGIME || '601'
      },
      
      // Datos del receptor (cliente)
      receiver: {
        rfc: clientInfo.rfc,
        name: clientInfo.name,
        email: clientInfo.email,
        cfdiUse: cfdiUse,
        fiscalRegime: clientInfo.fiscalRegime || '601'
      },
      
      // Datos de la factura
      invoice: {
        series: 'APX',
        folio: invoice.invoiceNumber || `${Date.now()}`,
        date: new Date().toISOString(),
        paymentMethod: paymentMethod,
        paymentForm: paymentForm,
        currency: currency,
        exchangeRate: currency === 'USD' ? 18.5 : 1, // Tipo de cambio aproximado
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total
      },
      
      // Items de la factura
      items: invoiceItems.map((item: any, index: number) => ({
        key: index + 1,
        productCode: item.productCode || '01010101', // Código SAT genérico
        unit: item.unit || 'PZA',
        description: item.description || item.name,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || item.price,
        amount: (item.quantity || 1) * (item.unitPrice || item.price),
        taxes: [
          {
            type: 'IVA',
            rate: 0.16,
            amount: Math.round((item.quantity || 1) * (item.unitPrice || item.price) * 0.16 * 100) / 100
          }
        ]
      })),
      
      // Datos adicionales
      additionalData: {
        observations: additionalData?.observations || 'Factura generada desde Apex Platform',
        internalReference: invoice._id,
        userId: session.user.id,
        ...additionalData
      }
    };

    try {
      // Llamar al servicio de Facturama para generar el CFDI
      const facturamaService = new FacturamaService();
      const cfdiResult = await facturamaService.generateCFDI(cfdiData);

      // Actualizar o crear la factura en nuestra base de datos
      let savedInvoice;
      
      if (invoiceId && invoice._id !== `temp_${Date.now()}`) {
        // Actualizar factura existente
        savedInvoice = await Invoice.findByIdAndUpdate(
          invoiceId,
          {
            cfdiData: {
              uuid: cfdiResult.uuid,
              xmlUrl: cfdiResult.xmlUrl,
              pdfUrl: cfdiResult.pdfUrl,
              status: cfdiResult.status,
              fiscalDigitalSeal: cfdiResult.fiscalDigitalSeal,
              satCertificateNumber: cfdiResult.satCertificateNumber,
              issueDate: new Date(),
              generatedAt: new Date()
            },
            status: 'active',
            updatedAt: new Date()
          },
          { new: true }
        );
      } else {
        // Crear nueva factura
        savedInvoice = new Invoice({
          invoiceNumber: cfdiData.invoice.folio,
          customerId: session.user.id,
          providerId: process.env.COMPANY_ID || session.user.id,
          items: cfdiData.items.map(item => ({
            name: item.description,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productCode: item.productCode,
            unit: item.unit
          })),
          subtotal: cfdiData.invoice.subtotal,
          tax: cfdiData.invoice.tax,
          total: cfdiData.invoice.total,
          currency: cfdiData.invoice.currency,
          status: 'active',
          cfdiData: {
            uuid: cfdiResult.uuid,
            xmlUrl: cfdiResult.xmlUrl,
            pdfUrl: cfdiResult.pdfUrl,
            status: cfdiResult.status,
            fiscalDigitalSeal: cfdiResult.fiscalDigitalSeal,
            satCertificateNumber: cfdiResult.satCertificateNumber,
            issueDate: new Date(),
            generatedAt: new Date()
          },
          clientData: clientInfo
        });
        
        await savedInvoice.save();
      }

      const response = {
        success: true,
        message: 'CFDI generado exitosamente',
        cfdi: {
          uuid: cfdiResult.uuid,
          invoiceId: savedInvoice._id,
          invoiceNumber: savedInvoice.invoiceNumber,
          total: savedInvoice.total,
          currency: savedInvoice.currency,
          status: cfdiResult.status,
          issueDate: savedInvoice.cfdiData.issueDate,
          urls: {
            xml: cfdiResult.xmlUrl,
            pdf: cfdiResult.pdfUrl
          },
          digitalSeal: cfdiResult.fiscalDigitalSeal,
          satCertificate: cfdiResult.satCertificateNumber
        },
        invoice: {
          id: savedInvoice._id,
          number: savedInvoice.invoiceNumber,
          total: savedInvoice.total,
          status: savedInvoice.status,
          client: {
            name: clientInfo.name,
            rfc: clientInfo.rfc,
            email: clientInfo.email
          }
        }
      };

      return NextResponse.json(response, { status: 200 });

    } catch (facturamaError) {
      console.error('Error en Facturama:', facturamaError);
      
      return NextResponse.json(
        { 
          error: 'Error al generar CFDI',
          details: (facturamaError as Error).message,
          service: 'facturama'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al generar CFDI:', error);
    
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
 * GET /api/fintech/generate-cfdi?invoiceId=xxx
 * Obtiene el estado de un CFDI existente
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

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    const uuid = searchParams.get('uuid');

    if (!invoiceId && !uuid) {
      return NextResponse.json(
        { error: 'ID de factura o UUID son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Buscar factura
    let invoice;
    if (invoiceId) {
      invoice = await Invoice.findById(invoiceId);
    } else {
      invoice = await Invoice.findOne({ 'cfdiData.uuid': uuid });
    }

    if (!invoice) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      );
    }

    // Verificar acceso
    if (invoice.customerId.toString() !== session.user.id && 
        invoice.providerId?.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'No autorizado para acceder a esta factura' },
        { status: 403 }
      );
    }

    // Verificar estado del CFDI en Facturama si existe
    let cfdiStatus = null;
    if (invoice.cfdiData?.uuid) {
      try {
        const facturamaService = new FacturamaService();
        cfdiStatus = await facturamaService.getCFDIStatus(invoice.cfdiData.uuid);
      } catch (statusError) {
        console.error('Error al consultar estado CFDI:', statusError);
        // Continuar con los datos locales si hay error en el servicio
      }
    }

    const response = {
      success: true,
      cfdi: invoice.cfdiData ? {
        uuid: invoice.cfdiData.uuid,
        invoiceId: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        currency: invoice.currency,
        status: cfdiStatus?.status || invoice.cfdiData.status,
        issueDate: invoice.cfdiData.issueDate,
        urls: {
          xml: invoice.cfdiData.xmlUrl,
          pdf: invoice.cfdiData.pdfUrl
        },
        digitalSeal: invoice.cfdiData.fiscalDigitalSeal,
        satCertificate: invoice.cfdiData.satCertificateNumber,
        satStatus: cfdiStatus?.satStatus || 'unknown'
      } : null,
      invoice: {
        id: invoice._id,
        number: invoice.invoiceNumber,
        total: invoice.total,
        status: invoice.status,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error al consultar CFDI:', error);
    
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
 * DELETE /api/fintech/generate-cfdi
 * Cancela un CFDI existente
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const { invoiceId, uuid, reason = '02' } = await request.json();

    if (!invoiceId && !uuid) {
      return NextResponse.json(
        { error: 'ID de factura o UUID son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectDB();

    // Buscar factura
    let invoice;
    if (invoiceId) {
      invoice = await Invoice.findById(invoiceId);
    } else {
      invoice = await Invoice.findOne({ 'cfdiData.uuid': uuid });
    }

    if (!invoice) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      );
    }

    // Verificar acceso (solo el proveedor puede cancelar)
    if (invoice.providerId?.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Solo el proveedor puede cancelar la factura' },
        { status: 403 }
      );
    }

    if (!invoice.cfdiData?.uuid) {
      return NextResponse.json(
        { error: 'Esta factura no tiene CFDI generado' },
        { status: 400 }
      );
    }

    try {
      // Cancelar CFDI en Facturama
      const facturamaService = new FacturamaService();
      const cancellationResult = await facturamaService.cancelCFDI(invoice.cfdiData.uuid, reason);

      // Actualizar estado en nuestra base de datos
      invoice.cfdiData.status = 'cancelled';
      invoice.cfdiData.cancellationDate = new Date();
      invoice.cfdiData.cancellationReason = reason;
      invoice.status = 'cancelled';
      
      await invoice.save();

      const response = {
        success: true,
        message: 'CFDI cancelado exitosamente',
        cancellation: {
          uuid: invoice.cfdiData.uuid,
          status: 'cancelled',
          cancellationDate: invoice.cfdiData.cancellationDate,
          reason: reason,
          satAcknowledgment: cancellationResult.satAcknowledgment
        }
      };

      return NextResponse.json(response, { status: 200 });

    } catch (facturamaError) {
      console.error('Error al cancelar CFDI:', facturamaError);
      
      return NextResponse.json(
        { 
          error: 'Error al cancelar CFDI',
          details: (facturamaError as Error).message,
          service: 'facturama'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al cancelar CFDI:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
