import React, { useState } from 'react'
import './FilterSidebar.css'

const colorOptions = [
  { id: 'green',  hex: '#00C12B' },
  { id: 'red',    hex: '#F44336' },
  { id: 'yellow', hex: '#F3D060' },
  { id: 'orange', hex: '#FF7E22' },
  { id: 'teal',   hex: '#31BABD' },
  { id: 'blue',   hex: '#4F4FF1' },
  { id: 'purple', hex: '#BE52F2' },
  { id: 'pink',   hex: '#EB52F2' },
  { id: 'white',  hex: '#FFFFFF', border: true },
  { id: 'black',  hex: '#3E3E3E' },
]

const sizeOptions = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large']

const dressStyleOptions = ['Casual', 'Formal', 'Party', 'Gym']

const categoryLinks = { Casual: 'casual', Formal: 'formal', Party: 'party', Gym: 'gym' }

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span className="filter-section-title">{title}</span>
        <svg
          className={`filter-chevron ${open ? 'filter-chevron--open' : ''}`}
          width="18" height="18" viewBox="0 0 18 18" fill="none"
        >
          <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  )
}

const FilterSidebar = ({ filters, setFilters, category, isMobile = false, onApply }) => {
  const [localPriceMin, setLocalPriceMin] = useState(filters.priceMin)
  const [localPriceMax, setLocalPriceMax] = useState(filters.priceMax)

  const toggleColor = (colorId) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorId)
        ? prev.colors.filter((c) => c !== colorId)
        : [...prev.colors, colorId],
    }))
  }

  const setSize = (size) => {
    setFilters((prev) => ({ ...prev, size }))
  }

  const handleApply = () => {
    setFilters((prev) => ({ ...prev, priceMin: localPriceMin, priceMax: localPriceMax }))
    onApply && onApply()
  }

  return (
    <div className={`filter-sidebar ${isMobile ? 'filter-sidebar--mobile' : ''}`}>
      <div className="filter-sidebar-top">
        <span className="filter-sidebar-heading">Filters</span>
        <button className="filter-sidebar-reset" aria-label="Adjust filters">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="4" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="8.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            <circle cx="6" cy="4.75" r="1.75" fill="white" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="11" cy="9" r="1.75" fill="white" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="7" cy="13.25" r="1.75" fill="white" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>

      <hr className="filter-divider" />

      {/* Category quick links */}
      <FilterSection title="" defaultOpen={true}>
        <nav className="filter-categories">
          {dressStyleOptions.map((style) => (
            <div key={style} className="filter-category-item">
              <span
                className={`filter-category-link ${categoryLinks[style] === category ? 'filter-category-link--active' : ''}`}
              >
                {style}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </nav>
      </FilterSection>

      <hr className="filter-divider" />

      {/* Price range */}
      <FilterSection title="Price">
        <div className="filter-price">
          <div className="price-range-track">
            <input
              type="range"
              min={0}
              max={500}
              value={localPriceMin}
              className="price-range-input price-range-min"
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), localPriceMax - 10)
                setLocalPriceMin(val)
              }}
            />
            <input
              type="range"
              min={0}
              max={500}
              value={localPriceMax}
              className="price-range-input price-range-max"
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), localPriceMin + 10)
                setLocalPriceMax(val)
              }}
            />
            <div
              className="price-range-fill"
              style={{
                left: `${(localPriceMin / 500) * 100}%`,
                right: `${100 - (localPriceMax / 500) * 100}%`,
              }}
            />
          </div>
          <div className="price-range-labels">
            <span>${localPriceMin}</span>
            <span>${localPriceMax}</span>
          </div>
        </div>
      </FilterSection>

      <hr className="filter-divider" />

      {/* Colors */}
      <FilterSection title="Colors">
        <div className="filter-colors">
          {colorOptions.map((color) => (
            <button
              key={color.id}
              className={`color-swatch ${filters.colors.includes(color.id) ? 'color-swatch--selected' : ''}`}
              style={{
                backgroundColor: color.hex,
                border: color.border ? '1px solid var(--gray-200)' : 'none',
              }}
              onClick={() => toggleColor(color.id)}
              aria-label={color.id}
              title={color.id}
            >
              {filters.colors.includes(color.id) && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke={color.border ? '#000' : '#fff'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      <hr className="filter-divider" />

      {/* Size */}
      <FilterSection title="Size">
        <div className="filter-sizes">
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`size-chip ${filters.size === size ? 'size-chip--active' : ''}`}
              onClick={() => setSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <hr className="filter-divider" />

      {/* Dress Style */}
      <FilterSection title="Dress Style">
        <nav className="filter-categories">
          {dressStyleOptions.map((style) => (
            <div key={style} className="filter-category-item">
              <span
                className={`filter-category-link ${categoryLinks[style] === category ? 'filter-category-link--active' : ''}`}
              >
                {style}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </nav>
      </FilterSection>

      {/* Apply button */}
      <button className="filter-apply-btn" onClick={handleApply}>
        Apply Filter
      </button>
    </div>
  )
}

export default FilterSidebar
