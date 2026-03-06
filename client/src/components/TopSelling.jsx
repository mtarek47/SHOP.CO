import React from 'react'
import ProductCard from './ProductCard'
import { allProducts } from '../data/productsData'
import './Section.css'

const TopSelling = ({ onProductClick }) => {
  // Use casual products 5-8 (different slice from NewArrivals)
  const products = allProducts.casual.slice(4, 8)

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