import React, { useState, useEffect } from 'react'
import './Hero.css'

const Hero = () => {
  const [heroConfig, setHeroConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/config/hero')
        if (res.ok) {
          const data = await res.json()
          setHeroConfig(data)
        }
      } catch (err) {
        console.error('Failed to load hero configuration:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroConfig()
  }, [])

  if (loading) {
    return <section className="hero"><div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>Loading...</div></section>
  }

  // Fallback defaults if load fails
  const title = heroConfig?.title || 'FIND CLOTHES THAT MATCHES YOUR STYLE'
  const description = heroConfig?.description || 'Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.'
  const imageUrl = heroConfig?.imageUrl || '/src/assets/hero-image.png'
  const stats = heroConfig?.stats || [
    { num: '200+', label: 'International Brands' },
    { num: '2,000+', label: 'High-Quality Products' },
    { num: '30,000+', label: 'Happy Customers' }
  ]

  return (
    <section className="hero">
      <div className="hero-inner container">
        <div className="hero-content">
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} />
          <p className="hero-desc">{description}</p>
          <a href="#" className="hero-btn">Shop Now</a>

          <div className="hero-stats">
            {stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="hero-stat">
                  <span className="hero-stat-num">{stat.num}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
                {idx < stats.length - 1 && <div className="hero-stat-divider" />}
              </React.Fragment>
            ))}
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

          {/* Main hero image */}
          <div className="hero-img-placeholder">
            <img
              src={imageUrl}
              alt="Fashion models"
              className="hero-img"
              onError={(e) => {
                // If custom image path fails, use local placeholder
                e.target.src = '/src/assets/hero-image.png'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
