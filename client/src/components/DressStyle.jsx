import React from 'react'
import './DressStyle.css'

const defaultStyles = [
  {
    id: 1,
    name: 'Casual',
    key: 'casual',
    image: 'https://placehold.co/600x350/d4d4d4/333333?text=Casual',
  },
  {
    id: 2,
    name: 'Formal',
    key: 'formal',
    image: 'https://placehold.co/600x350/2c2c2c/ffffff?text=Formal',
  },
  {
    id: 3,
    name: 'Party',
    key: 'party',
    image: 'https://placehold.co/600x350/b8b0a4/333333?text=Party',
  },
  {
    id: 4,
    name: 'Gym',
    key: 'gym',
    image: 'https://placehold.co/600x350/1a3c5e/ffffff?text=Gym',
  },
]

const DressStyle = ({ onCategoryClick }) => {
  const [styleImages, setStyleImages] = React.useState(defaultStyles)

  React.useEffect(() => {
    fetch('http://localhost:5000/api/config/dress-style')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStyleImages(prev => prev.map(style => ({
            ...style,
            image: data[style.key] || style.image
          })))
        }
      })
      .catch(err => console.error('Failed to load dress style config', err))
  }, [])
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
              <span className="style-label">{styleImages[0].name}</span>
              <img src={styleImages[0].image} alt={styleImages[0].name} className="style-img" />
            </div>
            <div
              className="style-card style-card--lg"
              onClick={() => onCategoryClick && onCategoryClick('formal')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('formal')}
            >
              <span className="style-label">{styleImages[1].name}</span>
              <img src={styleImages[1].image} alt={styleImages[1].name} className="style-img" />
            </div>
            {/* Row 2: Party (large) + Gym (small) */}
            <div
              className="style-card style-card--lg"
              onClick={() => onCategoryClick && onCategoryClick('party')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('party')}
            >
              <span className="style-label">{styleImages[2].name}</span>
              <img src={styleImages[2].image} alt={styleImages[2].name} className="style-img" />
            </div>
            <div
              className="style-card style-card--sm"
              onClick={() => onCategoryClick && onCategoryClick('gym')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onCategoryClick && onCategoryClick('gym')}
            >
              <span className="style-label">{styleImages[3].name}</span>
              <img src={styleImages[3].image} alt={styleImages[3].name} className="style-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DressStyle