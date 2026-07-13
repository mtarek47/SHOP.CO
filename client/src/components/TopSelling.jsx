import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/productService'
import './Section.css'

const TopSelling = ({ onProductClick }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts({ category: 'casual' }).then(data => {
      setProducts(data.slice(4, 8))
    })
  }, [])

  return (
    <>
      <hr className="section-divider" />
      <section className="section" id="top-selling">
        <div className="container">
          <h2 className="section-title">TOP SELLING</h2>
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
    </>
  )
}

export default TopSelling