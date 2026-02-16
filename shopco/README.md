# SHOP.CO - React Vite Frontend

## 📁 Complete File Structure

```
shopco/
├── index.html                          ← Entry HTML (Vite root)
├── package.json                        ← Dependencies & scripts
├── vite.config.js                      ← Vite configuration
└── src/
    ├── main.jsx                        ← React entry point
    ├── App.jsx                         ← Root component
    ├── index.css                       ← Global styles & CSS variables
    └── components/
        ├── AnnouncementBar.jsx         ← Top promo bar (dismissible)
        ├── AnnouncementBar.css
        ├── Navbar.jsx                  ← Sticky nav (mobile hamburger)
        ├── Navbar.css
        ├── Hero.jsx                    ← Hero section with stats
        ├── Hero.css
        ├── Brands.jsx                  ← Brand logos bar
        ├── Brands.css
        ├── ProductCard.jsx             ← Reusable product card
        ├── ProductCard.css
        ├── NewArrivals.jsx             ← New Arrivals grid section
        ├── TopSelling.jsx              ← Top Selling grid section
        ├── Section.css                 ← Shared section/grid styles
        ├── DressStyle.jsx              ← Browse by Dress Style section
        ├── DressStyle.css
        ├── Testimonials.jsx            ← Customer reviews carousel
        ├── Testimonials.css
        ├── Newsletter.jsx              ← Email signup section
        ├── Newsletter.css
        ├── Footer.jsx                  ← Full footer with links & payments
        └── Footer.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# 1. Navigate to the project folder
cd shopco

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Design Notes

- **Desktop-first** with mobile responsive breakpoints at 767px and 1023px
- Uses **CSS custom properties** (variables) for consistent theming
- **Google Fonts**: Satoshi (body) + Integral CF (headings) — closest to the original design
- **No external UI library** — pure CSS with Vite + React

## 📸 Adding Real Images

Replace the `placehold.co` image URLs in these files with your actual images:
- `src/components/Hero.jsx` — Hero model photo
- `src/components/NewArrivals.jsx` — Product photos (4 items)
- `src/components/TopSelling.jsx` — Product photos (4 items)
- `src/components/DressStyle.jsx` — Style category photos (4 categories)

Place your images in `public/images/` and reference them as `/images/your-image.jpg`.

## 🧩 Component Overview

| Component | Description |
|-----------|-------------|
| `AnnouncementBar` | Dismissible top banner with promo text |
| `Navbar` | Sticky header with search, cart, profile icons. Hamburger menu on mobile |
| `Hero` | Full hero with title, CTA button, stats, model image, decorative stars |
| `Brands` | Black bar with brand names (Versace, Zara, Gucci, Prada, Calvin Klein) |
| `ProductCard` | Reusable card with image, name, star rating, price, sale badge |
| `NewArrivals` | 4-column product grid with "View All" button |
| `TopSelling` | 4-column product grid with "View All" button |
| `DressStyle` | Asymmetric 2-row grid for Casual, Formal, Party, Gym |
| `Testimonials` | Sliding carousel of customer reviews |
| `Newsletter` | Dark CTA section with email input |
| `Footer` | Multi-column footer with social icons and payment icons |
