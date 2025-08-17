'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Plus, Search, Filter, Users, DollarSign, Calendar, Clock, Award, TrendingUp, Edit, Eye, Trash2, UserCheck } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  salary: number
  startDate: Date
  status: 'active' | 'inactive' | 'terminated' | 'on-leave'
  employeeId: string
  manager: string
  location: string
  avatar?: string
  skills: string[]
  performanceRating: number
}

interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  period: string
  grossPay: number
  deductions: number
  netPay: number
  status: 'pending' | 'processed' | 'paid'
  payDate: Date
}

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity'
  startDate: Date
  endDate: Date
  days: number
  status: 'pending' | 'approved' | 'denied'
  reason: string
  submittedDate: Date
}

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Developer',
      department: 'Engineering',
      salary: 95000,
      startDate: new Date('2022-01-15'),
      status: 'active',
      employeeId: 'EMP001',
      manager: 'Sarah Johnson',
      location: 'Remote',
      skills: ['React', 'Node.js', 'TypeScript'],
      performanceRating: 85
    },
    {
      id: '2',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 987-6543',
      position: 'UX Designer',
      department: 'Design',
      salary: 75000,
      startDate: new Date('2023-03-01'),
      status: 'active',
      employeeId: 'EMP002',
      manager: 'Mike Chen',
      location: 'New York',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      performanceRating: 92
    }
  ])

  const [payrollRecords] = useState<PayrollRecord[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      period: 'December 2024',
      grossPay: 7916,
      deductions: 1583,
      netPay: 6333,
      status: 'paid',
      payDate: new Date('2024-12-31')
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Emily Davis',
      period: 'December 2024',
      grossPay: 6250,
      deductions: 1250,
      netPay: 5000,
      status: 'processed',
      payDate: new Date('2024-12-31')
    }
  ])

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      type: 'vacation',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-22'),
      days: 7,
      status: 'pending',
      reason: 'Family vacation',
      submittedDate: new Date('2024-12-01')
    }
  ])

  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leave' | 'performance'>('employees')
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'inactive': return '#6b7280'
      case 'terminated': return '#ef4444'
      case 'on-leave': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getLeaveStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'approved': return '#10b981'
      case 'denied': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getPayrollStatusColor = (status: PayrollRecord['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b'
      case 'processed': return '#667eea'
      case 'paid': return '#10b981'
      default: return '#6b7280'
    }
  }

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const avgSalary = employees.reduce((sum, e) => sum + e.salary, 0) / employees.length
  const totalPayroll = payrollRecords.reduce((sum, p) => sum + p.netPay, 0)

  return (
    <div>
      <div className="section-header">
        <h2>
          <Briefcase size={40} />
          HR & Payroll
        </h2>
        <p>Manage employees, payroll, and human resources operations</p>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="nav-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* HR Overview Cards */}
      <div className="analytics-grid">
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Users size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Total Employees</div>
              <div className="member-rating">
                <div className="rating-value">{totalEmployees}</div>
                <div className="rating-rank">Team Members</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <UserCheck size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Active Employees</div>
              <div className="member-rating">
                <div className="rating-value">{activeEmployees}</div>
                <div className="rating-rank">Currently Working</div>
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
              <div className="member-name">Average Salary</div>
              <div className="member-rating">
                <div className="rating-value">${(avgSalary / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Per Employee</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="team-card">
          <div className="card-header">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="member-info">
              <div className="member-name">Monthly Payroll</div>
              <div className="member-rating">
                <div className="rating-value">${(totalPayroll / 1000).toFixed(0)}K</div>
                <div className="rating-rank">Total Cost</div>
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
              onClick={() => setActiveTab('employees')}
              className={activeTab === 'employees' ? 'filter-btn active' : 'filter-btn'}
            >
              Employees <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{employees.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={activeTab === 'payroll' ? 'filter-btn active' : 'filter-btn'}
            >
              Payroll <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{payrollRecords.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={activeTab === 'leave' ? 'filter-btn active' : 'filter-btn'}
            >
              Leave Requests <span style={{ marginLeft: '8px', background: '#404040', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{leaveRequests.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={activeTab === 'performance' ? 'filter-btn active' : 'filter-btn'}
            >
              Performance
            </button>
          </div>

          {activeTab === 'employees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Search and Filters */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 15px 12px 45px',
                      background: '#333333',
                      border: '1px solid #404040',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#404040'}
                  />
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  style={{
                    padding: '12px 15px',
                    background: '#333333',
                    border: '1px solid #404040',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              {/* Employee List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="team-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="avatar">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '3px' }}>
                            {employee.position} • {employee.department}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: '#999' }}>
                            ID: {employee.employeeId} • {employee.location}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>
                            ${employee.salary.toLocaleString()}
                          </p>
                          <span style={{
                            display: 'inline-flex',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: getStatusColor(employee.status),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}>
                            {employee.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <Eye size={16} />
                          </button>
                          <button className="action-btn">
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Payroll Records</h3>
                <button 
                  className="nav-btn"
                  onClick={() => toast.success('Process Payroll clicked')}
                >
                  Process Payroll
                </button>
              </div>
              
              {payrollRecords.map((record) => (
                <div key={record.id} className="team-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                        {record.employeeName}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px' }}>
                        {record.period} • ID: {record.employeeId}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>
                        Pay Date: {format(record.payDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', color: '#999' }}>Gross</p>
                          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#ccc' }}>${record.grossPay}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', color: '#999' }}>Deductions</p>
                          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#ef4444' }}>-${record.deductions}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.8rem', color: '#999' }}>Net Pay</p>
                          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24' }}>${record.netPay}</p>
                        </div>
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: getPayrollStatusColor(record.status),
                        color: 'white',
                        textTransform: 'capitalize'
                      }}>
                        {record.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leave' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fbbf24' }}>Leave Requests</h3>
                <button 
                  className="nav-btn"
                  onClick={() => toast.success('Request Leave clicked')}
                >
                  Request Leave
                </button>
              </div>
              
              {leaveRequests.map((request) => (
                <div key={request.id} className="team-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fbbf24', marginBottom: '5px' }}>
                        {request.employeeName}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '5px', textTransform: 'capitalize' }}>
                        {request.type} Leave • {request.days} days
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>
                        {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d, yyyy')}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                        Reason: {request.reason}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '10px' }}>
                        Submitted: {format(request.submittedDate, 'MMM d, yyyy')}
                      </p>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: getLeaveStatusColor(request.status),
                        color: 'white',
                        textTransform: 'capitalize',
                        marginBottom: '10px'
                      }}>
                        {request.status}
                      </span>
                      {request.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="action-btn"
                            style={{ background: '#10b981' }}
                            onClick={() => toast.success('Leave approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="action-btn"
                            style={{ background: '#ef4444' }}
                            onClick={() => toast.error('Leave denied')}
                          >
                            Deny
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Award size={64} style={{ color: '#667eea', margin: '0 auto 20px', opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fbbf24', marginBottom: '10px' }}>Performance Reviews</h3>
              <p style={{ color: '#ccc', marginBottom: '30px' }}>Track employee performance and conduct reviews</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => toast.success('Performance review started')}
                  className="nav-btn"
                >
                  Start Review
                </button>
                <button 
                  onClick={() => toast.success('Performance report generated')}
                  className="filter-btn"
                >
                  View Reports
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
              <TrendingUp size={20} />
              HR Metrics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Retention Rate</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>94%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Avg Performance</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>88%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ opacity: 0.8 }}>Open Positions</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>3</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="chart-container">
            <h3>
              <Clock size={20} />
              Recent Activities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {['New hire onboarding', 'Performance review due', 'Leave request pending'].map((activity, index) => (
                <div key={activity} className="team-card" style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#667eea'
                    }} />
                    <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{activity}</span>
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
                onClick={() => toast.success('Add Employee clicked')}
              >
                <Plus size={16} />
                <span>Add Employee</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Process Payroll clicked')}
              >
                <DollarSign size={16} />
                <span>Process Payroll</span>
              </button>
              <button 
                className="action-btn" 
                style={{ width: '100%' }}
                onClick={() => toast.success('Schedule Review clicked')}
              >
                <Calendar size={16} />
                <span>Schedule Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
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
            padding: '30px', 
            width: '100%', 
            maxWidth: '600px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            border: '1px solid #404040'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h2>
              <button
                onClick={() => setSelectedEmployee(null)}
                style={{ 
                  color: '#999', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '25px' }}>
              <div style={{ background: '#333333', borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '5px' }}>Position</p>
                <p style={{ fontWeight: 600, color: '#ccc' }}>{selectedEmployee.position}</p>
              </div>
              <div style={{ background: '#333333', borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '5px' }}>Department</p>
                <p style={{ fontWeight: 600, color: '#ccc' }}>{selectedEmployee.department}</p>
              </div>
              <div style={{ background: '#333333', borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '5px' }}>Salary</p>
                <p style={{ fontWeight: 600, color: '#ccc' }}>${selectedEmployee.salary.toLocaleString()}</p>
              </div>
              <div style={{ background: '#333333', borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '5px' }}>Performance</p>
                <p style={{ fontWeight: 600, color: '#ccc' }}>{selectedEmployee.performanceRating}%</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="nav-btn" style={{ flex: 1 }}>
                Edit Employee
              </button>
              <button className="filter-btn" style={{ flex: 1 }}>
                View Performance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}