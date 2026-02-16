import React, { useState } from 'react'
import './Navbar.css'

const Navbar = ({ onLogoClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
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
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); onLogoClick && onLogoClick() }}>SHOP.CO</a>

        {/* Desktop nav links */}
        <nav className="nav-links">
          <a href="#" className="nav-link">
            Shop
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#" className="nav-link">On Sale</a>
          <a href="#" className="nav-link">New Arrivals</a>
          <a href="#" className="nav-link">Brands</a>
        </nav>

        {/* Desktop Search */}
        <div className="nav-search">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search for products..."
            className="nav-search-input"
          />
        </div>

        {/* Icons */}
        <div className="nav-icons">
          {/* Mobile search icon */}
          <button className="nav-icon-btn mobile-search" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="nav-icon-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="nav-icon-btn" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="mobile-menu">
          <a href="#" className="mobile-menu-link">Shop</a>
          <a href="#" className="mobile-menu-link">On Sale</a>
          <a href="#" className="mobile-menu-link">New Arrivals</a>
          <a href="#" className="mobile-menu-link">Brands</a>
        </nav>
      )}
    </header>
  )
}

export default Navbar