import React, { useEffect, useState } from 'react'
import './AdminPage.css'

const AdminPage = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'orders' | 'settings'
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterBrand, setFilterBrand] = useState('all')

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
  const [prodBackViewImage, setProdBackViewImage] = useState('')
  const [prodModelViewImage, setProdModelViewImage] = useState('')
  const [prodCategory, setProdCategory] = useState('casual')
  const [prodBrand, setProdBrand] = useState('')
  const [prodIsOnSale, setProdIsOnSale] = useState(false)
  const [prodIsNewArrival, setProdIsNewArrival] = useState(false)
  const [prodDesc, setProdDesc] = useState('')
  const [prodColors, setProdColors] = useState('')
  const [prodSizes, setProdSizes] = useState('')

  // Hero Section Settings States
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDesc, setHeroDesc] = useState('')
  const [heroImgUrl, setHeroImgUrl] = useState('')
  const [stat1Num, setStat1Num] = useState('')
  const [stat1Label, setStat1Label] = useState('')
  const [stat2Num, setStat2Num] = useState('')
  const [stat2Label, setStat2Label] = useState('')
  const [stat3Num, setStat3Num] = useState('')
  const [stat3Label, setStat3Label] = useState('')
  const [casualImg, setCasualImg] = useState('')
  const [formalImg, setFormalImg] = useState('')
  const [partyImg, setPartyImg] = useState('')
  const [gymImg, setGymImg] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)

  const API_URL = 'http://localhost:5000/api'

  useEffect(() => {
    loadProducts()
    loadOrders()
    loadHeroSettings()
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
      const res = await fetch(`${API_URL}/admin/orders`, {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const loadHeroSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/config/hero`)
      if (res.ok) {
        const data = await res.json()
        setHeroTitle(data.title || '')
        setHeroDesc(data.description || '')
        setHeroImgUrl(data.imageUrl || '')
        if (data.stats && data.stats[0]) {
          setStat1Num(data.stats[0].num || '')
          setStat1Label(data.stats[0].label || '')
        }
        if (data.stats && data.stats[1]) {
          setStat2Num(data.stats[1].num || '')
          setStat2Label(data.stats[1].label || '')
        }
        if (data.stats && data.stats[2]) {
          setStat3Num(data.stats[2].num || '')
          setStat3Label(data.stats[2].label || '')
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    }

    try {
      const res2 = await fetch(`${API_URL}/config/dress-style`)
      if (res2.ok) {
        const data2 = await res2.json()
        setCasualImg(data2.casual || '')
        setFormalImg(data2.formal || '')
        setPartyImg(data2.party || '')
        setGymImg(data2.gym || '')
      }
    } catch (err) {
      console.error('Failed to load dress style settings:', err)
    }
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setProdName('')
    setProdPrice('')
    setProdOriginalPrice('')
    setProdDiscount('')
    setProdImage('')
    setProdBackViewImage('')
    setProdModelViewImage('')
    setProdCategory('casual')
    setProdBrand('')
    setProdIsOnSale(false)
    setProdIsNewArrival(false)
    setProdDesc('')
    setProdColors('')
    setProdSizes('')
    setErrorMsg('')
    setSuccessMsg('')
    setShowProductModal(true)
  }

  const openEditModal = (p) => {
    setEditingProduct(p)
    setProdName(p.name)
    setProdPrice(p.price)
    setProdOriginalPrice(p.originalPrice || '')
    setProdDiscount(p.discount || '')
    setProdImage(p.image)
    setProdBackViewImage(p.backViewImage || '')
    setProdModelViewImage(p.modelViewImage || '')
    setProdCategory(p.category)
    setProdBrand(p.brand || '')
    setProdIsOnSale(p.isOnSale || false)
    setProdIsNewArrival(p.isNewArrival || false)
    setProdDesc(p.description)
    setProdColors(p.colors ? p.colors.join(',') : '')
    setProdSizes(p.sizes ? p.sizes.join(',') : '')
    setErrorMsg('')
    setSuccessMsg('')
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
      discount: prodDiscount ? Number(prodDiscount) : undefined,
      image: prodImage,
      backViewImage: prodBackViewImage,
      modelViewImage: prodModelViewImage,
      category: prodCategory,
      brand: prodBrand,
      isOnSale: prodIsOnSale,
      isNewArrival: prodIsNewArrival,
      description: prodDesc,
      colors: prodColors ? prodColors.split(',').map(s => s.trim()) : [],
      sizes: prodSizes ? prodSizes.split(',').map(s => s.trim()) : [],
    }

    try {
      const url = editingProduct 
        ? `${API_URL}/admin/products/${editingProduct._id}`
        : `${API_URL}/admin/products`
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg(editingProduct ? 'Product updated successfully' : 'Product created successfully')
        setShowProductModal(false)
        loadProducts()
      } else {
        setErrorMsg(data.message || 'Product save failed')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to connect to server.')
    }
  }

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await fetch(`${API_URL}/admin/products/${prodId}`, {
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
    setErrorMsg('')
    setSuccessMsg('')
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
      } else {
        const data = await res.json()
        setErrorMsg(data.message || 'Failed to update delivery status')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to connect to server.')
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel/delete this order?')) return
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await fetch(`${API_URL}/admin/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        setSuccessMsg('Order cancelled successfully!')
        loadOrders()
      } else {
        const data = await res.json()
        setErrorMsg(data.message || 'Delete failed')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to connect to server.')
    }
  }

  const handleSettingsSubmit = async (e) => {
    e.preventDefault()
    setSavingSettings(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await fetch(`${API_URL}/config/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: heroTitle,
          description: heroDesc,
          imageUrl: heroImgUrl,
          stats: [
            { num: stat1Num, label: stat1Label },
            { num: stat2Num, label: stat2Label },
            { num: stat3Num, label: stat3Label }
          ]
        })
      })
      
      const res2 = await fetch(`${API_URL}/config/dress-style`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          casual: casualImg,
          formal: formalImg,
          party: partyImg,
          gym: gymImg
        })
      })

      if (res.ok && res2.ok) {
        setSuccessMsg('Settings saved successfully!')
      } else {
        const data = await res.json()
        setErrorMsg(data.message || 'Failed to save settings')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to connect to server.')
    } finally {
      setSavingSettings(false)
    }
  }

  // Get unique brands for the filter dropdown
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(b => b && b.trim() !== '')))

  // Compute filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    const matchesBrand = filterBrand === 'all' || p.brand === filterBrand
    return matchesSearch && matchesCategory && matchesBrand
  })

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
          onClick={() => { setActiveTab('products'); setErrorMsg(''); setSuccessMsg('') }}
        >
          Manage Products
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => { setActiveTab('orders'); setErrorMsg(''); setSuccessMsg('') }}
        >
          Fulfill Orders ({orders.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('settings'); setErrorMsg(''); setSuccessMsg(''); loadHeroSettings() }}
        >
          Landing Page Settings
        </button>
      </div>

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div className="admin-tab-content">
          <div className="tab-actions-header">
            <h2>Catalog Products ({filteredProducts.length})</h2>
            <button onClick={openAddModal} className="admin-add-prod-btn">+ Add New Product</button>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="admin-search-icon">
                <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
            </div>
            
            <div className="admin-filters">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="admin-filter-select"
              >
                <option value="all">All Categories</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="party">Party</option>
                <option value="gym">Gym</option>
              </select>
              
              <select 
                value={filterBrand} 
                onChange={(e) => setFilterBrand(e.target.value)}
                className="admin-filter-select"
              >
                <option value="all">All Brands</option>
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingProds ? (
            <p>Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
              <button onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterBrand('all'); }} className="admin-clear-filters-btn">Clear Filters</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.image} alt={p.name} className="admin-prod-thumb" />
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{p.name}</div>
                        {(p.isOnSale || p.isNewArrival) && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {p.isOnSale && <span className="admin-badge badge-sale">Sale</span>}
                            {p.isNewArrival && <span className="admin-badge badge-new">New</span>}
                          </div>
                        )}
                      </td>
                      <td>BDT {p.price} {p.originalPrice && <span className="admin-original-price">BDT {p.originalPrice}</span>}</td>
                      <td>
                        <div style={{ textTransform: 'capitalize' }}>{p.category}</div>
                        {p.brand && <div style={{ fontSize: '11px', color: 'var(--gray-600)' }}>{p.brand}</div>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(p)} className="action-btn-edit">Edit</button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="action-btn-delete">Delete</button>
                        </div>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>{o._id}</td>
                      <td>
                        <div><strong>{o.user?.name || 'Guest'}</strong></div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '4px' }}>
                          📧 {o.shippingAddress?.email || o.user?.email}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-600)' }}>
                          📞 {o.shippingAddress?.phone || 'N/A (Old Order)'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: '4px' }}>
                          📍 {o.shippingAddress?.address}, {o.shippingAddress?.city}, {o.shippingAddress?.postalCode}, {o.shippingAddress?.country}
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>BDT {o.totalAmount}</td>
                      <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>{o.paymentMethod}</td>
                      <td>
                        <span className={`status-badge status-pay-${o.paymentStatus}`}>
                          {o.paymentStatus}
                        </span>
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
                      <td>
                        <button 
                          onClick={() => handleDeleteOrder(o._id)} 
                          className="action-btn-delete"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === 'settings' && (
        <div className="admin-tab-content">
          <div className="tab-actions-header">
            <h2>Landing Page Settings (Hero Section)</h2>
          </div>
          
          <form onSubmit={handleSettingsSubmit} className="admin-settings-form">
            <div className="form-group">
              <label>Hero Title (Use \n or hit Enter for line breaks)</label>
              <textarea 
                required
                rows="3"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                placeholder="e.g. FIND CLOTHES THAT MATCHES YOUR STYLE"
                className="admin-settings-textarea"
              />
            </div>
            
            <div className="form-group">
              <label>Hero Description</label>
              <textarea 
                required
                rows="4"
                value={heroDesc}
                onChange={e => setHeroDesc(e.target.value)}
                placeholder="e.g. Browse through our diverse range..."
                className="admin-settings-textarea"
              />
            </div>

            <div className="form-group">
              <label>Hero Image Path or Web URL</label>
              <input 
                type="text"
                required
                value={heroImgUrl}
                onChange={e => setHeroImgUrl(e.target.value)}
                placeholder="e.g. /src/assets/hero-image.png or a web URL"
                className="admin-settings-input"
              />
            </div>
            
            <h3 className="settings-sub-title" style={{ marginTop: '24px', marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Hero Stats Counters</h3>
            
            <div className="stats-settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div className="stat-setting-item" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', padding: '16px', backgroundColor: 'var(--off-white)', borderRadius: 'var(--radius-lg)' }}>
                <div className="form-group">
                  <label>Stat 1 Number</label>
                  <input type="text" required value={stat1Num} onChange={e => setStat1Num(e.target.value)} placeholder="200+" className="admin-settings-input" />
                </div>
                <div className="form-group">
                  <label>Stat 1 Label</label>
                  <input type="text" required value={stat1Label} onChange={e => setStat1Label(e.target.value)} placeholder="Brands" className="admin-settings-input" />
                </div>
              </div>
              
              <div className="stat-setting-item" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', padding: '16px', backgroundColor: 'var(--off-white)', borderRadius: 'var(--radius-lg)' }}>
                <div className="form-group">
                  <label>Stat 2 Number</label>
                  <input type="text" required value={stat2Num} onChange={e => setStat2Num(e.target.value)} placeholder="2,000+" className="admin-settings-input" />
                </div>
                <div className="form-group">
                  <label>Stat 2 Label</label>
                  <input type="text" required value={stat2Label} onChange={e => setStat2Label(e.target.value)} placeholder="Products" className="admin-settings-input" />
                </div>
              </div>
              
              <div className="stat-setting-item" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', padding: '16px', backgroundColor: 'var(--off-white)', borderRadius: 'var(--radius-lg)' }}>
                <div className="form-group">
                  <label>Stat 3 Number</label>
                  <input type="text" required value={stat3Num} onChange={e => setStat3Num(e.target.value)} placeholder="30,000+" className="admin-settings-input" />
                </div>
                <div className="form-group">
                  <label>Stat 3 Label</label>
                  <input type="text" required value={stat3Label} onChange={e => setStat3Label(e.target.value)} placeholder="Customers" className="admin-settings-input" />
                </div>
              </div>
            </div>
            
            <hr style={{ margin: '32px 0', borderColor: 'var(--gray-300)' }} />
            
            <h3 className="settings-sub-title" style={{ marginBottom: '12px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Browse By Dress Style Images</h3>
            
            <div className="form-group">
              <label>Casual Image URL</label>
              <input type="text" required value={casualImg} onChange={e => setCasualImg(e.target.value)} placeholder="https://..." className="admin-settings-input" />
            </div>
            <div className="form-group">
              <label>Formal Image URL</label>
              <input type="text" required value={formalImg} onChange={e => setFormalImg(e.target.value)} placeholder="https://..." className="admin-settings-input" />
            </div>
            <div className="form-group">
              <label>Party Image URL</label>
              <input type="text" required value={partyImg} onChange={e => setPartyImg(e.target.value)} placeholder="https://..." className="admin-settings-input" />
            </div>
            <div className="form-group">
              <label>Gym Image URL</label>
              <input type="text" required value={gymImg} onChange={e => setGymImg(e.target.value)} placeholder="https://..." className="admin-settings-input" />
            </div>

            <button className="admin-save-btn" type="submit" disabled={savingSettings} style={{ marginTop: '24px' }}>
              {savingSettings ? 'Saving...' : 'Save settings'}
            </button>
          </form>
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
                <label>Normal View Image URL</label>
                <input type="text" required value={prodImage} onChange={e => setProdImage(e.target.value)} placeholder="https://placehold.co/400x480..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Back View Image URL (Optional)</label>
                  <input type="text" value={prodBackViewImage} onChange={e => setProdBackViewImage(e.target.value)} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Model View Image URL (Optional)</label>
                  <input type="text" value={prodModelViewImage} onChange={e => setProdModelViewImage(e.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea required value={prodDesc} onChange={e => setProdDesc(e.target.value)} rows="3" placeholder="Provide product descriptions..."></textarea>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="isOnSale" checked={prodIsOnSale} onChange={e => setProdIsOnSale(e.target.checked)} />
                  <label htmlFor="isOnSale" style={{ marginBottom: 0 }}>Mark as On Sale</label>
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="isNewArrival" checked={prodIsNewArrival} onChange={e => setProdIsNewArrival(e.target.checked)} />
                  <label htmlFor="isNewArrival" style={{ marginBottom: 0 }}>Mark as New Arrival</label>
                </div>
              </div>

              <div className="form-group">
                <label>Brand (Optional)</label>
                <input type="text" value={prodBrand} onChange={e => setProdBrand(e.target.value)} placeholder="e.g. ZARA" />
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
