import React, { useState } from 'react'
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

// Route state shape:
//   { page: 'home' }
//   { page: 'category', category: 'casual' }
//   { page: 'product',  productId: 'casual-1', category: 'casual' }

function App() {
  const [route, setRoute] = useState({ page: 'home' })

  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const navigateHome = () => { setRoute({ page: 'home' }); scroll() }

  const navigateCategory = (category) => { setRoute({ page: 'category', category }); scroll() }

  const navigateProduct = (productId, category) => {
    setRoute({ page: 'product', productId, category })
    scroll()
  }

  // ── Product Detail Page ──
  if (route.page === 'product') {
    return (
      <>
        <AnnouncementBar />
        <Navbar onLogoClick={navigateHome} />
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
        <Navbar onLogoClick={navigateHome} />
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
      <Navbar onLogoClick={navigateHome} />
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