import React, { useState, useEffect } from 'react'
import { fetchProducts } from '../services/productService'
import './Brands.css'

const Brands = ({ onBrandClick }) => {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetchProducts({}).then(data => {
      // Extract unique brands that have valid names
      const uniqueBrands = Array.from(new Set(data.map(p => p.brand).filter(b => b && b.trim() !== '')))
      setBrands(uniqueBrands)
    }).catch(err => console.error("Failed to fetch brands", err))
  }, [])

  if (brands.length === 0) {
    return null
  }
  return (
    <section className="brands">
      <div className="brands-inner">
        {brands.map((brand, i) => (
          <div key={i} className="brand-item-wrap" onClick={(e) => { e.preventDefault(); onBrandClick && onBrandClick(brand); }} style={{ cursor: 'pointer' }}>
            <span
              className={`brand-name ${brand === 'PRADA' ? 'brand-bold' : ''} ${brand === 'ZARA' ? 'brand-italic' : ''}`}
            >
              {brand}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Brands
