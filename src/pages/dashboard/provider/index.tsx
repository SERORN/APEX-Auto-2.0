
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProviderSidebar from '../../../provider-dashboard/components/ProviderSidebar';

const ProviderDashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <ProviderSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderDashboardLayout;
