import React, { useState, useRef, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import SearchModal from './Searchmodal'
import './Navbar.css'

const Navbar = ({ onLogoClick, onCartClick, onCategoryClick, onSaleClick, onNewArrivalsClick, onProductClick }) => {
  const [menuOpen, setMenuOpen]       = useState(false)
  const [shopDropOpen, setShopDropOpen] = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const { itemCount } = useCart()
  const dropRef = useRef(null)

  // Close shop dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShopDropOpen(false)
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

            {/* Account */}
            <button className="nav-icon-btn" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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
    </>
  )
}

export default Navbar