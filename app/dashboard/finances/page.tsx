'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, CreditCard, Target, Calendar, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { format } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  account: string
  status: 'completed' | 'pending' | 'failed'
}

interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  balance: number
  currency: string
}

interface Budget {
  id: string
  category: string
  allocated: number
  spent: number
  remaining: number
  period: 'monthly' | 'quarterly' | 'yearly'
}

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: new Date(),
      description: 'Client Payment - ABC Corp',
      category: 'Revenue',
      amount: 15000,
      type: 'income',
      account: 'Business Checking',
      status: 'completed'
    },
    {
      id: '2',
      date: new Date(),
      description: 'Office Rent',
      category: 'Expenses',
      amount: 3500,
      type: 'expense',
      account: 'Business Checking',
      status: 'completed'
    }
  ])

  const [accounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Business Checking',
      type: 'checking',
      balance: 45000,
      currency: 'USD'
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 25000,
      currency: 'USD'
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 150000,
      currency: 'USD'
    }
  ])

  const [budgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Marketing',
      allocated: 10000,
      spent: 7500,
      remaining: 2500,
      period: 'monthly'
    },
    {
      id: '2',
      category: 'Operations',
      allocated: 15000,
      spent: 12000,
      remaining: 3000,
      period: 'monthly'
    }
  ])

  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budgets' | 'reports'>('overview')

  // Calculate financial metrics
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0)
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0))

  // Monthly revenue data for charts
  const monthlyData = [
    { month: 'Jan', income: 45000, expenses: 32000, profit: 13000 },
    { month: 'Feb', income: 52000, expenses: 35000, profit: 17000 },
    { month: 'Mar', income: 48000, expenses: 33000, profit: 15000 },
    { month: 'Apr', income: 55000, expenses: 38000, profit: 17000 },
    { month: 'May', income: 62000, expenses: 42000, profit: 20000 },
    { month: 'Jun', income: 58000, expenses: 40000, profit: 18000 }
  ]

  // Expense breakdown data
  const expenseData = [
    { name: 'Operations', value: 15000, color: '#667eea' },
    { name: 'Marketing', value: 8000, color: '#f59e0b' },
    { name: 'Salaries', value: 25000, color: '#10b981' },
    { name: 'Office', value: 5000, color: '#ef4444' }
  ]

  const getAccountTypeIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking': return <DollarSign size={20} />
      case 'savings': return <PieChart size={20} />
      case 'credit': return <CreditCard size={20} />
      case 'investment': return <TrendingUp size={20} />
      default: return <DollarSign size={20} />
    }
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    return type === 'income' ? (
      <ArrowUpRight size={16} style={{ color: '#10b981' }} />
    ) : (
      <ArrowDownRight size={16} style={{ color: '#ef4444' }} />
    )
  }

  return (
    <div>
      <div className="section-header">
        <h2>
          <DollarSign size={40} />
          Financial Dashboard
        </h2>
        <p>Monitor cash flow, budgets, and financial performance</p>
        <div style={{ marginTop: '20px' }}>
          <button
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => toast.success('Add Transaction clicked')}
          >
            <Plus size={20} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Income</div>
              <div className="member-rating">
                <div className="rating-value">${(totalIncome / 1000).toFixed(0)}K</div>
                <div className="rating-rank">This month</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <TrendingDown size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Expenses</div>
              <div className="member-rating">
                <div className="rating-value">${(totalExpenses / 1000).toFixed(0)}K</div>
                <div className="rating-rank">This month</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <BarChart3 size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Net Profit</div>
              <div className="member-rating">
                <div className="rating-value">${(netIncome / 1000).toFixed(0)}K</div>
                <div className="rating-rank">This month</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <DollarSign size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Cash Flow</div>
              <div className="member-rating">
                <div className="rating-value">${(totalAssets / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Available funds</div>
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
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview' ? 'filter-btn active' : 'filter-btn'}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={activeTab === 'transactions' ? 'filter-btn active' : 'filter-btn'}
            >
              Transactions <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{transactions.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={activeTab === 'budgets' ? 'filter-btn active' : 'filter-btn'}
            >
              Budgets <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{budgets.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={activeTab === 'reports' ? 'filter-btn active' : 'filter-btn'}
            >
              Reports
            </button>
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Accounts Overview */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Account Balances</h3>
                <div className="analytics-grid">
                  {accounts.map((account) => (
                    <div key={account.id} className="team-card">
                      <div className="card-header">
                        <div className="avatar">
                          {getAccountTypeIcon(account.type)}
                        </div>
                        <div className="member-info">
                          <div className="member-name">{account.name}</div>
                          <div className="member-rating">
                            <div className="rating-value" style={{ color: account.balance >= 0 ? '#10b981' : '#ef4444' }}>
                              ${Math.abs(account.balance).toLocaleString()}
                            </div>
                            <div className="rating-rank" style={{ textTransform: 'capitalize' }}>{account.type}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {/* Monthly Performance Chart */}
                <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Monthly Performance</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                        <XAxis dataKey="month" stroke="#ccc" />
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
                        <Bar dataKey="income" fill="#10B981" name="Income" />
                        <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Expense Breakdown</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseData.map((entry, index) => (
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
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Profit Trend */}
              <div style={{ background: '#2a2a2a', borderRadius: '15px', padding: '25px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '20px' }}>Profit Trend</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="month" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#2a2a2a', 
                          border: '1px solid #404040', 
                          borderRadius: '10px',
                          color: '#ccc'
                        }} 
                      />
                      <Area type="monotone" dataKey="profit" stroke="#10B981" fill="rgba(16, 185, 129, 0.3)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Recent Transactions</h3>
                <button 
                  onClick={() => toast.success('Export completed!')}
                  className="action-btn"
                >
                  Export
                </button>
              </div>
              
              {transactions.map((transaction) => (
                <div key={transaction.id} className="team-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: '#333333', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '5px' }}>{transaction.description}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#ccc' }}>{transaction.category} • {transaction.account}</p>
                        <p style={{ fontSize: '0.75rem', color: '#999' }}>{format(transaction.date, 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 700, 
                        color: transaction.type === 'income' ? '#10b981' : '#ef4444',
                        marginBottom: '5px'
                      }}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: transaction.status === 'completed' ? '#10b981' :
                                   transaction.status === 'pending' ? '#f59e0b' : '#ef4444',
                        color: 'white'
                      }}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'budgets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Budget Tracking</h3>
                <button 
                  className="nav-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => toast.success('Add Budget clicked')}
                >
                  <Plus size={16} />
                  <span>Add Budget</span>
                </button>
              </div>
              
              {budgets.map((budget) => (
                <div key={budget.id} className="team-card" style={{ padding: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>{budget.category}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#999', textTransform: 'capitalize' }}>{budget.period} budget</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                        ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#ccc' }}>Remaining: ${budget.remaining.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#999', marginBottom: '8px' }}>
                      <span>Spent</span>
                      <span>{Math.round((budget.spent / budget.allocated) * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', background: '#333333', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '12px', 
                          borderRadius: '10px', 
                          transition: 'width 0.3s ease',
                          background: (budget.spent / budget.allocated) > 0.9 ? '#ef4444' :
                                     (budget.spent / budget.allocated) > 0.7 ? '#f59e0b' : 'linear-gradient(90deg, #667eea, #764ba2)',
                          width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <BarChart3 size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Financial Reports</h3>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>Generate detailed financial reports and analytics</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => toast.success('P&L report generated!')}
                  className="nav-btn"
                >
                  P&L Report
                </button>
                <button 
                  onClick={() => toast.success('Cash flow report generated!')}
                  className="filter-btn"
                >
                  Cash Flow Report
                </button>
                <button 
                  onClick={() => toast.success('Tax report generated!')}
                  className="filter-btn"
                >
                  Tax Report
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
              <Target size={20} />
              Financial Health
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Profit Margin</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>32%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Growth Rate</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>+15%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Cash Ratio</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>2.3</span>
              </div>
            </div>
          </div>

          {/* Upcoming Bills */}
          <div className="chart-container">
            <h3>
              <Calendar size={20} />
              Upcoming Bills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {['Office Rent', 'Insurance Premium', 'Software Licenses'].map((bill, index) => (
                <div key={bill} className="team-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{bill}</span>
                    <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                      {index === 0 ? 'Due in 3 days' : index === 1 ? 'Due in 7 days' : 'Due in 12 days'}
                    </span>
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
                onClick={() => toast.success('Add Income clicked')}
              >
                <Plus size={16} />
                <span>Add Income</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Add Expense clicked')}
              >
                <Plus size={16} />
                <span>Add Expense</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Create Budget clicked')}
              >
                <Target size={16} />
                <span>Create Budget</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}