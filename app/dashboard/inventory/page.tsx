'use client'

import { useState, useEffect } from 'react'
import { Package, Plus, Search, Filter, TrendingDown, AlertTriangle, BarChart3, Truck, Edit, Eye, Trash2, ShoppingCart } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  description: string
  quantity: number
  minStock: number
  maxStock: number
  unitPrice: number
  totalValue: number
  supplier: string
  location: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued'
  lastRestocked: Date
  expiryDate?: Date
  tags: string[]
}

interface StockMovement {
  id: string
  itemId: string
  itemName: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  date: Date
  user: string
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])

  const [stockMovements] = useState<StockMovement[]>([])

  const [activeTab, setActiveTab] = useState<'inventory' | 'movements' | 'reports'>('inventory')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showItemModal, setShowItemModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: '',
    location: ''
  })

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800'
      case 'low-stock': return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock': return 'bg-red-100 text-red-800'
      case 'discontinued': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock': return <Package size={16} />
      case 'low-stock': return <AlertTriangle size={16} />
      case 'out-of-stock': return <TrendingDown size={16} />
      default: return <Package size={16} />
    }
  }

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventoryItems.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length
  const categories = [...new Set(inventoryItems.map(item => item.category))]

  const handleCreateItem = () => {
    if (!newItem.name || !newItem.sku) {
      toast.error('Please fill in required fields')
      return
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      totalValue: newItem.quantity * newItem.unitPrice,
      status: newItem.quantity <= newItem.minStock ? 'low-stock' : 'in-stock',
      lastRestocked: new Date(),
      tags: []
    }

    setInventoryItems([item, ...inventoryItems])
    setNewItem({
      name: '',
      sku: '',
      category: '',
      description: '',
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      supplier: '',
      location: ''
    })
    setShowItemModal(false)
    toast.success('Item added successfully!')
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-slate-600 mt-2">Track stock levels, manage suppliers, and monitor inventory</p>
        </div>
        <button
          onClick={() => setShowItemModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="font-medium">Add Item</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Total Items</p>
              <p className="text-3xl font-bold">{inventoryItems.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Package className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold">${(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Low Stock Alerts</p>
              <p className="text-3xl font-bold">{lowStockItems}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Categories</p>
              <p className="text-3xl font-bold">{categories.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Truck className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'inventory', label: 'Inventory', count: inventoryItems.length },
              { id: 'movements', label: 'Stock Movements', count: stockMovements.length },
              { id: 'reports', label: 'Reports', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-slate-100 text-slate-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'inventory' && (
            <>
              {/* Search and Filter */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Inventory Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{item.name}</h4>
                        <p className="text-sm text-slate-600">{item.sku}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                      </div>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status.replace('-', ' ')}</span>
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Quantity:</span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Unit Price:</span>
                        <span className="font-medium">${item.unitPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Total Value:</span>
                        <span className="font-semibold text-green-600">${item.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Location:</span>
                        <span className="text-slate-800">{item.location}</span>
                      </div>
                    </div>

                    {/* Stock Level Indicator */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Stock Level</span>
                        <span>{item.quantity} / {item.maxStock}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.quantity <= item.minStock ? 'bg-red-500' :
                            item.quantity <= item.minStock * 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Restocked: {format(item.lastRestocked, 'MMM d')}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => toast.success('Reorder initiated!')}
                          className="p-1.5 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'movements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Recent Stock Movements</h3>
              {stockMovements.map((movement) => (
                <div key={movement.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">{movement.itemName}</h4>
                      <p className="text-sm text-slate-600">{movement.reason}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {movement.user} • {format(movement.date, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        movement.type === 'in' ? 'bg-green-100 text-green-800' :
                        movement.type === 'out' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{movement.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Inventory Reports</h3>
              <p className="text-slate-600 mb-4">Generate detailed reports on inventory performance</p>
              <button className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors">
                Generate Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Add New Item</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SKU *</label>
                <input
                  type="text"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="SKU-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Electronics, Furniture, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Supplier</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Supplier name"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                rows={3}
                placeholder="Item description..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Min Stock</label>
                <input
                  type="number"
                  value={newItem.minStock}
                  onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Max Stock</label>
                <input
                  type="number"
                  value={newItem.maxStock}
                  onChange={(e) => setNewItem({ ...newItem, maxStock: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 bg-white"
                  placeholder="Warehouse A, Room 101, etc."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowItemModal(false)}
                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{selectedItem.name}</h3>
                <p className="text-slate-600">{selectedItem.sku}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Item Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-500">Category</span>
                    <p className="font-medium text-slate-800">{selectedItem.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Description</span>
                    <p className="text-slate-700">{selectedItem.description}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Supplier</span>
                    <p className="text-slate-700">{selectedItem.supplier}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Location</span>
                    <p className="text-slate-700">{selectedItem.location}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Stock Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-500">Current Stock</span>
                    <p className="text-2xl font-bold text-slate-800">{selectedItem.quantity}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-slate-500">Min Stock</span>
                      <p className="font-medium text-slate-800">{selectedItem.minStock}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-500">Max Stock</span>
                      <p className="font-medium text-slate-800">{selectedItem.maxStock}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Unit Price</span>
                    <p className="font-semibold text-slate-800">${selectedItem.unitPrice}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Total Value</span>
                    <p className="text-xl font-bold text-green-600">${selectedItem.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-sm text-slate-500">Last Restocked</span>
              <p className="text-slate-700">{format(selectedItem.lastRestocked, 'MMM d, yyyy')}</p>
            </div>

            {selectedItem.tags.length > 0 && (
              <div className="mt-6">
                <span className="text-sm text-slate-500 block mb-2">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
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