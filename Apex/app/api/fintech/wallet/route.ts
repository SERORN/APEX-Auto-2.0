import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

/**
 * GET /api/fintech/wallet
 * Obtiene el estado del wallet del usuario actual
 */
export async function GET() {
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

    // Buscar o crear wallet del usuario
    let wallet = await Wallet.findOne({ userId: session.user.id });
    
    if (!wallet) {
      // Crear wallet si no existe
      wallet = new Wallet({
        userId: session.user.id,
        balance: 0,
        cashbackAvailable: 0,
        currency: 'MXN'
      });
      await wallet.save();
    }

    // Obtener transacciones recientes (últimas 10)
    const recentTransactions = await Transaction.find({
      $or: [
        { fromUser: session.user.id },
        { toUser: session.user.id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email');

    // Calcular valores derivados
    const availableCredit = Math.max(0, wallet.creditLimit - wallet.usedCredit);
    const totalAvailable = wallet.balance + wallet.cashbackAvailable + availableCredit;
    const availableBalance = Math.max(0, wallet.balance - wallet.frozenBalance);

    const response = {
      success: true,
      wallet: {
        id: wallet._id,
        balance: wallet.balance,
        cashbackAvailable: wallet.cashbackAvailable,
        totalAvailable,
        availableBalance,
        frozenBalance: wallet.frozenBalance,
        creditLimit: wallet.creditLimit,
        usedCredit: wallet.usedCredit,
        availableCredit,
        currency: wallet.currency,
        isActive: wallet.isActive,
        lastUpdated: wallet.lastUpdated
      },
      recentTransactions: recentTransactions.map(tx => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status,
        description: tx.description,
        reference: tx.reference,
        date: tx.date,
        isIncoming: !!tx.toUser,
        isOutgoing: !!tx.fromUser
      }))
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error al obtener wallet:', error);
    
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
 * POST /api/fintech/wallet
 * Agrega saldo o cashback al wallet (para pruebas y administración)
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
      action, 
      amount, 
      type = 'manual',
      description = 'Ajuste manual de saldo',
      reference 
    } = await request.json();

    if (!action || !amount) {
      return NextResponse.json(
        { error: 'Acción y monto son requeridos' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const validActions = ['add_balance', 'add_cashback', 'deduct_balance', 'freeze_balance', 'unfreeze_balance'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      );
    }

    // Buscar wallet del usuario
    let wallet = await Wallet.findOne({ userId: session.user.id });
    
    if (!wallet) {
      // Crear wallet si no existe
      wallet = new Wallet({
        userId: session.user.id,
        balance: 0,
        cashbackAvailable: 0,
        currency: 'MXN'
      });
    }

    // Crear transacción para registro
    let transaction;
    let resultMessage = '';

    try {
      switch (action) {
        case 'add_balance':
          wallet.balance += amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          transaction = new Transaction({
            toUser: session.user.id,
            amount,
            type: type === 'cashback' ? 'cashback' : 'deposito',
            status: 'completado',
            description,
            reference,
            processedAt: new Date()
          });
          resultMessage = `$${amount} agregados al balance`;
          break;

        case 'add_cashback':
          wallet.cashbackAvailable += amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          transaction = new Transaction({
            toUser: session.user.id,
            amount,
            type: 'cashback',
            status: 'completado',
            description: description || 'Cashback agregado',
            reference,
            processedAt: new Date()
          });
          resultMessage = `$${amount} agregados como cashback`;
          break;

        case 'deduct_balance':
          if (wallet.balance < amount) {
            throw new Error('Saldo insuficiente');
          }
          wallet.balance -= amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          transaction = new Transaction({
            fromUser: session.user.id,
            amount,
            type: 'retiro',
            status: 'completado',
            description: description || 'Deducción de saldo',
            reference,
            processedAt: new Date()
          });
          resultMessage = `$${amount} deducidos del balance`;
          break;

        case 'freeze_balance':
          if (wallet.balance < amount) {
            throw new Error('Saldo insuficiente para congelar');
          }
          wallet.frozenBalance += amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          resultMessage = `$${amount} congelados temporalmente`;
          break;

        case 'unfreeze_balance':
          if (wallet.frozenBalance < amount) {
            throw new Error('No hay suficiente balance congelado');
          }
          wallet.frozenBalance -= amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          resultMessage = `$${amount} liberados del congelamiento`;
          break;
      }

      // Guardar transacción si se creó
      if (transaction) {
        await transaction.save();
        // Agregar ID de transacción al wallet
        wallet.transactions.push(new mongoose.Types.ObjectId(transaction._id as string));
        await wallet.save();
      }

      // Calcular valores derivados
      const availableCredit = Math.max(0, wallet.creditLimit - wallet.usedCredit);
      const totalAvailable = wallet.balance + wallet.cashbackAvailable + availableCredit;
      const availableBalance = Math.max(0, wallet.balance - wallet.frozenBalance);

      const response = {
        success: true,
        message: resultMessage,
        wallet: {
          id: wallet._id,
          balance: wallet.balance,
          cashbackAvailable: wallet.cashbackAvailable,
          totalAvailable,
          availableBalance,
          frozenBalance: wallet.frozenBalance,
          lastUpdated: wallet.lastUpdated
        },
        transaction: transaction ? {
          id: transaction._id,
          reference: transaction.reference,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status
        } : null
      };

      return NextResponse.json(response, { status: 200 });

    } catch (walletError) {
      return NextResponse.json(
        { error: (walletError as Error).message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al actualizar wallet:', error);
    
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
 * PATCH /api/fintech/wallet
 * Operaciones específicas del wallet (usar crédito, pagar crédito, etc.)
 */
export async function PATCH(request: NextRequest) {
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
    const { operation, amount, creditLineId, metadata } = await request.json();

    if (!operation) {
      return NextResponse.json(
        { error: 'Operación es requerida' },
        { status: 400 }
      );
    }

    // Buscar wallet del usuario
    const wallet = await Wallet.findOne({ userId: session.user.id });
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet no encontrado' },
        { status: 404 }
      );
    }

    let resultMessage = '';
    let transaction;

    try {
      switch (operation) {
        case 'use_credit':
          if (!amount || amount <= 0) {
            throw new Error('Monto inválido para usar crédito');
          }
          
          const availableCredit = wallet.creditLimit - wallet.usedCredit;
          if (availableCredit < amount) {
            throw new Error('Límite de crédito insuficiente');
          }
          
          wallet.usedCredit += amount;
          wallet.balance += amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          
          transaction = new Transaction({
            toUser: session.user.id,
            amount,
            type: 'credito',
            status: 'completado',
            description: 'Uso de línea de crédito',
            metadata: { creditLineId, ...metadata },
            processedAt: new Date()
          });
          resultMessage = `$${amount} de crédito agregados al balance`;
          break;

        case 'pay_credit':
          if (!amount || amount <= 0) {
            throw new Error('Monto inválido para pagar crédito');
          }
          
          if (wallet.balance < amount) {
            throw new Error('Saldo insuficiente para pagar crédito');
          }
          
          const paymentAmount = Math.min(amount, wallet.usedCredit);
          
          wallet.balance -= paymentAmount;
          wallet.usedCredit -= paymentAmount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          
          transaction = new Transaction({
            fromUser: session.user.id,
            amount: paymentAmount,
            type: 'pago_credito',
            status: 'completado',
            description: 'Pago de línea de crédito',
            metadata: { creditLineId, ...metadata },
            processedAt: new Date()
          });
          resultMessage = `$${paymentAmount} aplicados al pago de crédito`;
          break;

        case 'use_cashback':
          if (!amount || amount <= 0) {
            throw new Error('Monto inválido para usar cashback');
          }
          
          if (wallet.cashbackAvailable < amount) {
            throw new Error('Cashback insuficiente');
          }
          
          wallet.cashbackAvailable -= amount;
          wallet.balance += amount;
          wallet.lastUpdated = new Date();
          await wallet.save();
          
          transaction = new Transaction({
            fromUser: session.user.id,
            toUser: session.user.id,
            amount,
            type: 'transferencia',
            status: 'completado',
            description: 'Conversión de cashback a saldo',
            processedAt: new Date()
          });
          resultMessage = `$${amount} de cashback convertidos a saldo`;
          break;

        default:
          return NextResponse.json(
            { error: 'Operación no válida' },
            { status: 400 }
          );
      }

      // Guardar transacción
      if (transaction) {
        await transaction.save();
        wallet.transactions.push(new mongoose.Types.ObjectId(transaction._id as string));
        await wallet.save();
      }

      // Calcular valores derivados
      const finalAvailableCredit = Math.max(0, wallet.creditLimit - wallet.usedCredit);
      const totalAvailable = wallet.balance + wallet.cashbackAvailable + finalAvailableCredit;
      const availableBalance = Math.max(0, wallet.balance - wallet.frozenBalance);

      const response = {
        success: true,
        message: resultMessage,
        wallet: {
          id: wallet._id,
          balance: wallet.balance,
          cashbackAvailable: wallet.cashbackAvailable,
          totalAvailable,
          availableBalance,
          creditLimit: wallet.creditLimit,
          usedCredit: wallet.usedCredit,
          availableCredit: finalAvailableCredit,
          lastUpdated: wallet.lastUpdated
        },
        transaction: transaction ? {
          id: transaction._id,
          reference: transaction.reference,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status
        } : null
      };

      return NextResponse.json(response, { status: 200 });

    } catch (walletError) {
      return NextResponse.json(
        { error: (walletError as Error).message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error en operación de wallet:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}
