import React, { useState } from 'react'
import './AnnouncementBar.css'

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="announcement-bar">
      <p className="announcement-text">
        Sign up and get 20% off to your first order.{' '}
        <a href="#" className="announcement-link">Sign Up Now</a>
      </p>
      <button
        className="announcement-close"
        onClick={() => setVisible(false)}
        aria-label="Close announcement"
      >
        ✕
      </button>
    </div>
  )
}

export default AnnouncementBar
