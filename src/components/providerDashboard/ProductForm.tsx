// SUGERENCIA: Este archivo es legacy y podría migrarse a la nueva estructura provider-dashboard/components.
import React, { useEffect } from 'react';

const ProductForm = () => {
  useEffect(() => {
    // Aquí se conectará con Supabase
  }, []);
  // TODO: Formulario para crear/editar productos
  // Campos: nombre, descripción, precio, imagen, marca, SKU, stock, categoría
  return <div>{t('Formulario de Producto')}</div>;
};

export default ProductForm;
