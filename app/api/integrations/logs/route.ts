// 📝 FASE 33: API para Logs de Integraciones
// ✅ Endpoint para consultar historial de sincronizaciones

import { NextRequest, NextResponse } from 'next/server';
import IntegrationService from '@/lib/services/IntegrationService';

// GET: Obtener logs de integración
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const organizationId = searchParams.get('organizationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const entityType = searchParams.get('entityType');
    const systemName = searchParams.get('systemName');
    
    if (!providerId && !organizationId) {
      return NextResponse.json(
        { error: 'Se requiere providerId o organizationId' },
        { status: 400 }
      );
    }
    
    const integrationService = IntegrationService.getInstance();
    
    if (providerId) {
      // Obtener logs específicos del proveedor
      const logs = await integrationService.getIntegrationLogs(
        providerId,
        Math.min(limit, 100), // Máximo 100 logs por request
        status || undefined,
        entityType || undefined
      );
      
      return NextResponse.json({
        success: true,
        logs,
        count: logs.length,
        filters: {
          providerId,
          status,
          entityType,
          limit
        }
      });
    } else {
      // Obtener estadísticas y logs para la organización
      const stats = await integrationService.getIntegrationStats(organizationId!, 7);
      
      return NextResponse.json({
        success: true,
        stats: stats.stats,
        recentErrors: stats.recentErrors,
        summary: {
          activeConnections: stats.activeConnections,
          connectedSystems: stats.connectedSystems,
          systemBreakdown: stats.systemBreakdown
        },
        period: '7 days'
      });
    }
    
  } catch (error) {
    console.error('Error en GET /api/integrations/logs:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener logs',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
