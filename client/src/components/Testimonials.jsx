import React, { useState } from 'react'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    verified: true,
    text: "I'm blown away by the quality and style of the clothes I received from Shopco. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: 'Alex K.',
    rating: 5,
    verified: true,
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shopco. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: 3,
    name: 'James L.',
    rating: 5,
    verified: true,
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shopco. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: 4,
    name: 'Moo d.',
    rating: 5,
    verified: true,
    text: "I was skeptical at first but Shopco completely changed my mind. The unique clothes they offer are truly exceptional and my friends always compliment my new outfits.",
  },
]

const StarRating = ({ count }) => (
  <div className="testimonial-stars">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`tstar ${i < count ? 'tstar-full' : 'tstar-empty'}`}>★</span>
    ))}
  </div>
)

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">OUR HAPPY CUSTOMERS</h2>
          <div className="testimonials-nav">
            <button className="nav-arrow" onClick={handlePrev} aria-label="Previous">
              ←
            </button>
            <button className="nav-arrow" onClick={handleNext} aria-label="Next">
              →
            </button>
          </div>
        </div>

        <div className="testimonials-track-wrap">
          <div
            className="testimonials-track"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <StarRating count={t.rating} />
                <div className="testimonial-name-row">
                  <span className="testimonial-name">{t.name}</span>
                  {t.verified && (
                    <span className="testimonial-verified" title="Verified">
                      ✓
                    </span>
                  )}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile single view */}
        <div className="testimonials-mobile">
          <div className="testimonial-card">
            <StarRating count={testimonials[currentIndex].rating} />
            <div className="testimonial-name-row">
              <span className="testimonial-name">{testimonials[currentIndex].name}</span>
              {testimonials[currentIndex].verified && (
                <span className="testimonial-verified">✓</span>
              )}
            </div>
            <p className="testimonial-text">"{testimonials[currentIndex].text}"</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
