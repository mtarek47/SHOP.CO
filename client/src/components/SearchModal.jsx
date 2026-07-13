import React, { useState, useEffect, useRef, useCallback } from 'react'
import { fetchProducts } from '../services/productService'
import './SearchModal.css'

const RECENT_KEY = 'shopco_recent_searches'
const MAX_RECENT = 5
const MAX_RESULTS = 12

const StarRating = ({ rating }) => (
  <div className="sm-stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={s <= Math.floor(rating) ? 'sm-star-full' : 'sm-star-empty'}>★</span>
    ))}
  </div>
)

const SearchModal = ({ isOpen, onClose, onProductClick, onCategoryClick }) => {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [focused, setFocused]     = useState(-1)
  const [recent, setRecent]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || [] }
    catch { return [] }
  })

  const inputRef    = useRef(null)
  const listRef     = useRef(null)
  const overlayRef  = useRef(null)

  const categories = [
    { label: 'Casual',  slug: 'casual',  emoji: '👕' },
    { label: 'Formal',  slug: 'formal',  emoji: '👔' },
    { label: 'Party',   slug: 'party',   emoji: '🎉' },
    { label: 'Gym',     slug: 'gym',     emoji: '💪' },
  ]

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setFocused(-1)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Live search with debounce
  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults([]); setFocused(-1); return }

    const delayDebounceFn = setTimeout(() => {
      fetchProducts({ search: q }).then(data => {
        setResults(data.slice(0, MAX_RESULTS))
        setFocused(-1)
      })
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (!results.length) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocused(f => Math.min(f + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocused(f => Math.max(f - 1, -1))
      } else if (e.key === 'Enter' && focused >= 0) {
        e.preventDefault()
        handleSelectProduct(results[focused])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, results, focused])

  // Scroll focused item into view
  useEffect(() => {
    if (focused >= 0 && listRef.current) {
      const el = listRef.current.querySelectorAll('.sm-result-item')[focused]
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [focused])

  const saveRecent = useCallback((term) => {
    if (!term.trim()) return
    setRecent(prev => {
      const updated = [term, ...prev.filter(r => r !== term)].slice(0, MAX_RECENT)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  const handleSelectProduct = (product) => {
    saveRecent(query || product.name)
    onClose()
    onProductClick(product.id, product.category)
  }

  const handleRecentClick = (term) => {
    setQuery(term)
    inputRef.current?.focus()
  }

  const handleCategoryClick = (slug) => {
    onClose()
    onCategoryClick(slug)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (results.length > 0) handleSelectProduct(results[0])
  }

  const clearRecent = () => {
    setRecent([])
    try { localStorage.removeItem(RECENT_KEY) } catch {}
  }

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark className="sm-highlight">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    )
  }

  if (!isOpen) return null

  const hasQuery   = query.trim().length > 0
  const hasResults = results.length > 0
  const noResults  = hasQuery && !hasResults

  return (
    <div
      className="sm-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="sm-modal">

        {/* ── Search Input ── */}
        <form className="sm-input-row" onSubmit={handleSubmit}>
          <svg className="sm-search-icon" width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path d="M15.75 15.75L11.25 11.25M12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="sm-input"
            placeholder="Search for products, styles, brands…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              className="sm-clear"
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <button type="button" className="sm-close-btn" onClick={onClose} aria-label="Close search">
            <kbd>ESC</kbd>
          </button>
        </form>

        <div className="sm-body">

          {/* ── No query: show recent + categories ── */}
          {!hasQuery && (
            <>
              {/* Recent Searches */}
              {recent.length > 0 && (
                <div className="sm-section">
                  <div className="sm-section-header">
                    <span className="sm-section-title">Recent Searches</span>
                    <button className="sm-section-action" onClick={clearRecent}>Clear all</button>
                  </div>
                  <div className="sm-recent-list">
                    {recent.map((term, i) => (
                      <button key={i} className="sm-recent-item" onClick={() => handleRecentClick(term)}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M8 4v4l3 1.5M8 1a7 7 0 100 14A7 7 0 008 1z"
                            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse by Category */}
              <div className="sm-section">
                <div className="sm-section-header">
                  <span className="sm-section-title">Browse by Style</span>
                </div>
                <div className="sm-categories">
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      className="sm-category-pill"
                      onClick={() => handleCategoryClick(cat.slug)}
                    >
                      <span className="sm-category-emoji">{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular / trending */}
              <div className="sm-section">
                <div className="sm-section-header">
                  <span className="sm-section-title">Popular Searches</span>
                </div>
                <div className="sm-popular">
                  {['T-shirt', 'Jeans', 'Jacket', 'Shorts', 'Polo', 'Hoodie'].map(term => (
                    <button key={term} className="sm-popular-tag" onClick={() => setQuery(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Results ── */}
          {hasResults && (
            <div className="sm-section">
              <div className="sm-section-header">
                <span className="sm-section-title">{results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"</span>
              </div>
              <ul className="sm-results" ref={listRef} role="listbox">
                {results.map((product, i) => (
                  <li
                    key={product.id}
                    role="option"
                    aria-selected={focused === i}
                    className={`sm-result-item ${focused === i ? 'sm-result-item--focused' : ''}`}
                    onClick={() => handleSelectProduct(product)}
                    onMouseEnter={() => setFocused(i)}
                  >
                    {/* Product thumbnail */}
                    <div className="sm-result-thumb" style={{ backgroundColor: product.bgColor || '#f2f0f1' }}>
                      <img src={product.image} alt={product.name} />
                    </div>
                    {/* Info */}
                    <div className="sm-result-info">
                      <span className="sm-result-name">
                        {highlightMatch(product.name, query)}
                      </span>
                      <div className="sm-result-meta">
                        <StarRating rating={product.rating} />
                        <span className="sm-result-category">{product.category}</span>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="sm-result-price-wrap">
                      <span className="sm-result-price">${product.price}</span>
                      {product.discount && (
                        <span className="sm-result-badge">-{product.discount}%</span>
                      )}
                    </div>
                    {/* Arrow */}
                    <svg className="sm-result-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </li>
                ))}
              </ul>

              {/* View all results */}
              <button
                className="sm-view-all"
                onClick={() => {
                  saveRecent(query)
                  onClose()
                  onCategoryClick('casual')
                }}
              >
                View all results for "<strong>{query}</strong>"
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* ── No results ── */}
          {noResults && (
            <div className="sm-no-results">
              <div className="sm-no-results-icon">🔍</div>
              <p className="sm-no-results-title">No results for "<strong>{query}</strong>"</p>
              <p className="sm-no-results-sub">Try checking your spelling or browse by category</p>
              <div className="sm-categories" style={{ justifyContent: 'center', marginTop: 16 }}>
                {categories.map(cat => (
                  <button key={cat.slug} className="sm-category-pill" onClick={() => handleCategoryClick(cat.slug)}>
                    <span className="sm-category-emoji">{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer hints ── */}
        <div className="sm-footer">
          <span className="sm-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span className="sm-hint"><kbd>↵</kbd> Select</span>
          <span className="sm-hint"><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}

export default SearchModal