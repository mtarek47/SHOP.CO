import React from 'react'
import ProductCard from './ProductCard'
import { allProducts } from '../data/productsData'
import './Section.css'

const NewArrivals = ({ onProductClick }) => {
  const products = allProducts.casual.slice(0, 4)

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