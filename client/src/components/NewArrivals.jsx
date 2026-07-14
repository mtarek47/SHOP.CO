import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/productService'
import './Section.css'

const NewArrivals = ({ onProductClick, onViewAll }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts({ isNewArrival: true }).then(data => {
      setProducts(data.slice(0, 4))
    })
  }, [])

  return (
    <section className="section" id="new-arrivals">
      <div className="container">
        <h2 className="section-title">NEW ARRIVALS</h2>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductClick && onProductClick(product.id)}
            />
          ))}
        </div>
        <div className="section-view-all">
          <button className="btn-view-all" onClick={(e) => { e.preventDefault(); onViewAll && onViewAll(); }}>View All</button>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals