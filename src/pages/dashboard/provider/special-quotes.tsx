import React, { Suspense } from 'react';
const SpecialQuoteRequest = React.lazy(() => import('../../../provider-dashboard/components/SpecialQuoteRequest'));

const SpecialQuotesPage = () => (
  <Suspense fallback={<div>Cargando cotizaciones especiales...</div>}>
    <SpecialQuoteRequest />
  </Suspense>
);

export default SpecialQuotesPage;
