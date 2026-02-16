import React from 'react'
import './Brands.css'

const brands = ['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'Calvin Klein']

const Brands = () => {
  return (
    <section className="brands">
      <div className="brands-inner">
        {brands.map((brand, i) => (
          <span
            key={i}
            className={`brand-name ${brand === 'PRADA' ? 'brand-bold' : ''} ${brand === 'ZARA' ? 'brand-italic' : ''}`}
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}

export default Brands
