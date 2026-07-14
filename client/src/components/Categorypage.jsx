import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import FilterSidebar from './FilterSidebar'
import { fetchProducts } from '../services/productService'
import './CategoryPage.css'

const PRODUCTS_PER_PAGE = 9
const sortOptions = ['Most Popular', 'Newest', 'Price: Low to High', 'Price: High to Low']

const CategoryPage = ({ category, onNavigateHome, onProductClick, onCategoryClick }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Most Popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  
  // Set up filters
  const [filters, setFilters] = useState({
    priceMin: 50,
    priceMax: 500,
    colors: [],
    size: '',
    dressStyle: category,
  })

  // Map client-side Sort options to backend sort keys
  const getBackendSortKey = (sortValue) => {
    switch (sortValue) {
      case 'Most Popular': return 'rating';
      case 'Newest': return 'newest';
      case 'Price: Low to High': return 'price-asc';
      case 'Price: High to Low': return 'price-desc';
      default: return 'rating';
    }
  }

  // Load products whenever category, filters, or sortBy changes
  useEffect(() => {
    setLoading(true)
    
    // Convert client colors array to backend parameters
    // In our client, color options have ID names: 'green', 'red', 'yellow' etc. 
    // We map them if needed or send color IDs. Let's send color IDs, backend supports check in array
    const queryFilters = {
      minPrice: filters.priceMin,
      maxPrice: filters.priceMax,
      sort: getBackendSortKey(sortBy)
    }

    if (category === 'on-sale') {
      queryFilters.isOnSale = true;
    } else if (category === 'new-arrivals') {
      queryFilters.isNewArrival = true;
    } else if (category === 'top-selling') {
      // Just let it fetch all products sorted by rating (which is the default sortBy)
    } else if (category && category.startsWith('brand-')) {
      queryFilters.brand = category.replace('brand-', '');
    } else {
      queryFilters.category = category;
    }

    if (filters.colors && filters.colors.length > 0) {
      // Map color name IDs to hex hashes to match the DB seed if needed, 
      // or send color names. Let's map color names to their respective hex values:
      const colorMap = {
        green: '#00C12B',
        red: '#F44336',
        yellow: '#F3D060',
        orange: '#FF7E22',
        teal: '#31BABD',
        blue: '#4F4FF1',
        purple: '#BE52F2',
        pink: '#EB52F2',
        white: '#FFFFFF',
        black: '#3E3E3E'
      }
      const hexColors = filters.colors.map(col => colorMap[col] || col)
      queryFilters.colors = hexColors.join(',')
    }

    if (filters.size) {
      queryFilters.sizes = filters.size
    }

    fetchProducts(queryFilters).then(data => {
      setProducts(data)
      setCurrentPage(1) // Reset page to 1 on filter/sort change
      setLoading(false)
    })
  }, [category, filters, sortBy])

  let categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  if (category === 'on-sale') categoryLabel = 'On Sale';
  if (category === 'new-arrivals') categoryLabel = 'New Arrivals';
  if (category === 'top-selling') categoryLabel = 'Top Selling';
  if (category && category.startsWith('brand-')) categoryLabel = `Brand: ${category.replace('brand-', '')}`;
  
  // Client-side pagination based on dynamic database length
  const totalProducts = products.length
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

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
            <FilterSidebar filters={filters} setFilters={setFilters} category={category} onCategoryClick={onCategoryClick} />
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
                  {totalProducts > 0 
                    ? `Showing ${startIndex + 1}-${Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)} of ${totalProducts} Products` 
                    : 'No Products Found'}
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

            {loading ? (
              <div className="category-loading" style={{ padding: '40px 0', textWeight: 'bold', textAlign: 'center' }}>
                Loading products...
              </div>
            ) : (
              <div className="category-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onProductClick && onProductClick(product.id)}
                  />
                ))}
              </div>
            )}

            {totalProducts > PRODUCTS_PER_PAGE && (
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
            )}
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
            <FilterSidebar filters={filters} setFilters={setFilters} category={category} isMobile onApply={() => setFilterOpen(false)} onCategoryClick={(cat) => { setFilterOpen(false); if(onCategoryClick) onCategoryClick(cat); }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryPage