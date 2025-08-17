'use client'

import { useState, useEffect } from 'react'
import { UserCheck, Plus, Search, Filter, Phone, Mail, MapPin, Building, Star, TrendingUp, DollarSign, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  address: string
  value: number
  status: 'lead' | 'prospect' | 'customer' | 'inactive'
  source: string
  lastContact: Date
  nextFollowUp?: Date
  notes: string
  tags: string[]
  avatar?: string
}

interface Deal {
  id: string
  title: string
  customerId: string
  customerName: string
  value: number
  stage: 'lead' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  probability: number
  expectedCloseDate: Date
  description: string
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [deals, setDeals] = useState<Deal[]>([])

  const [activeTab, setActiveTab] = useState<'customers' | 'deals' | 'pipeline'>('customers')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    source: '',
    notes: ''
  })

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'lead': return '#f59e0b'
      case 'prospect': return '#667eea'
      case 'customer': return '#10b981'
      case 'inactive': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStageColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'lead': return '#f59e0b'
      case 'proposal': return '#667eea'
      case 'negotiation': return '#fb923c'
      case 'closed-won': return '#10b981'
      case 'closed-lost': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const totalCustomerValue = customers.reduce((sum, customer) => sum + customer.value, 0)
  const totalDealsValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const avgDealSize = deals.length > 0 ? totalDealsValue / deals.length : 0

  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Please fill in required fields')
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      value: 0,
      status: 'lead',
      lastContact: new Date(),
      tags: []
    }

    setCustomers([customer, ...customers])
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      address: '',
      source: '',
      notes: ''
    })
    setShowCustomerModal(false)
    toast.success('Customer added successfully!')
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <UserCheck size={40} />
          Customer Relationship Management
        </h2>
        <p>Manage customers, deals, and sales pipeline</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowCustomerModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <UserCheck size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Customers</div>
              <div className="member-rating">
                <div className="rating-value">{customers.length}</div>
                <div className="rating-rank">Active accounts</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <DollarSign size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Customer Value</div>
              <div className="member-rating">
                <div className="rating-value">${(totalCustomerValue / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Total value</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <TrendingUp size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Active Deals</div>
              <div className="member-rating">
                <div className="rating-value">{deals.filter(d => !d.stage.includes('closed')).length}</div>
                <div className="rating-rank">In pipeline</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar">
              <Star size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Avg Deal Size</div>
              <div className="member-rating">
                <div className="rating-value">${(avgDealSize / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Per deal</div>
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
                onClick={() => setActiveTab('customers')}
                className={activeTab === 'customers' ? 'filter-btn active' : 'filter-btn'}
              >
                Customers
                {customers.length > 0 && (
                  <span style={{ marginLeft: '8px', opacity: 0.8 }}>({customers.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={activeTab === 'deals' ? 'filter-btn active' : 'filter-btn'}
              >
                Deals
                {deals.length > 0 && (
                  <span style={{ marginLeft: '8px', opacity: 0.8 }}>({deals.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('pipeline')}
                className={activeTab === 'pipeline' ? 'filter-btn active' : 'filter-btn'}
              >
                Sales Pipeline
              </button>
            </div>
          </div>

          {activeTab === 'customers' && (
            <>
              {/* Search and Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={18} />
                  <input
                    type="text"
                    placeholder="Search customers..."
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
                  <option value="lead">Leads</option>
                  <option value="prospect">Prospects</option>
                  <option value="customer">Customers</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Customers List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredCustomers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
                    <UserCheck size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No customers found</p>
                    <p style={{ fontSize: '0.9rem' }}>Add your first customer to get started</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div key={customer.id} className="team-card" style={{ padding: '20px' }}>
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
                            fontSize: '1.2rem',
                            color: 'white'
                          }}>
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                              {customer.name}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                              {customer.position} at {customer.company}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem', color: '#999' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Mail size={12} />
                                <span>{customer.email}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Phone size={12} />
                                <span>{customer.phone}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={12} />
                                <span>{customer.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: getStatusColor(customer.status),
                              color: 'white'
                            }}>
                              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                            </span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24' }}>
                              ${customer.value.toLocaleString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '10px' }}>
                            Last contact: {format(customer.lastContact, 'MMM d')}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="action-btn"
                              style={{ padding: '6px' }}
                            >
                              <Eye size={14} />
                            </button>
                            <button className="action-btn" style={{ padding: '6px' }}>
                              <Edit size={14} />
                            </button>
                            <button className="action-btn" style={{ padding: '6px', background: '#ef4444' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      {customer.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '15px' }}>
                          {customer.tags.map((tag, index) => (
                            <span key={index} style={{
                              fontSize: '0.75rem',
                              background: '#667eea',
                              color: 'white',
                              padding: '3px 10px',
                              borderRadius: '12px'
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'deals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {deals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
                  <TrendingUp size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>No deals yet</p>
                  <p style={{ fontSize: '0.9rem' }}>Create your first deal to track sales</p>
                </div>
              ) : (
                deals.map((deal) => (
                  <div key={deal.id} className="team-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                          {deal.title}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>{deal.customerName}</p>
                        <p style={{ fontSize: '0.85rem', color: '#999' }}>{deal.description}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: getStageColor(deal.stage),
                            color: 'white'
                          }}>
                            {deal.stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24' }}>
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#999' }}>
                          <p>{deal.probability}% probability</p>
                          <p>Expected: {format(deal.expectedCloseDate, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#999' }}>Deal Progress</span>
                        <span style={{ fontSize: '0.85rem', color: '#999' }}>{deal.probability}%</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        background: '#333333', 
                        borderRadius: '5px', 
                        height: '8px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            height: '8px', 
                            borderRadius: '5px', 
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                            transition: 'width 0.3s ease',
                            width: `${deal.probability}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {['lead', 'proposal', 'negotiation', 'closed-won', 'closed-lost'].map((stage) => (
                <div key={stage} style={{ 
                  background: '#333333', 
                  borderRadius: '12px', 
                  padding: '20px',
                  border: '1px solid #404040'
                }}>
                  <h4 style={{ 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '15px', 
                    textTransform: 'capitalize' 
                  }}>
                    {stage.replace('-', ' ')}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {deals.filter(deal => deal.stage === stage).map((deal) => (
                      <div key={deal.id} style={{ 
                        background: '#2a2a2a', 
                        padding: '12px', 
                        borderRadius: '8px',
                        border: '1px solid #404040'
                      }}>
                        <h5 style={{ fontWeight: 600, color: '#ccc', fontSize: '0.9rem', marginBottom: '5px' }}>
                          {deal.title}
                        </h5>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '8px' }}>{deal.customerName}</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                          ${deal.value.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Recent Activity */}
          <div className="chart-container">
            <h3>
              <Calendar size={20} />
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {['New lead: John Smith', 'Deal closed: $45K', 'Meeting scheduled'].map((activity, index) => (
                <div key={index} className="team-card" style={{ padding: '12px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#ccc' }}>{activity}</p>
                  <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>
                    {index === 0 ? '2 hours ago' : index === 1 ? 'Yesterday' : '3 days ago'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Stats */}
          <div className="chart-container">
            <h3>
              <TrendingUp size={20} />
              Conversion Rates
            </h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Lead to Customer</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#10b981' }}>32%</span>
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
                      width: '32%'
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>Deal Win Rate</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fbbf24' }}>65%</span>
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
                      width: '65%'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showCustomerModal && (
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
            maxWidth: '500px', 
            width: '100%', 
            maxHeight: '90vh', 
            overflowY: 'auto', 
            padding: '30px',
            border: '1px solid #404040'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>
              Add New Customer
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Full name"
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
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="+1 (555) 123-4567"
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
                    Company
                  </label>
                  <input
                    type="text"
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    color: '#fbbf24', 
                    marginBottom: '8px' 
                  }}>
                    Position
                  </label>
                  <input
                    type="text"
                    value={newCustomer.position}
                    onChange={(e) => setNewCustomer({ ...newCustomer, position: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Job title"
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
                    Source
                  </label>
                  <select
                    value={newCustomer.source}
                    onChange={(e) => setNewCustomer({ ...newCustomer, source: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#fbbf24', 
                  marginBottom: '8px' 
                }}>
                  Address
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="City, State"
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
                  Notes
                </label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
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
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="filter-btn"
                style={{ background: '#404040' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                className="nav-btn"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && (
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24' }}>{selectedCustomer.name}</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '15px' }}>Contact Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} style={{ color: '#999' }} />
                    <span style={{ color: '#ccc' }}>{selectedCustomer.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={16} style={{ color: '#999' }} />
                    <span style={{ color: '#ccc' }}>{selectedCustomer.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building size={16} style={{ color: '#999' }} />
                    <span style={{ color: '#ccc' }}>{selectedCustomer.company}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} style={{ color: '#999' }} />
                    <span style={{ color: '#ccc' }}>{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '15px' }}>Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>Status</span>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: getStatusColor(selectedCustomer.status),
                      color: 'white',
                      marginLeft: '10px'
                    }}>
                      {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>Customer Value</span>
                    <p style={{ fontWeight: 700, color: '#fbbf24', fontSize: '1.1rem', marginTop: '2px' }}>
                      ${selectedCustomer.value.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>Source</span>
                    <p style={{ color: '#ccc', marginTop: '2px' }}>{selectedCustomer.source}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#999' }}>Last Contact</span>
                    <p style={{ color: '#ccc', marginTop: '2px' }}>
                      {format(selectedCustomer.lastContact, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div style={{ marginTop: '25px' }}>
                <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Notes</h4>
                <p style={{ 
                  color: '#ccc', 
                  background: '#333333', 
                  padding: '15px', 
                  borderRadius: '10px',
                  border: '1px solid #404040'
                }}>
                  {selectedCustomer.notes}
                </p>
              </div>
            )}

            {selectedCustomer.tags.length > 0 && (
              <div style={{ marginTop: '25px' }}>
                <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Tags</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedCustomer.tags.map((tag, index) => (
                    <span key={index} style={{
                      fontSize: '0.8rem',
                      background: '#667eea',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '15px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}