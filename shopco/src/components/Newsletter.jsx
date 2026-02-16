import React, { useState } from 'react'
import './Newsletter.css'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert(`Thank you! ${email} has been subscribed.`)
      setEmail('')
    }
  }

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h2 className="newsletter-title">
              STAY UPTO DATE ABOUT<br />
              OUR LATEST OFFERS
            </h2>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="newsletter-input-wrap">
              <svg className="newsletter-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15.75 3.375H2.25C1.83579 3.375 1.5 3.71079 1.5 4.125V13.875C1.5 14.2892 1.83579 14.625 2.25 14.625H15.75C16.1642 14.625 16.5 14.2892 16.5 13.875V4.125C16.5 3.71079 16.1642 3.375 15.75 3.375Z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                <path d="M1.5 4.5L9 9.75L16.5 4.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              </svg>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="newsletter-btn">
              Subscribe to Newsletter
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
