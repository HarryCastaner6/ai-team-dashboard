'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Plus, Search, Filter, Download, Send, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, DollarSign, FileText, Calendar, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  description: string
  items: InvoiceItem[]
  notes?: string
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface PaymentMethod {
  id: string
  type: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe'
  name: string
  details: string
  isDefault: boolean
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paymentMethods] = useState<PaymentMethod[]>([])

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'recurring'>('invoices')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    clientEmail: '',
    description: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: ''
  })

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'sent': return '#667eea'
      case 'paid': return '#10b981'
      case 'overdue': return '#ef4444'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} />
      case 'sent': return <Clock size={16} />
      case 'overdue': return <AlertCircle size={16} />
      default: return <FileText size={16} />
    }
  }

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0)
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0)

  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, rate: 0 }]
    })
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = newInvoice.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setNewInvoice({ ...newInvoice, items: updatedItems })
  }

  const calculateInvoiceTotal = () => {
    const subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
    const tax = subtotal * 0.1 // 10% tax
    return { subtotal, tax, total: subtotal + tax }
  }

  const handleCreateInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.clientEmail || newInvoice.items.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    const { subtotal, tax, total } = calculateInvoiceTotal()
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: newInvoice.clientName,
      clientEmail: newInvoice.clientEmail,
      amount: subtotal,
      tax,
      total,
      status: 'draft',
      issueDate: new Date(),
      dueDate: new Date(newInvoice.dueDate),
      description: newInvoice.description,
      items: newInvoice.items.map((item, index) => ({
        id: index.toString(),
        ...item,
        amount: item.quantity * item.rate
      })),
      notes: newInvoice.notes
    }

    setInvoices([invoice, ...invoices])
    setNewInvoice({
      clientName: '',
      clientEmail: '',
      description: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: 0 }],
      notes: ''
    })
    setShowInvoiceModal(false)
    toast.success('Invoice created successfully!')
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <CreditCard size={40} />
          Invoices & Billing
        </h2>
        <p>Manage invoices, payments, and billing</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <DollarSign size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Revenue</div>
              <div className="member-rating">
                <div className="rating-value">${(totalRevenue / 1000).toFixed(1)}K</div>
                <div className="rating-rank">Paid invoices</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Clock size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Pending</div>
              <div className="member-rating">
                <div className="rating-value">${(pendingAmount / 1000).toFixed(1)}K</div>
                <div className="rating-rank">Awaiting payment</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <AlertCircle size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Overdue</div>
              <div className="member-rating">
                <div className="rating-value">${(overdueAmount / 1000).toFixed(1)}K</div>
                <div className="rating-rank">Past due</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <FileText size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Invoices</div>
              <div className="member-rating">
                <div className="rating-value">{invoices.length}</div>
                <div className="rating-rank">All time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        <div className="chart-container large">
          {/* Tabs */}
          <div style={{ marginBottom: '25px' }}>
            <div className="filters" style={{ width: 'fit-content' }}>
              <button
                onClick={() => setActiveTab('invoices')}
                className={activeTab === 'invoices' ? 'filter-btn active' : 'filter-btn'}
              >
                Invoices
                {invoices.length > 0 && (
                  <span style={{ marginLeft: '8px', opacity: 0.8 }}>({invoices.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={activeTab === 'payments' ? 'filter-btn active' : 'filter-btn'}
              >
                Payment Methods
                {paymentMethods.length > 0 && (
                  <span style={{ marginLeft: '8px', opacity: 0.8 }}>({paymentMethods.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('recurring')}
                className={activeTab === 'recurring' ? 'filter-btn active' : 'filter-btn'}
              >
                Recurring Bills
              </button>
            </div>
          </div>

          {activeTab === 'invoices' && (
            <>
              {/* Search and Filter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={18} />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 15px 10px 40px',
                        background: '#333333',
                        border: '1px solid #404040',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '10px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>

              {/* Invoices List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredInvoices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
                    <FileText size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No invoices found</p>
                    <p style={{ fontSize: '0.9rem' }}>Create your first invoice to get started</p>
                  </div>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="team-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            color: 'white'
                          }}>
                            {invoice.invoiceNumber.slice(-3)}
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                              {invoice.invoiceNumber}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>{invoice.clientName}</p>
                            <p style={{ fontSize: '0.85rem', color: '#999' }}>{invoice.description}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: getStatusColor(invoice.status),
                              color: 'white'
                            }}>
                              {getStatusIcon(invoice.status)}
                              <span style={{ textTransform: 'capitalize' }}>{invoice.status}</span>
                            </span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24' }}>
                              ${invoice.total.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '10px' }}>
                            <p>Due: {format(invoice.dueDate, 'MMM d, yyyy')}</p>
                            {invoice.paidDate && (
                              <p>Paid: {format(invoice.paidDate, 'MMM d, yyyy')}</p>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="action-btn"
                              style={{ padding: '6px' }}
                            >
                              <Eye size={14} />
                            </button>
                            <button className="action-btn" style={{ padding: '6px' }}>
                              <Edit size={14} />
                            </button>
                            {invoice.status === 'draft' && (
                              <button 
                                onClick={() => toast.success('Invoice sent!')}
                                className="action-btn"
                                style={{ padding: '6px', background: '#10b981' }}
                              >
                                <Send size={14} />
                              </button>
                            )}
                            <button className="action-btn" style={{ padding: '6px' }}>
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>Payment Methods</h3>
                <button className="nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} />
                  <span>Add Method</span>
                </button>
              </div>
              
              {paymentMethods.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
                  <CreditCard size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No payment methods</p>
                  <p style={{ fontSize: '0.9rem' }}>Add a payment method to get started</p>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div key={method.id} className="team-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '5px' }}>{method.name}</h4>
                          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{method.details}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {method.isDefault && (
                          <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            Default
                          </span>
                        )}
                        <button className="action-btn" style={{ padding: '8px' }}>
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'recurring' && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <Calendar size={64} style={{ margin: '0 auto 20px', opacity: 0.5, color: '#999' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>
                Recurring Bills
              </h3>
              <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '0.9rem' }}>
                Set up recurring invoices for regular clients
              </p>
              <button className="nav-btn">
                Create Recurring Invoice
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Revenue Trends */}
          <div className="chart-container">
            <h3>
              <TrendingUp size={20} />
              Revenue Trends
            </h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>This Month</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981' }}>+23%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>Last Month</span>
                  <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>+18%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>YTD Growth</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea' }}>+42%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="chart-container">
            <h3>
              <CheckCircle size={20} />
              Payment Status
            </h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Paid on Time</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981' }}>87%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    background: '#333333', 
                    borderRadius: '5px', 
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '6px', 
                      borderRadius: '5px', 
                      background: '#10b981',
                      width: '87%'
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Collection Rate</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fbbf24' }}>92%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    background: '#333333', 
                    borderRadius: '5px', 
                    height: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '6px', 
                      borderRadius: '5px', 
                      background: '#fbbf24',
                      width: '92%'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="chart-container">
            <h3>
              <Calendar size={20} />
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {['Invoice #001 paid', 'New invoice created', 'Payment reminder sent'].map((activity, index) => (
                <div key={index} className="team-card" style={{ padding: '12px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>{activity}</p>
                  <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                    {index === 0 ? '2 hours ago' : index === 1 ? 'Yesterday' : '3 days ago'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50, 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: '15px', 
            maxWidth: '800px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            padding: '30px',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>
              Create New Invoice
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  value={newInvoice.clientName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Client name"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Client Email *
                </label>
                <input
                  type="email"
                  value={newInvoice.clientEmail}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientEmail: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="client@company.com"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Invoice description"
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ fontWeight: 600, color: '#fbbf24' }}>Invoice Items</h4>
                <button
                  onClick={addInvoiceItem}
                  className="action-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {newInvoice.items.map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                    <div>
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: '#333333',
                          border: '1px solid #404040',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: '#333333',
                          border: '1px solid #404040',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateInvoiceItem(index, 'rate', Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: '#333333',
                          border: '1px solid #404040',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Total */}
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                background: '#333333', 
                borderRadius: '10px',
                border: '1px solid #404040'
              }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc' }}>Subtotal:</span>
                    <span style={{ fontWeight: 600, color: '#fbbf24' }}>
                      ${calculateInvoiceTotal().subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc' }}>Tax (10%):</span>
                    <span style={{ fontWeight: 600, color: '#fbbf24' }}>
                      ${calculateInvoiceTotal().tax.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, borderTop: '1px solid #404040', paddingTop: '8px' }}>
                    <span style={{ color: '#fbbf24' }}>Total:</span>
                    <span style={{ color: '#fbbf24' }}>
                      ${calculateInvoiceTotal().total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#fbbf24', 
                marginBottom: '8px' 
              }}>
                Notes
              </label>
              <textarea
                value={newInvoice.notes}
                onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: '#333333',
                  border: '1px solid #404040',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.9rem',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="filter-btn"
                style={{ background: '#404040' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                className="nav-btn"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50, 
          padding: '20px' 
        }}>
          <div style={{ 
            background: '#2a2a2a', 
            borderRadius: '15px', 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            padding: '30px',
            border: '1px solid #404040'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>
                  {selectedInvoice.invoiceNumber}
                </h3>
                <p style={{ color: '#ccc' }}>{selectedInvoice.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ 
                  color: '#999', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Bill To</h4>
                  <p style={{ color: '#ccc', marginBottom: '5px' }}>{selectedInvoice.clientName}</p>
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>{selectedInvoice.clientEmail}</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Invoice Details</h4>
                  <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p>
                      <span style={{ color: '#999' }}>Issue Date:</span>{' '}
                      <span style={{ color: '#ccc' }}>{format(selectedInvoice.issueDate, 'MMM d, yyyy')}</span>
                    </p>
                    <p>
                      <span style={{ color: '#999' }}>Due Date:</span>{' '}
                      <span style={{ color: '#ccc' }}>{format(selectedInvoice.dueDate, 'MMM d, yyyy')}</span>
                    </p>
                    {selectedInvoice.paidDate && (
                      <p>
                        <span style={{ color: '#999' }}>Paid Date:</span>{' '}
                        <span style={{ color: '#ccc' }}>{format(selectedInvoice.paidDate, 'MMM d, yyyy')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '15px' }}>Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px', 
                      background: '#333333', 
                      borderRadius: '8px',
                      border: '1px solid #404040'
                    }}>
                      <div>
                        <p style={{ fontWeight: 600, color: '#ccc', marginBottom: '4px' }}>{item.description}</p>
                        <p style={{ fontSize: '0.85rem', color: '#999' }}>{item.quantity} × ${item.rate}</p>
                      </div>
                      <span style={{ fontWeight: 700, color: '#fbbf24' }}>
                        ${item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #404040', paddingTop: '20px' }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc' }}>Subtotal:</span>
                    <span style={{ fontWeight: 600, color: '#fbbf24' }}>
                      ${selectedInvoice.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#ccc' }}>Tax:</span>
                    <span style={{ fontWeight: 600, color: '#fbbf24' }}>
                      ${selectedInvoice.tax.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    borderTop: '1px solid #404040',
                    paddingTop: '8px',
                    marginTop: '8px'
                  }}>
                    <span style={{ color: '#fbbf24' }}>Total:</span>
                    <span style={{ color: '#fbbf24' }}>
                      ${selectedInvoice.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Notes</h4>
                  <p style={{ 
                    color: '#ccc', 
                    background: '#333333', 
                    padding: '15px', 
                    borderRadius: '10px',
                    border: '1px solid #404040'
                  }}>
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
              <button className="filter-btn" style={{ background: '#404040' }}>
                Download PDF
              </button>
              {selectedInvoice.status === 'draft' && (
                <button 
                  onClick={() => {
                    setSelectedInvoice(null)
                    toast.success('Invoice sent!')
                  }}
                  className="nav-btn"
                >
                  Send Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}