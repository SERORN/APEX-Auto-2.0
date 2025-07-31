'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { formatMXNPrice } from '@/lib/utils/paymentSimulator'
import { toast } from 'react-hot-toast'

interface LeaseApplication {
  _id: string
  leaseType: 'leasing' | 'financing'
  months: number
  monthlyPayment: number
  totalToPay: number
  status: 'pending' | 'approved' | 'rejected'
  leaseProvider: string
  adminComments?: string
  product: {
    _id: string
    name: string
    brand: string
    price: number
    images?: string[]
  }
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
  distributor: {
    _id: string
    name: string
  }
  applicantInfo: {
    name: string
    email: string
    phone: string
    company?: string
  }
  createdAt: string
  approvedAt?: string
  rejectedAt?: string
}

export default function AdminLeaseRequestsPage() {
  const { data: session, status } = useSession()
  const [applications, setApplications] = useState<LeaseApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedApplication, setSelectedApplication] = useState<LeaseApplication | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject'>('approve')
  const [leaseProvider, setLeaseProvider] = useState('')
  const [adminComments, setAdminComments] = useState('')
  const [processing, setProcessing] = useState(false)

  if (status === 'loading') return <div>Cargando...</div>
  if (!session) redirect('/login')
  if (session.user.role !== 'admin') redirect('/login')

  useEffect(() => {
    fetchApplications()
  }, [selectedTab])

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedTab !== 'all') {
        params.append('status', selectedTab)
      }
      
      const response = await fetch(`/api/lease-applications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (application: LeaseApplication, actionType: 'approve' | 'reject') => {
    setSelectedApplication(application)
    setAction(actionType)
    setLeaseProvider(actionType === 'approve' ? 'Financiera ToothPick' : '')
    setAdminComments('')
    setShowModal(true)
  }

  const handleSubmitAction = async () => {
    if (!selectedApplication) return

    if (action === 'approve' && !leaseProvider.trim()) {
      toast.error('Proveedor de arrendamiento requerido')
      return
    }

    if (action === 'reject' && !adminComments.trim()) {
      toast.error('Comentarios requeridos para rechazar')
      return
    }

    setProcessing(true)

    try {
      const response = await fetch(`/api/lease-applications/${selectedApplication._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          leaseProvider: action === 'approve' ? leaseProvider : undefined,
          adminComments: adminComments || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar solicitud')
      }

      toast.success(data.message)
      setShowModal(false)
      fetchApplications()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    const labels = {
      pending: '⏳ Pendiente',
      approved: '✅ Aprobada',
      rejected: '❌ Rechazada'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getLeaseTypeBadge = (type: string) => {
    const badges = {
      leasing: 'bg-blue-100 text-blue-800',
      financing: 'bg-purple-100 text-purple-800'
    }
    const labels = {
      leasing: '🏢 Arrendamiento',
      financing: '💳 Financiamiento'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[type as keyof typeof badges]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    )
  }

  const tabCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  const filteredApplications = selectedTab === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedTab)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                🏛️ Gestión de Solicitudes de Arrendamiento
              </h1>
              <p className="text-gray-600">
                Administra y procesa solicitudes de arrendamiento y financiamiento.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{tabCounts.pending}</div>
              <div className="text-sm text-gray-500">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'pending', label: 'Pendientes', count: tabCounts.pending },
                { key: 'approved', label: 'Aprobadas', count: tabCounts.approved },
                { key: 'rejected', label: 'Rechazadas', count: tabCounts.rejected },
                { key: 'all', label: 'Todas', count: tabCounts.all }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                    selectedTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      selectedTab === tab.key 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay solicitudes {selectedTab === 'all' ? '' : selectedTab === 'pending' ? 'pendientes' : selectedTab}
                </h3>
                <p className="text-gray-500">
                  Las nuevas solicitudes aparecerán aquí para su revisión.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((application) => (
                  <div key={application._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        {application.product.images && application.product.images[0] && (
                          <img
                            src={application.product.images[0]}
                            alt={application.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.product.name}
                          </h3>
                          <p className="text-gray-600">{application.product.brand}</p>
                          <p className="text-sm text-gray-500">
                            Cliente: {application.user.name} ({application.user.email})
                          </p>
                          <p className="text-sm text-gray-500">
                            Distribuidor: {application.distributor.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            {getLeaseTypeBadge(application.leaseType)}
                            {getStatusBadge(application.status)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatMXNPrice(application.product.price)}
                        </div>
                        <div className="text-sm text-gray-500">Precio del producto</div>
                      </div>
                    </div>

                    {/* Detalles del arrendamiento */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Plazo</div>
                          <div className="font-semibold">{application.months} meses</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Pago mensual</div>
                          <div className="font-semibold text-blue-600">
                            {formatMXNPrice(application.monthlyPayment)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total a pagar</div>
                          <div className="font-semibold">
                            {formatMXNPrice(application.totalToPay)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Proveedor</div>
                          <div className="font-semibold">{application.leaseProvider}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Tipo cliente</div>
                          <div className="font-semibold">{application.user.role}</div>
                        </div>
                      </div>
                    </div>

                    {/* Información del solicitante */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Información de contacto</div>
                        <div className="font-medium">{application.applicantInfo.name}</div>
                        <div className="text-sm text-gray-600">{application.applicantInfo.email}</div>
                        <div className="text-sm text-gray-600">{application.applicantInfo.phone}</div>
                      </div>
                      {application.applicantInfo.company && (
                        <div>
                          <div className="text-sm text-gray-500">Empresa</div>
                          <div className="font-medium">{application.applicantInfo.company}</div>
                        </div>
                      )}
                    </div>

                    {/* Comentarios del admin */}
                    {application.adminComments && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="text-sm text-blue-800">
                          <strong>Comentarios:</strong> {application.adminComments}
                        </div>
                      </div>
                    )}

                    {/* Footer con fechas y acciones */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        Solicitud: {new Date(application.createdAt).toLocaleDateString()}
                        {application.approvedAt && (
                          <span className="ml-4 text-green-600">
                            Aprobada: {new Date(application.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                        {application.rejectedAt && (
                          <span className="ml-4 text-red-600">
                            Rechazada: {new Date(application.rejectedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {application.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(application, 'approve')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            ✅ Aprobar
                          </button>
                          <button
                            onClick={() => handleOpenModal(application, 'reject')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            ❌ Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Aprobación/Rechazo */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {action === 'approve' ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-sm text-gray-600">
                <strong>{selectedApplication.product.name}</strong><br />
                Cliente: {selectedApplication.user.name}
              </div>

              {action === 'approve' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor de Arrendamiento *
                  </label>
                  <select
                    value={leaseProvider}
                    onChange={(e) => setLeaseProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar proveedor</option>
                    <option value="Financiera ToothPick">Financiera ToothPick</option>
                    <option value="Banco Santander Leasing">Banco Santander Leasing</option>
                    <option value="BBVA Leasing">BBVA Leasing</option>
                    <option value="Arrendadora Banobras">Arrendadora Banobras</option>
                    <option value="Otro">Otro proveedor especializado</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios {action === 'reject' ? '*' : '(opcional)'}
                </label>
                <textarea
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  placeholder={
                    action === 'approve' 
                      ? 'Comentarios adicionales sobre la aprobación...' 
                      : 'Motivo del rechazo...'
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitAction}
                disabled={processing}
                className={`flex-1 py-2 px-4 text-white rounded-lg transition disabled:opacity-50 ${
                  action === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Procesando...' : action === 'approve' ? 'Aprobar' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
