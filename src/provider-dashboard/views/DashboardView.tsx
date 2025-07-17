import React, { useState } from 'react';
import { OrdersPanel } from '../components/OrdersPanel';
import { AnalyticsPanel } from '../components/AnalyticsPanel';
import { InvoicesPanel } from '../components/InvoicesPanel';
import { AccountSettings } from '../components/AccountSettings';
import { ERPIntegration } from '../components/ERPIntegration';
import ProductManager from '../../components/providerDashboard/ProductManager';
import { BarChart2, Package, FileText, Settings, Link2, Boxes } from 'lucide-react';

// TODO: Preparar para internacionalización y cambio de moneda

const TABS = [
  { key: 'orders', label: 'Pedidos', icon: <Package className="w-5 h-5" /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
  { key: 'invoices', label: 'Facturas', icon: <FileText className="w-5 h-5" /> },
  { key: 'products', label: 'Productos', icon: <Boxes className="w-5 h-5" /> },
  { key: 'account', label: 'Cuenta', icon: <Settings className="w-5 h-5" /> },
  { key: 'erp', label: 'ERP/CRM', icon: <Link2 className="w-5 h-5" /> },
];

export const DashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('orders');

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex flex-col py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-brand-primary">Panel Proveedor</h1>
        <nav className="flex flex-col gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-3 py-2 rounded text-left font-medium transition-colors ${activeTab === tab.key ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
        {/* TODO: Agregar selector de idioma y moneda */}
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === 'orders' && <OrdersPanel />}
        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'invoices' && <InvoicesPanel />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'account' && <AccountSettings />}
        {activeTab === 'erp' && <ERPIntegration />}
      </main>
    </div>
  );
};
