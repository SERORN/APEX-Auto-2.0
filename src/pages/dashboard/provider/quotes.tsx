import React, { useEffect } from 'react';

const Quotes = () => {
  useEffect(() => {
    // Aquí se conectará con Supabase
  }, []);
  // TODO: Cotizaciones recibidas por el proveedor
  return <div>{t('Cotizaciones Recibidas')}</div>;
};

export default Quotes;
