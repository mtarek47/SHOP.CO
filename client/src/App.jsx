import React, { useState, useEffect } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Brands from './components/Brands'
import NewArrivals from './components/NewArrivals'
import TopSelling from './components/TopSelling'
import DressStyle from './components/DressStyle'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CategoryPage from './components/CategoryPage'
import ProductDetailPage from './components/ProductDetailPage'
import CartPage from './components/CartPage'
import PaymentSuccessPage from './components/PaymentSuccessPage'
import AdminPage from './components/AdminPage'

// Route: { page: 'home' | 'category' | 'product' | 'cart' | 'payment-success' | 'admin', category?, productId? }

function App() {
  const [route, setRoute] = useState(() => {
    // Check if redirecting from payment gateway success page
    if (window.location.pathname === '/payment-success' || window.location.search.includes('gateway=')) {
      return { page: 'payment-success' }
    }
    // Initialize from history state if available
    if (window.history.state && window.history.state.route) {
      return window.history.state.route
    }
    return { page: 'home' }
  })

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.route) {
        setRoute(e.state.route)
      } else {
        setRoute({ page: 'home' })
      }
    }
    
    // Ensure initial state is pushed so back button works correctly
    if (!window.history.state) {
      window.history.replaceState({ route }, '')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Custom navigate function that pushes to history
  const navigateTo = (newRoute) => {
    window.history.pushState({ route: newRoute }, '')
    setRoute(newRoute)
    scroll()
  }

  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const navigateHome     = ()         => navigateTo({ page: 'home' })
  const navigateCategory = (cat)      => navigateTo({ page: 'category', category: cat })
  const navigateProduct  = (id, cat)  => navigateTo({ page: 'product', productId: id, category: cat })
  const navigateCart     = ()         => navigateTo({ page: 'cart' })
  const navigateAdmin    = ()         => navigateTo({ page: 'admin' })

  const sharedProps = {
    onLogoClick:        navigateHome,
    onCartClick:        navigateCart,
    onCategoryClick:    navigateCategory,
    onSaleClick:        () => navigateCategory('on-sale'),
    onNewArrivalsClick: () => navigateCategory('new-arrivals'),
    onProductClick:     navigateProduct,
    onAdminClick:       navigateAdmin,
  }

  // ── Payment Success Page ──
  if (route.page === 'payment-success') {
    return (
      <>
        <AnnouncementBar />
        <Navbar {...sharedProps} />
        <PaymentSuccessPage onNavigateHome={navigateHome} />
        <Newsletter />
        <Footer />
      </>
    )
  }

  // ── Admin Page ──
  if (route.page === 'admin') {
    return (
      <AdminPage onNavigateHome={navigateHome} />
    )
  }

  // ── Cart Page ──
  if (route.page === 'cart') {
    return (
      <>
        <AnnouncementBar />
        <Navbar {...sharedProps} />
        <CartPage onNavigateHome={navigateHome} />
        <Newsletter />
        <Footer />
      </>
    )
  }

  // ── Product Detail Page ──
  if (route.page === 'product') {
    return (
      <>
        <AnnouncementBar />
        <Navbar {...sharedProps} />
        <ProductDetailPage
          productId={route.productId}
          onNavigateHome={navigateHome}
          onCategoryClick={navigateCategory}
          onProductClick={(id) => navigateProduct(id, route.category)}
        />
        <Newsletter />
        <Footer />
      </>
    )
  }

  // ── Category Page ──
  if (route.page === 'category') {
    return (
      <>
        <AnnouncementBar />
        <Navbar {...sharedProps} />
        <CategoryPage
          category={route.category}
          onNavigateHome={navigateHome}
          onCategoryClick={navigateCategory}
          onProductClick={(id) => navigateProduct(id, route.category)}
        />
        <Newsletter />
        <Footer />
      </>
    )
  }

  // ── Homepage ──
  return (
    <>
      <AnnouncementBar />
      <Navbar {...sharedProps} />
      <main>
        <Hero />
        <Brands onBrandClick={(brandName) => navigateCategory('brand-' + brandName)} />
        <NewArrivals onProductClick={(id) => navigateProduct(id, 'casual')} onViewAll={() => navigateCategory('new-arrivals')} />
        <TopSelling onProductClick={(id) => navigateProduct(id, 'casual')} onViewAll={() => navigateCategory('top-selling')} />
        <DressStyle onCategoryClick={navigateCategory} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

export default App