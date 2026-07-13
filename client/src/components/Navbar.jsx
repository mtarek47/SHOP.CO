import React, { useState, useRef, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import SearchModal from './Searchmodal'
import './Navbar.css'

const Navbar = ({ 
  onLogoClick, 
  onCartClick, 
  onCategoryClick, 
  onSaleClick, 
  onNewArrivalsClick, 
  onProductClick,
  onAdminClick 
}) => {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [shopDropOpen, setShopDropOpen] = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  
  // Auth states
  const { user, login, register, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [isLoginView, setIsLoginView] = useState(true) // true = Login, false = Register
  
  // Form values
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')
  
  const { itemCount } = useCart()
  const dropRef = useRef(null)
  const accountRef = useRef(null)

  // Close shop dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShopDropOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard shortcut: Cmd/Ctrl+K opens search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNav = (e, cb) => {
    e.preventDefault()
    setMenuOpen(false)
    setShopDropOpen(false)
    cb && cb()
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    
    if (isLoginView) {
      const res = await login(authEmail, authPassword)
      if (res.success) {
        setShowAuthModal(false)
        setAuthPassword('')
      } else {
        setAuthError(res.message || 'Login failed')
      }
    } else {
      if (!authName) {
        setAuthError('Name is required')
        return
      }
      const res = await register(authName, authEmail, authPassword)
      if (res.success) {
        setShowAuthModal(false)
        setAuthName('')
        setAuthEmail('')
        setAuthPassword('')
      } else {
        setAuthError(res.message || 'Registration failed')
      }
    }
  }

  const handleAccountClick = () => {
    if (user) {
      setShowAccountDropdown(!showAccountDropdown)
    } else {
      setAuthError('')
      setShowAuthModal(true)
    }
  }

  const categories = [
    { label: 'Casual', slug: 'casual', emoji: '👕' },
    { label: 'Formal', slug: 'formal', emoji: '👔' },
    { label: 'Party',  slug: 'party',  emoji: '🎉' },
    { label: 'Gym',    slug: 'gym',    emoji: '💪' },
  ]

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container">

          {/* Mobile: Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}
          <a href="#" className="nav-logo" onClick={(e) => handleNav(e, onLogoClick)}>
            SHOP.CO
          </a>

          {/* Desktop Nav */}
          <nav className="nav-links">
            {/* Shop dropdown */}
            <div className="nav-dropdown-wrap" ref={dropRef}>
              <button
                className={`nav-link nav-link-btn ${shopDropOpen ? 'nav-link--active' : ''}`}
                onClick={() => setShopDropOpen(!shopDropOpen)}
              >
                Shop
                <svg className={`nav-chevron ${shopDropOpen ? 'nav-chevron--open' : ''}`}
                  width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {shopDropOpen && (
                <div className="nav-dropdown">
                  <p className="nav-dropdown-label">Browse by style</p>
                  {categories.map((cat) => (
                    <a key={cat.slug} href="#" className="nav-dropdown-item"
                      onClick={(e) => handleNav(e, () => onCategoryClick && onCategoryClick(cat.slug))}>
                      <span className="nav-dropdown-item-left">
                        <span className="nav-dropdown-emoji">{cat.emoji}</span>
                        {cat.label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#" className="nav-link" onClick={(e) => handleNav(e, onSaleClick)}>On Sale</a>
            <a href="#" className="nav-link" onClick={(e) => handleNav(e, onNewArrivalsClick)}>New Arrivals</a>
            <a href="#" className="nav-link" onClick={(e) => handleNav(e, () => onCategoryClick && onCategoryClick('casual'))}>Brands</a>
          </nav>

          {/* Desktop Search — clicking opens modal */}
          <button className="nav-search" onClick={() => setSearchOpen(true)} aria-label="Search products">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z"
                stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="nav-search-placeholder">Search for products...</span>
            <kbd className="nav-search-shortcut">⌘K</kbd>
          </button>

          {/* Right Icons */}
          <div className="nav-icons">
            {/* Mobile search icon */}
            <button className="nav-icon-btn mobile-search-icon" aria-label="Search"
              onClick={() => setSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z"
                  stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Cart */}
            <button className="nav-icon-btn nav-cart-btn" aria-label={`Cart (${itemCount} items)`}
              onClick={() => onCartClick && onCartClick()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {itemCount > 0 && (
                <span className="nav-cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
              )}
            </button>

            {/* Account Profile and Dropdown */}
            <div className="account-dropdown-wrap" ref={accountRef}>
              <button 
                className={`nav-icon-btn ${user ? 'nav-account-active' : ''}`} 
                aria-label="Account"
                onClick={handleAccountClick}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showAccountDropdown && user && (
                <div className="account-dropdown">
                  <div className="account-dropdown-header">
                    <p className="account-name">{user.name}</p>
                    <p className="account-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  
                  {user.role === 'admin' && (
                    <button 
                      className="dropdown-item admin-link"
                      onClick={() => {
                        setShowAccountDropdown(false);
                        onAdminClick && onAdminClick();
                      }}
                    >
                      🛡️ Admin Dashboard
                    </button>
                  )}
                  
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      logout();
                      setShowAccountDropdown(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="mobile-menu">
            <div className="mobile-menu-section">
              <p className="mobile-menu-section-label">Shop by Style</p>
              {categories.map((cat) => (
                <a key={cat.slug} href="#" className="mobile-menu-link"
                  onClick={(e) => handleNav(e, () => onCategoryClick && onCategoryClick(cat.slug))}>
                  <span>{cat.emoji} {cat.label}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
            <div className="mobile-menu-divider" />
            <a href="#" className="mobile-menu-link" onClick={(e) => handleNav(e, onSaleClick)}>On Sale</a>
            <a href="#" className="mobile-menu-link" onClick={(e) => handleNav(e, onNewArrivalsClick)}>New Arrivals</a>
            <a href="#" className="mobile-menu-link" onClick={(e) => handleNav(e, () => onCategoryClick && onCategoryClick('casual'))}>Brands</a>
            <button className="mobile-menu-search" onClick={() => { setMenuOpen(false); setSearchOpen(true) }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z"
                  stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Search for products...
            </button>
          </nav>
        )}
      </header>

      {/* Search Modal — rendered outside header */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onProductClick={(id, category) => {
          setSearchOpen(false)
          onProductClick && onProductClick(id, category)
        }}
        onCategoryClick={(slug) => {
          setSearchOpen(false)
          onCategoryClick && onCategoryClick(slug)
        }}
      />

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h3>{isLoginView ? 'LOG IN' : 'CREATE AN ACCOUNT'}</h3>
              <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
            </div>
            
            {authError && <p className="auth-error">{authError}</p>}
            
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {!isLoginView && (
                <div className="form-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input 
                    id="auth-name"
                    type="text" 
                    required 
                    placeholder="e.g. John Doe"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input 
                  id="auth-email"
                  type="email" 
                  required 
                  placeholder="e.g. john@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <input 
                  id="auth-password"
                  type="password" 
                  required 
                  placeholder="At least 6 characters"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                />
              </div>
              
              <button className="auth-submit-btn" type="submit">
                {isLoginView ? 'Log In' : 'Sign Up'}
              </button>
              
              <p className="auth-switch-text">
                {isLoginView ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  className="auth-switch-btn"
                  onClick={() => {
                    setIsLoginView(!isLoginView);
                    setAuthError('');
                  }}
                >
                  {isLoginView ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar