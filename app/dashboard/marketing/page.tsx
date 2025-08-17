'use client'

import { useState, useEffect } from 'react'
import { Megaphone, Plus, TrendingUp, Users, Eye, MousePointer, DollarSign, Target, Calendar, Edit, Trash2, Play, Pause, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import toast from 'react-hot-toast'

interface Campaign {
  id: string
  name: string
  description: string
  type: 'email' | 'social' | 'ppc' | 'content' | 'display'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  budget: number
  spent: number
  startDate: Date
  endDate: Date
  targetAudience: string
  goals: string[]
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
    roas: number
  }
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  value: number
  campaignId: string
  createdDate: Date
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q1 Email Campaign',
      description: 'Quarterly newsletter and product updates',
      type: 'email',
      status: 'active',
      budget: 5000,
      spent: 3200,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      targetAudience: 'Existing customers',
      goals: ['Increase engagement', 'Drive sales'],
      metrics: {
        impressions: 45000,
        clicks: 2250,
        conversions: 180,
        ctr: 5.0,
        cpc: 1.42,
        roas: 3.2
      }
    },
    {
      id: '2',
      name: 'Social Media Ads',
      description: 'Facebook and Instagram advertising campaign',
      type: 'social',
      status: 'active',
      budget: 8000,
      spent: 5600,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      targetAudience: 'New prospects',
      goals: ['Brand awareness', 'Lead generation'],
      metrics: {
        impressions: 120000,
        clicks: 3600,
        conversions: 220,
        ctr: 3.0,
        cpc: 1.56,
        roas: 2.8
      }
    }
  ])

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      source: 'Email Campaign',
      status: 'qualified',
      value: 2500,
      campaignId: '1',
      createdDate: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      source: 'Social Media',
      status: 'new',
      value: 1800,
      campaignId: '2',
      createdDate: new Date('2024-01-12')
    }
  ])

  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads' | 'analytics' | 'automation'>('campaigns')
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'draft': return '#6b7280'
      case 'active': return '#10b981'
      case 'paused': return '#f59e0b'
      case 'completed': return '#667eea'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getLeadStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#667eea'
      case 'contacted': return '#f59e0b'
      case 'qualified': return '#8b5cf6'
      case 'converted': return '#10b981'
      case 'lost': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getCampaignTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return '📧'
      case 'social': return '📱'
      case 'ppc': return '💰'
      case 'content': return '📝'
      case 'display': return '🖼️'
      default: return '📢'
    }
  }

  // Analytics data
  const campaignPerformance = campaigns.map(campaign => ({
    name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
    impressions: campaign.metrics.impressions,
    clicks: campaign.metrics.clicks,
    conversions: campaign.metrics.conversions,
    roas: campaign.metrics.roas
  }))

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0)
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.metrics.impressions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.metrics.clicks, 0)
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.metrics.conversions, 0)
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0

  const campaignTypeData = [
    { name: 'Email', value: campaigns.filter(c => c.type === 'email').length, color: '#667eea' },
    { name: 'Social', value: campaigns.filter(c => c.type === 'social').length, color: '#06B6D4' },
    { name: 'PPC', value: campaigns.filter(c => c.type === 'ppc').length, color: '#10B981' },
    { name: 'Content', value: campaigns.filter(c => c.type === 'content').length, color: '#F59E0B' },
    { name: 'Display', value: campaigns.filter(c => c.type === 'display').length, color: '#EF4444' }
  ].filter(item => item.value > 0)

  return (
    <div>
      <div className="section-header">
        <h2>
          <Megaphone size={40} />
          Marketing Dashboard
        </h2>
        <p>Manage campaigns, track performance, and optimize marketing efforts</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Marketing Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <DollarSign size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Budget</div>
              <div className="member-rating">
                <div className="rating-value">${(totalBudget / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Allocated</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Spent</div>
              <div className="member-rating">
                <div className="rating-value">${(totalSpent / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Used Budget</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Eye size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Impressions</div>
              <div className="member-rating">
                <div className="rating-value">{(totalImpressions / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Total Views</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <MousePointer size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Conversions</div>
              <div className="member-rating">
                <div className="rating-value">{totalConversions}</div>
                <div className="rating-rank">Total Sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-row">
        {/* Tab Content */}
        <div className="chart-container large">
          <div className="filters" style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={activeTab === 'campaigns' ? 'filter-btn active' : 'filter-btn'}
            >
              Campaigns <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{campaigns.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={activeTab === 'leads' ? 'filter-btn active' : 'filter-btn'}
            >
              Leads <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{leads.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={activeTab === 'analytics' ? 'filter-btn active' : 'filter-btn'}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={activeTab === 'automation' ? 'filter-btn active' : 'filter-btn'}
            >
              Automation
            </button>
          </div>

          {activeTab === 'campaigns' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Active Campaigns</h3>
                <button 
                  className="nav-btn"
                  onClick={() => setShowCampaignModal(true)}
                >
                  Create Campaign
                </button>
              </div>
              
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="team-card" style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: '#333333', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {getCampaignTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.2rem', color: '#fbbf24', marginBottom: '5px' }}>
                          {campaign.name}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>
                          {campaign.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{
                            display: 'inline-flex',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: getStatusColor(campaign.status),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}>
                            {campaign.status}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'capitalize' }}>
                            {campaign.type} Campaign
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                        ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>
                        {format(campaign.startDate, 'MMM d')} - {format(campaign.endDate, 'MMM d, yyyy')}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button className="action-btn">
                          <Edit size={16} />
                        </button>
                        <button className="action-btn">
                          {campaign.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button className="action-btn">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '15px',
                    paddingTop: '20px',
                    borderTop: '1px solid #404040'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                        {(campaign.metrics.impressions / 1000).toFixed(0)}K
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>Impressions</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                        {campaign.metrics.clicks.toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>Clicks</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                        {campaign.metrics.conversions}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>Conversions</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                        {campaign.metrics.ctr.toFixed(1)}%
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>CTR</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                        {campaign.metrics.roas.toFixed(1)}x
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>ROAS</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Marketing Leads</h3>
                <button 
                  className="nav-btn"
                  onClick={() => toast.success('Export leads clicked')}
                >
                  Export Leads
                </button>
              </div>
              
              {leads.map((lead) => (
                <div key={lead.id} className="team-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="avatar">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                          {lead.name}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '3px' }}>
                          {lead.email} • {lead.phone}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#999' }}>
                          Source: {lead.source} • {format(lead.createdDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                        ${lead.value.toLocaleString()}
                      </p>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: getLeadStatusColor(lead.status),
                        color: 'white',
                        textTransform: 'capitalize'
                      }}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Campaign Performance Chart */}
              <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Campaign Performance</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#2a2a2a', 
                          border: '1px solid #404040', 
                          borderRadius: '10px',
                          color: '#ccc'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="impressions" fill="#667eea" name="Impressions" />
                      <Bar dataKey="clicks" fill="#f59e0b" name="Clicks" />
                      <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Campaign Types Distribution */}
              {campaignTypeData.length > 0 && (
                <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Campaign Types</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={campaignTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {campaignTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            background: '#2a2a2a', 
                            border: '1px solid #404040', 
                            borderRadius: '10px',
                            color: '#ccc'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'automation' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Target size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Marketing Automation</h3>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>Set up automated marketing workflows and sequences</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => toast.success('Email sequence created')}
                  className="nav-btn"
                >
                  Create Email Sequence
                </button>
                <button 
                  onClick={() => toast.success('Workflow triggered')}
                  className="filter-btn"
                >
                  Setup Workflow
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Quick Stats */}
          <div className="chart-container">
            <h3>
              <BarChart3 size={20} />
              Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Average CTR</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{avgCTR.toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Budget Used</span>
                <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Active Campaigns</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>{campaigns.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="chart-container">
            <h3>
              <Calendar size={20} />
              Campaign Schedule
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {campaigns.slice(0, 3).map((campaign, index) => (
                <div key={campaign.id} className="team-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getStatusColor(campaign.status)
                    }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', color: '#ccc', display: 'block' }}>{campaign.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        Ends {format(campaign.endDate, 'MMM d')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="chart-container">
            <h3>
              <Plus size={20} />
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Email campaign created')}
              >
                <Plus size={16} />
                <span>Email Campaign</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Social ads created')}
              >
                <TrendingUp size={16} />
                <span>Social Ads</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Analytics report generated')}
              >
                <BarChart3 size={16} />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}