import React, { useState } from 'react'
import ProductCard from './ProductCard'
import { getProductById, getRelatedProducts } from '../data/productsData'
import { useCart } from '../context/CartContext'
import './ProductDetailPage.css'

const reviews = [
  { id: 1, name: 'Samantha D.', rating: 4.5, verified: true, date: 'August 14, 2023', text: 'I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt.' },
  { id: 2, name: 'Alex M.', rating: 5, verified: true, date: 'August 15, 2023', text: 'The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.' },
  { id: 3, name: 'Ethan R.', rating: 4.5, verified: true, date: 'August 16, 2023', text: 'This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt.' },
  { id: 4, name: 'Olivia P.', rating: 5, verified: true, date: 'August 17, 2023', text: 'As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out.' },
  { id: 5, name: 'Liam K.', rating: 5, verified: true, date: 'August 18, 2023', text: 'This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer\'s skill. It\'s like wearing a piece of art that reflects my passion for both design and fashion.' },
  { id: 6, name: 'Ava H.', rating: 4.5, verified: true, date: 'August 19, 2023', text: 'I\'m not just wearing a t-shirt; I\'m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.' },
]

const StarRating = ({ rating, size = 16 }) => (
  <div className="star-row">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`star-icon ${s <= Math.floor(rating) ? 'star-full' : s - 0.5 <= rating ? 'star-half' : 'star-empty'}`} style={{ fontSize: size }}>★</span>
    ))}
  </div>
)

const tabs = ['Product Details', 'Rating & Reviews', 'FAQs']

const ProductDetailPage = ({ productId, onNavigateHome, onProductClick, onCategoryClick }) => {
  const product = getProductById(productId)
  const related = getRelatedProducts(productId, 4)

  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[2] || 'Large')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('Rating & Reviews')
  const [reviewSort, setReviewSort] = useState('Latest')
  const [sortOpen, setSortOpen] = useState(false)

  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) {
    return <div className="container" style={{ padding: '64px 0' }}>Product not found.</div>
  }

  const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1)

  return (
    <div className="pdp">
      <div className="container">

        {/* ── Breadcrumb ── */}
        <nav className="breadcrumb">
          <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); onNavigateHome() }}>Home</a>
          <span className="breadcrumb-sep">›</span>
          <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); onNavigateHome() }}>Shop</a>
          <span className="breadcrumb-sep">›</span>
          <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); onCategoryClick(product.category) }}>Men</a>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{categoryLabel}</span>
        </nav>

        {/* ── Product Top Section ── */}
        <div className="pdp-top">

          {/* Gallery */}
          <div className="pdp-gallery">
            {/* Thumbnails - desktop left, mobile bottom */}
            <div className="pdp-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImg === i ? 'pdp-thumb--active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="pdp-main-img-wrap">
              <img src={product.images[activeImg]} alt={product.name} className="pdp-main-img" />
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info">
            <h1 className="pdp-title">{product.name.toUpperCase()}</h1>

            <div className="pdp-rating-row">
              <StarRating rating={product.rating} />
              <span className="pdp-rating-val">{product.rating}/5</span>
            </div>

            <div className="pdp-price-row">
              <span className="pdp-price">BDT {product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="pdp-original-price">BDT {product.originalPrice}</span>
                  <span className="badge-sale">-{product.discount}%</span>
                </>
              )}
            </div>

            <p className="pdp-desc">{product.description}</p>

            <hr className="pdp-divider" />

            {/* Color selector */}
            <div className="pdp-option-section">
              <p className="pdp-option-label">Select Colors</p>
              <div className="pdp-colors">
                {product.colors.map((hex, i) => (
                  <button
                    key={i}
                    className={`pdp-color-swatch ${selectedColor === i ? 'pdp-color-swatch--active' : ''}`}
                    style={{ backgroundColor: hex.startsWith('#') ? hex : '#CCA300' }}
                    onClick={() => setSelectedColor(i)}
                    aria-label={`Color ${i + 1}`}
                  >
                    {selectedColor === i && (
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <hr className="pdp-divider" />

            {/* Size selector */}
            <div className="pdp-option-section">
              <p className="pdp-option-label">Choose Size</p>
              <div className="pdp-sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`pdp-size-chip ${selectedSize === size ? 'pdp-size-chip--active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <hr className="pdp-divider" />

            {/* Qty + Add to Cart */}
            <div className="pdp-actions">
              <div className="pdp-qty">
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >−</button>
                <span className="pdp-qty-val">{qty}</span>
                <button
                  className="pdp-qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >+</button>
              </div>
              <button className="pdp-add-btn" onClick={() => {
                addToCart(product, selectedSize, product.colors[selectedColor], `Color ${selectedColor + 1}`)
                setAdded(true)
                setTimeout(() => setAdded(false), 2000)
              }}>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="pdp-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pdp-tab ${activeTab === tab ? 'pdp-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Reviews Section ── */}
        {activeTab === 'Rating & Reviews' && (
          <div className="pdp-reviews">
            <div className="reviews-header">
              <h3 className="reviews-title">
                All Reviews <span className="reviews-count">({reviews.length * 75})</span>
              </h3>
              <div className="reviews-controls">
                <button className="reviews-filter-btn" aria-label="Filter reviews">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 6h12M7 10h6M9 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="sort-wrap">
                  <button className="sort-btn" onClick={() => setSortOpen(!sortOpen)}>
                    <span>{reviewSort}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {sortOpen && (
                    <div className="sort-dropdown">
                      {['Latest', 'Oldest', 'Top Rated', 'Most Helpful'].map((opt) => (
                        <button key={opt} className={`sort-option ${reviewSort === opt ? 'sort-option--active' : ''}`}
                          onClick={() => { setReviewSort(opt); setSortOpen(false) }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="write-review-btn">Write a Review</button>
              </div>
            </div>

            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-card-top">
                    <StarRating rating={review.rating} size={14} />
                    <button className="review-more" aria-label="More options">···</button>
                  </div>
                  <div className="review-author-row">
                    <span className="review-author">{review.name}</span>
                    {review.verified && (
                      <span className="review-verified" title="Verified Purchase">✓</span>
                    )}
                  </div>
                  <p className="review-text">"{review.text}"</p>
                  <p className="review-date">Posted on {review.date}</p>
                </div>
              ))}
            </div>

            <div className="reviews-load-more">
              <button className="load-more-btn">Load More Reviews</button>
            </div>
          </div>
        )}

        {activeTab === 'Product Details' && (
          <div className="pdp-tab-content">
            <p>{product.description}</p>
            <ul className="pdp-details-list">
              <li><strong>Material:</strong> 100% Premium Cotton</li>
              <li><strong>Fit:</strong> Regular Fit</li>
              <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
              <li><strong>Origin:</strong> Imported</li>
            </ul>
          </div>
        )}

        {activeTab === 'FAQs' && (
          <div className="pdp-tab-content">
            <div className="faq-item">
              <strong>What is your return policy?</strong>
              <p>We offer free returns within 30 days of purchase. Items must be unworn and in original condition.</p>
            </div>
            <div className="faq-item">
              <strong>How do I find my size?</strong>
              <p>Please refer to our size guide. We recommend measuring your chest and comparing with our size chart.</p>
            </div>
            <div className="faq-item">
              <strong>How long does shipping take?</strong>
              <p>Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available at checkout.</p>
            </div>
          </div>
        )}

        {/* ── You Might Also Like ── */}
        <section className="pdp-related">
          <h2 className="pdp-related-title">YOU MIGHT ALSO LIKE</h2>
          <div className="pdp-related-grid">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onProductClick(p.id)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default ProductDetailPage