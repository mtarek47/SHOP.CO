import React, { useState } from 'react'
import ProductCard from './ProductCard'
import FilterSidebar from './FilterSidebar'
import { allProducts } from '../data/productsData'
import './CategoryPage.css'

const PRODUCTS_PER_PAGE = 9
const TOTAL_PRODUCTS = 100
const sortOptions = ['Most Popular', 'Newest', 'Price: Low to High', 'Price: High to Low']

const CategoryPage = ({ category, onNavigateHome, onProductClick }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Most Popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceMin: 50, priceMax: 200, colors: ['blue'], size: 'Large', dressStyle: category,
  })

  const products = allProducts[category] || allProducts.casual
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
  const totalPages = Math.ceil(TOTAL_PRODUCTS / PRODUCTS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="category-page">
      <div className="container">
        <nav className="breadcrumb">
          <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); onNavigateHome() }}>Home</a>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{categoryLabel}</span>
        </nav>

        <div className="category-layout">
          <aside className="category-sidebar">
            <FilterSidebar filters={filters} setFilters={setFilters} category={category} />
          </aside>

          <div className="category-main">
            <div className="category-header">
              <div className="category-header-left">
                <h1 className="category-title">{categoryLabel}</h1>
                <button className="mobile-filter-btn" onClick={() => setFilterOpen(true)} aria-label="Open filters">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 6h12M7 10h6M9 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="category-header-right">
                <span className="category-count">
                  Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-{Math.min(currentPage * PRODUCTS_PER_PAGE, TOTAL_PRODUCTS)} of {TOTAL_PRODUCTS} Products
                </span>
                <div className="sort-wrap">
                  <span className="sort-label">Sort by: </span>
                  <button className="sort-btn" onClick={() => setSortOpen(!sortOpen)}>
                    <span className="sort-value">{sortBy}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {sortOpen && (
                    <div className="sort-dropdown">
                      {sortOptions.map((opt) => (
                        <button key={opt} className={`sort-option ${sortBy === opt ? 'sort-option--active' : ''}`}
                          onClick={() => { setSortBy(opt); setSortOpen(false) }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="category-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onProductClick && onProductClick(product.id)}
                />
              ))}
            </div>

            <div className="pagination">
              <button className="pagination-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                ← Previous
              </button>
              <div className="pagination-pages">
                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`e-${idx}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button key={page} className={`pagination-page ${currentPage === page ? 'pagination-page--active' : ''}`}
                      onClick={() => handlePageChange(page)}>{page}</button>
                  )
                )}
              </div>
              <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="filter-drawer-overlay" onClick={() => setFilterOpen(false)}>
          <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <h3>Filters</h3>
              <button className="filter-drawer-close" onClick={() => setFilterOpen(false)}>✕</button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} category={category} isMobile onApply={() => setFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryPage