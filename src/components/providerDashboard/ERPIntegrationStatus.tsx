// SUGERENCIA: Este archivo es legacy y podría migrarse a la nueva estructura provider-dashboard/components.
import React, { useEffect } from 'react';

const ERPIntegrationStatus = () => {
  useEffect(() => {
    // Aquí se conectará con Supabase
  }, []);
  // TODO: Estado de conexión con ERP/CRM
  // Aquí se mostrará el estado de conexión con ERP/CRM
  return <div>{t('Estado de Integración ERP/CRM')}</div>;
};

export default ERPIntegrationStatus;
