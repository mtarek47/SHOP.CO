import React, { useEffect, useState } from 'react'
import './AdminPage.css'

const AdminPage = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'orders'
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  
  // Loading states
  const [loadingProds, setLoadingProds] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form State for Add/Edit Product
  const [editingProduct, setEditingProduct] = useState(null) // null for Add, product object for Edit
  const [showProductModal, setShowProductModal] = useState(false)
  const [prodName, setProdName] = useState('')
  const [prodPrice, setProdPrice] = useState('')
  const [prodOriginalPrice, setProdOriginalPrice] = useState('')
  const [prodDiscount, setProdDiscount] = useState('')
  const [prodImage, setProdImage] = useState('')
  const [prodCategory, setProdCategory] = useState('casual')
  const [prodDesc, setProdDesc] = useState('')
  const [prodColors, setProdColors] = useState('')
  const [prodSizes, setProdSizes] = useState('')

  const API_URL = 'http://localhost:5000/api'

  useEffect(() => {
    loadProducts()
    loadOrders()
  }, [])

  const loadProducts = async () => {
    setLoadingProds(true)
    try {
      const res = await fetch(`${API_URL}/products`)
      const data = await res.json()
      if (res.ok) {
        setProducts(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProds(false)
    }
  }

  const loadOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setOrders(data)
      } else {
        setErrorMsg(data.message || 'Unauthorized: Admin role required')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to load orders from backend server.')
    } finally {
      setLoadingOrders(false)
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setProdName('')
    setProdPrice('')
    setProdOriginalPrice('')
    setProdDiscount('')
    setProdImage('')
    setProdCategory('casual')
    setProdDesc('')
    setProdColors('#000000,#FFFFFF')
    setProdSizes('Small,Medium,Large,X-Large')
    setShowProductModal(true)
  }

  const openEditModal = (p) => {
    setEditingProduct(p)
    setProdName(p.name)
    setProdPrice(p.price)
    setProdOriginalPrice(p.originalPrice || '')
    setProdDiscount(p.discount || 0)
    setProdImage(p.image)
    setProdCategory(p.category)
    setProdDesc(p.description)
    setProdColors(p.colors ? p.colors.join(',') : '')
    setProdSizes(p.sizes ? p.sizes.join(',') : '')
    setShowProductModal(true)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const payload = {
      name: prodName,
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      discount: prodDiscount ? Number(prodDiscount) : 0,
      image: prodImage,
      category: prodCategory,
      description: prodDesc,
      colors: prodColors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: prodSizes.split(',').map(s => s.trim()).filter(Boolean)
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const url = editingProduct 
        ? `${API_URL}/admin/products/${editingProduct._id}` 
        : `${API_URL}/admin/products`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg(editingProduct ? 'Product updated!' : 'Product added!')
        setShowProductModal(false)
        loadProducts()
      } else {
        setErrorMsg(data.message || 'Operation failed')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server.')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        setSuccessMsg('Product deleted successfully')
        loadProducts()
      } else {
        const data = await res.json()
        setErrorMsg(data.message || 'Delete failed')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to server.')
    }
  }

  const handleUpdateDelivery = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setSuccessMsg('Delivery status updated!')
        loadOrders()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdatePayment = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setSuccessMsg('Payment status updated!')
        loadOrders()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <button onClick={onNavigateHome} className="admin-back-btn">Back to Store</button>
      </div>

      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}
      {errorMsg && <div className="admin-alert admin-alert-error">{errorMsg}</div>}

      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Fulfill Orders ({orders.length})
        </button>
      </div>

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div className="admin-tab-content">
          <div className="tab-actions-header">
            <h2>Catalog Products ({products.length})</h2>
            <button onClick={openAddModal} className="admin-add-prod-btn">+ Add New Product</button>
          </div>

          {loadingProds ? (
            <p>Loading products...</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.image} alt={p.name} className="table-thumbnail" />
                      </td>
                      <td style={{ fontWeight: '600' }}>{p.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                      <td>BDT {p.price}</td>
                      <td>{p.discount}%</td>
                      <td>
                        <button onClick={() => openEditModal(p)} className="action-btn-edit">Edit</button>
                        <button onClick={() => handleDeleteProduct(p._id)} className="action-btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div className="admin-tab-content">
          <h2>Customer Orders</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Method</th>
                    <th>Payment Status</th>
                    <th>Delivery Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>{o._id}</td>
                      <td>
                        <div><strong>{o.user?.name || 'Guest'}</strong></div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>{o.user?.email}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>
                          {o.shippingAddress?.address}, {o.shippingAddress?.city}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>BDT {o.totalAmount}</td>
                      <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>{o.paymentMethod}</td>
                      <td>
                        <select 
                          value={o.paymentStatus}
                          onChange={(e) => handleUpdatePayment(o._id, e.target.value)}
                          className={`status-select status-pay-${o.paymentStatus}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td>
                        <select 
                          value={o.deliveryStatus}
                          onChange={(e) => handleUpdateDelivery(o._id, e.target.value)}
                          className={`status-select status-del-${o.deliveryStatus}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td style={{ fontSize: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ADD/EDIT PRODUCT MODAL ── */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="admin-modal-close" onClick={() => setShowProductModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" required value={prodName} onChange={e => setProdName(e.target.value)} placeholder="e.g. Vintage Denim Jacket" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (BDT)</label>
                  <input type="number" required value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="150" />
                </div>
                <div className="form-group">
                  <label>Original Price (Optional)</label>
                  <input type="number" value={prodOriginalPrice} onChange={e => setProdOriginalPrice(e.target.value)} placeholder="200" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input type="number" value={prodDiscount} onChange={e => setProdDiscount(e.target.value)} placeholder="20" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={prodCategory} onChange={e => setProdCategory(e.target.value)}>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="party">Party</option>
                    <option value="gym">Gym</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input type="text" required value={prodImage} onChange={e => setProdImage(e.target.value)} placeholder="https://placehold.co/400x480..." />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea required value={prodDesc} onChange={e => setProdDesc(e.target.value)} rows="3" placeholder="Provide product descriptions..."></textarea>
              </div>

              <div className="form-group">
                <label>Available Colors (comma-separated hex codes)</label>
                <input type="text" value={prodColors} onChange={e => setProdColors(e.target.value)} placeholder="#000000,#FFFFFF,#4F4FF1" />
              </div>

              <div className="form-group">
                <label>Available Sizes (comma-separated)</label>
                <input type="text" value={prodSizes} onChange={e => setProdSizes(e.target.value)} placeholder="Small,Medium,Large,X-Large" />
              </div>

              <button className="admin-submit-btn" type="submit">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
