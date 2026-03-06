import React from 'react'
import './Hero.css'
import heroImage from '../assets/hero-image.png' // Replace with actual image path

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-inner container">
        <div className="hero-content">
          <h1 className="hero-title">
            FIND CLOTHES<br />
            THAT MATCHES<br />
            YOUR STYLE
          </h1>
          <p className="hero-desc">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of style.
          </p>
          <a href="#" className="hero-btn">Shop Now</a>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">200+</span>
              <span className="hero-stat-label">International Brands</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">2,000+</span>
              <span className="hero-stat-label">High-Quality Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">30,000+</span>
              <span className="hero-stat-label">Happy Customers</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrap">
          {/* Decorative stars */}
          <svg className="hero-star hero-star-1" width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path d="M28 0L33.9 22.1L56 28L33.9 33.9L28 56L22.1 33.9L0 28L22.1 22.1L28 0Z" fill="black"/>
          </svg>
          <svg className="hero-star hero-star-2" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 0L19.4 12.6L32 16L19.4 19.4L16 32L12.6 19.4L0 16L12.6 12.6L16 0Z" fill="black"/>
          </svg>

          {/* Main hero image placeholder - replace with actual image */}
          <div className="hero-img-placeholder">
            <img
              src="/src/assets/hero-image.png"
              alt="Fashion models"
              className="hero-img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
