import React from 'react'
import './ProductCard.css'

const StarRating = ({ rating }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.floor(rating) ? 'star-full' : star - 0.5 <= rating ? 'star-half' : 'star-empty'}`}
        >
          ★
        </span>
      ))}
      <span className="rating-text">{rating}/5</span>
    </div>
  )
}

const ProductCard = ({ product, onClick }) => {
  const { name, price, originalPrice, rating, discount, image, bgColor } = product

  return (
    <div
      className="product-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="product-img-wrap" style={{ backgroundColor: bgColor || 'var(--off-white)' }}>
        <img src={image} alt={name} className="product-img" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <StarRating rating={rating} />
        <div className="product-price-row">
          <span className="product-price">${price}</span>
          {originalPrice && (
            <>
              <span className="product-original-price">${originalPrice}</span>
              <span className="badge-sale">-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard