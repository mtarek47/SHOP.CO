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
    // Initialize from localStorage
    const saved = localStorage.getItem('currentRoute')
    return saved ? JSON.parse(saved) : { page: 'home' }
  })

  // Save route to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentRoute', JSON.stringify(route))
  }, [route])

  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const navigateHome     = ()         => { setRoute({ page: 'home' }); scroll() }
  const navigateCategory = (cat)      => { setRoute({ page: 'category', category: cat }); scroll() }
  const navigateProduct  = (id, cat)  => { setRoute({ page: 'product', productId: id, category: cat }); scroll() }
  const navigateCart     = ()         => { setRoute({ page: 'cart' }); scroll() }
  const navigateAdmin    = ()         => { setRoute({ page: 'admin' }); scroll() }

  const sharedProps = {
    onLogoClick:        navigateHome,
    onCartClick:        navigateCart,
    onCategoryClick:    navigateCategory,
    onSaleClick:        () => navigateCategory('casual'),
    onNewArrivalsClick: () => navigateCategory('casual'),
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
        <Brands />
        <NewArrivals onProductClick={(id) => navigateProduct(id, 'casual')} />
        <TopSelling onProductClick={(id) => navigateProduct(id, 'casual')} />
        <DressStyle onCategoryClick={navigateCategory} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

export default App