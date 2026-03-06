import React from 'react'
import './DressStyle.css'

const styles = [
  {
    id: 1,
    name: 'Casual',
    image: 'https://placehold.co/600x350/d4d4d4/333333?text=Casual',
  },
  {
    id: 2,
    name: 'Formal',
    image: 'https://placehold.co/600x350/2c2c2c/ffffff?text=Formal',
  },
  {
    id: 3,
    name: 'Party',
    image: 'https://placehold.co/600x350/b8b0a4/333333?text=Party',
  },
  {
    id: 4,
    name: 'Gym',
    image: 'https://placehold.co/600x350/1a3c5e/ffffff?text=Gym',
  },
]

const DressStyle = ({ onCategoryClick }) => {
  return (
    <section className="dress-style-section">
      <div className="container">
        <div className="dress-style-wrap">
          <h2 className="section-title dress-style-title">BROWSE BY DRESS STYLE</h2>
          <div className="dress-style-grid">
            {/* Row 1: Casual (small) + Formal (large) */}
            <div
              className="style-card style-card--sm"
              onClick={() => onCategoryClick && onCategoryClick('casual')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('casual')}
            >
              <span className="style-label">{styles[0].name}</span>
              <img src={styles[0].image} alt={styles[0].name} className="style-img" />
            </div>
            <div
              className="style-card style-card--lg"
              onClick={() => onCategoryClick && onCategoryClick('formal')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('formal')}
            >
              <span className="style-label">{styles[1].name}</span>
              <img src={styles[1].image} alt={styles[1].name} className="style-img" />
            </div>
            {/* Row 2: Party (large) + Gym (small) */}
            <div
              className="style-card style-card--lg"
              onClick={() => onCategoryClick && onCategoryClick('party')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('party')}
            >
              <span className="style-label">{styles[2].name}</span>
              <img src={styles[2].image} alt={styles[2].name} className="style-img" />
            </div>
            <div
              className="style-card style-card--sm"
              onClick={() => onCategoryClick && onCategoryClick('gym')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('gym')}
            >
              <span className="style-label">{styles[3].name}</span>
              <img src={styles[3].image} alt={styles[3].name} className="style-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DressStyle