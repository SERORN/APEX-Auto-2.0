import React from "react";
import { Navigate } from "react-router-dom";
import useIsAdmin from "@/hooks/useIsAdmin";

const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AdminDashboardLayout: React.FC = ({ children }) => {
  const { isAdmin, loading } = useIsAdmin();

  if (loading) return <Loader />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Panel del Administrador</h1>
        {/* Aquí puedes agregar más secciones del panel */}
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
