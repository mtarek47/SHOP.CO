import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/productService'
import './Section.css'

const NewArrivals = ({ onProductClick }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts({ category: 'casual' }).then(data => {
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
          <a href="#" className="btn-view-all">View All</a>
        </div>
      </div>
    </section>
  )
}

export default NewArrivals