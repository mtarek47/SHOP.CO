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

// Route: { page: 'home' | 'category' | 'product' | 'cart', category?, productId? }

function App() {
  const [route, setRoute] = useState(() => {
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

  const sharedProps = {
    onLogoClick:        navigateHome,
    onCartClick:        navigateCart,
    onCategoryClick:    navigateCategory,
    onSaleClick:        () => navigateCategory('casual'),
    onNewArrivalsClick: () => navigateCategory('casual'),
    onProductClick:     navigateProduct,
  }

  // ── Cart Page ──
  if (route.page === 'cart') {
    return (
      <>
        <AnnouncementBar />
        <Navbar {...sharedProps} />
        <CartPage onNavigateHome={navigateHome} onCheckout={() => alert('Checkout coming soon!')} />
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