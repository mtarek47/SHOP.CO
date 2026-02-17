import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── 1. Categories ──────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'casual' },
      update: {},
      create: { name: 'Casual', slug: 'casual', description: 'Everyday casual wear', sortOrder: 1 }
    }),
    prisma.category.upsert({
      where: { slug: 'formal' },
      update: {},
      create: { name: 'Formal', slug: 'formal', description: 'Professional and formal attire', sortOrder: 2 }
    }),
    prisma.category.upsert({
      where: { slug: 'party' },
      update: {},
      create: { name: 'Party', slug: 'party', description: 'Party and occasion wear', sortOrder: 3 }
    }),
    prisma.category.upsert({
      where: { slug: 'gym' },
      update: {},
      create: { name: 'Gym', slug: 'gym', description: 'Activewear and gym clothing', sortOrder: 4 }
    })
  ])
  console.log('✓ Categories seeded')

  // ── 2. Products ────────────────────────────────────────────────────────────
  const products = [
    // Casual
    { categoryId: categories[0].id, name: 'Gradient Graphic T-shirt', slug: 'gradient-graphic-tshirt', description: 'A vibrant gradient graphic t-shirt perfect for any casual occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.', price: 145.00, rating: 3.5, reviewCount: 12, stockQuantity: 80, newArrival: true, colors: [['Blue','#4F4FF1'],['Teal','#31BABD'],['Black','#3E3E3E']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Polo with Tipping Details', slug: 'polo-with-tipping-details', description: 'A classic polo shirt with elegant tipping details on the collar and cuffs. Made from premium cotton for all-day comfort.', price: 180.00, rating: 4.5, reviewCount: 34, stockQuantity: 60, featured: true, newArrival: true, colors: [['Brown','#8B4513'],['Black','#000000'],['White','#FFFFFF']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Black Striped T-shirt', slug: 'black-striped-tshirt', description: 'A bold black striped t-shirt with raglan sleeves. The perfect blend of sporty and casual style.', price: 120.00, originalPrice: 150.00, discountPercent: 30, rating: 5.0, reviewCount: 89, stockQuantity: 120, featured: true, colors: [['Black','#000000'],['Dark Gray','#3E3E3E'],['White','#FFFFFF']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Skinny Fit Jeans', slug: 'skinny-fit-jeans', description: 'Slim-cut denim jeans with a modern fit. Made from stretch denim for comfort and style throughout the day.', price: 240.00, originalPrice: 260.00, discountPercent: 20, rating: 3.5, reviewCount: 45, stockQuantity: 55, colors: [['Navy','#1a3c6e'],['Dark Gray','#3E3E3E'],['Black','#000000']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Checkered Shirt', slug: 'checkered-shirt', description: 'A timeless checkered shirt crafted from soft woven fabric. Versatile enough to dress up or down for any occasion.', price: 180.00, rating: 4.5, reviewCount: 67, stockQuantity: 75, newArrival: true, colors: [['Red','#8B0000'],['Navy','#000080'],['Green','#006400']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Sleeve Striped T-shirt', slug: 'sleeve-striped-tshirt', description: 'A fun and vibrant sleeve striped t-shirt with contrasting raglan sleeves. Lightweight and perfect for everyday wear.', price: 130.00, originalPrice: 160.00, discountPercent: 30, rating: 4.5, reviewCount: 23, stockQuantity: 90, newArrival: true, colors: [['Orange','#FF6600'],['Red','#CC0000'],['Blue','#0000CC']], sizes: ['X-Small','Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Vertical Striped Shirt', slug: 'vertical-striped-shirt', description: 'A sophisticated vertical striped shirt that elongates your silhouette. Perfect for smart-casual occasions.', price: 212.00, originalPrice: 232.00, discountPercent: 20, rating: 5.0, reviewCount: 56, stockQuantity: 40, featured: true, colors: [['Green','#2E4A2E'],['Black','#1a1a1a'],['Brown','#4a3728']], sizes: ['Small','Medium','Large','X-Large','XX-Large'] },
    { categoryId: categories[0].id, name: 'Courage Graphic T-shirt', slug: 'courage-graphic-tshirt', description: 'A bold graphic tee featuring an artistic print. Made from 100% organic cotton for maximum softness.', price: 145.00, rating: 4.0, reviewCount: 18, stockQuantity: 95, featured: true, colors: [['Orange','#CC6600'],['Dark','#333333'],['White','#FFFFFF']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[0].id, name: 'Loose Fit Bermuda Shorts', slug: 'loose-fit-bermuda-shorts', description: 'Relaxed fit bermuda shorts with an elasticated waistband. Ideal for warm days and casual outings.', price: 80.00, rating: 3.0, reviewCount: 9, stockQuantity: 110, colors: [['Blue','#4a7c8f'],['Brown','#5c4a3a'],['Green','#2E4A2E']], sizes: ['Small','Medium','Large','X-Large','XX-Large'] },
    // Formal
    { categoryId: categories[1].id, name: 'Classic Oxford Shirt', slug: 'classic-oxford-shirt', description: 'A timeless oxford shirt crafted from premium cotton. Features a button-down collar and a relaxed fit perfect for the office.', price: 195.00, rating: 4.5, reviewCount: 41, stockQuantity: 60, featured: true, colors: [['White','#FFFFFF'],['Sky Blue','#87CEEB'],['Beige','#F5DEB3']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[1].id, name: 'Slim Fit Blazer', slug: 'slim-fit-blazer', description: 'A sharp slim-fit blazer with structured shoulders and a single-button closure. Elevate any formal or smart-casual look.', price: 340.00, originalPrice: 400.00, discountPercent: 15, rating: 5.0, reviewCount: 28, stockQuantity: 30, featured: true, colors: [['Navy','#1a1a2e'],['Charcoal','#2c2c2c'],['Brown','#4a3f35']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[1].id, name: 'Tailored Trousers', slug: 'tailored-trousers', description: 'Expertly tailored trousers with a clean silhouette. A wardrobe staple for the modern professional.', price: 220.00, rating: 4.0, reviewCount: 33, stockQuantity: 45, colors: [['Black','#1a1a1a'],['Brown','#4a3f35'],['Navy','#2c3e50']], sizes: ['Small','Medium','Large','X-Large','XX-Large'] },
    { categoryId: categories[1].id, name: 'Classic White Shirt', slug: 'classic-white-shirt', description: 'A crisp white dress shirt with French seams and a spread collar. The foundation of every great formal outfit.', price: 150.00, rating: 4.5, reviewCount: 72, stockQuantity: 80, newArrival: true, colors: [['White','#FFFFFF'],['Off White','#E8E8E8'],['Light Blue','#ADD8E6']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[1].id, name: 'Formal Vest', slug: 'formal-vest', description: 'A sleek formal vest with a five-button front and welt pockets. Perfect as part of a three-piece suit.', price: 180.00, originalPrice: 210.00, discountPercent: 15, rating: 4.0, reviewCount: 17, stockQuantity: 35, colors: [['Navy','#1a1a2e'],['Brown','#4a3f35'],['Forest','#2c4a2c']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[1].id, name: 'Pinstripe Suit Jacket', slug: 'pinstripe-suit-jacket', description: 'A classic pinstripe suit jacket with notch lapels and a two-button closure. Impeccably tailored for a commanding presence.', price: 420.00, originalPrice: 500.00, discountPercent: 16, rating: 5.0, reviewCount: 44, stockQuantity: 20, featured: true, colors: [['Navy','#1a1a2e'],['Slate','#2c3e50'],['Brown','#4a3f35']], sizes: ['Small','Medium','Large','X-Large'] },
    // Party
    { categoryId: categories[2].id, name: 'Sequin Bomber Jacket', slug: 'sequin-bomber-jacket', description: 'A show-stopping sequin bomber jacket that catches the light beautifully. Perfect for parties and special occasions.', price: 265.00, rating: 4.5, reviewCount: 29, stockQuantity: 25, featured: true, newArrival: true, colors: [['Silver','#C0C0C0'],['Gold','#FFD700'],['Black','#000000']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[2].id, name: 'Velvet Blazer', slug: 'velvet-blazer', description: 'A luxurious velvet blazer that makes a bold statement. The perfect addition to any party or event wardrobe.', price: 310.00, originalPrice: 380.00, discountPercent: 18, rating: 5.0, reviewCount: 36, stockQuantity: 20, featured: true, colors: [['Purple','#4B0082'],['Burgundy','#8B0000'],['Navy','#00008B']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[2].id, name: 'Metallic Slim Trousers', slug: 'metallic-slim-trousers', description: 'Eye-catching metallic slim trousers with a sleek finish. Turn heads at any party or night out.', price: 190.00, originalPrice: 240.00, discountPercent: 21, rating: 4.0, reviewCount: 14, stockQuantity: 30, colors: [['Silver','#C0C0C0'],['Gold','#FFD700'],['Bronze','#B87333']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[2].id, name: 'Party Printed Shirt', slug: 'party-printed-shirt', description: 'A vibrant printed party shirt with an all-over pattern. Lightweight fabric for dancing the night away.', price: 155.00, rating: 4.5, reviewCount: 21, stockQuantity: 45, newArrival: true, colors: [['Pink','#FF1493'],['Orange','#FF6600'],['Purple','#9400D3']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[2].id, name: 'Satin Joggers', slug: 'satin-joggers', description: 'Luxe satin joggers that blend comfort with glamour. The elastic waistband and tapered cut make them party-ready.', price: 145.00, originalPrice: 180.00, discountPercent: 19, rating: 4.5, reviewCount: 18, stockQuantity: 40, colors: [['Black','#000000'],['Silver','#C0C0C0'],['Burgundy','#8B0000']], sizes: ['X-Small','Small','Medium','Large','X-Large'] },
    { categoryId: categories[2].id, name: 'Luxury Knit Top', slug: 'luxury-knit-top', description: 'A sophisticated knit top with a subtle sheen. Pairs perfectly with high-waisted pants for a polished party look.', price: 175.00, rating: 4.5, reviewCount: 12, stockQuantity: 35, newArrival: true, colors: [['Gold','#CCA300'],['Silver','#C0C0C0'],['Black','#000000']], sizes: ['Small','Medium','Large'] },
    // Gym
    { categoryId: categories[3].id, name: 'Performance Dry-Fit Tee', slug: 'performance-dry-fit-tee', description: 'High-performance dry-fit t-shirt with moisture-wicking technology. Engineered for intense workouts.', price: 85.00, rating: 4.5, reviewCount: 63, stockQuantity: 150, featured: true, colors: [['Black','#000000'],['Orange','#FF4500'],['Navy','#00008B']], sizes: ['Small','Medium','Large','X-Large','XX-Large'] },
    { categoryId: categories[3].id, name: 'Compression Shorts', slug: 'compression-shorts', description: 'Premium compression shorts with 4-way stretch fabric. Provides muscle support and reduces fatigue during intense exercise.', price: 70.00, originalPrice: 90.00, discountPercent: 22, rating: 4.0, reviewCount: 47, stockQuantity: 120, colors: [['Black','#000000'],['Navy','#1a1a6e'],['Forest','#006400']], sizes: ['X-Small','Small','Medium','Large','X-Large'] },
    { categoryId: categories[3].id, name: 'Muscle Tank Top', slug: 'muscle-tank-top', description: 'A lightweight muscle tank top with wide armholes for maximum mobility. Perfect for weightlifting and HIIT sessions.', price: 60.00, rating: 5.0, reviewCount: 88, stockQuantity: 140, featured: true, newArrival: true, colors: [['Black','#000000'],['White','#FFFFFF'],['Orange','#FF4500']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[3].id, name: 'Training Joggers', slug: 'training-joggers', description: 'Tapered training joggers with zippered pockets and an adjustable drawstring waist. Built for movement.', price: 110.00, rating: 4.5, reviewCount: 52, stockQuantity: 80, colors: [['Black','#000000'],['Gray','#4a4a4a'],['Forest','#1a3c1a']], sizes: ['Small','Medium','Large','X-Large','XX-Large'] },
    { categoryId: categories[3].id, name: 'Zip-Up Hoodie', slug: 'zip-up-hoodie', description: 'A full-zip performance hoodie with thumbholes and a kangaroo pocket. Great for warm-ups and cool-downs.', price: 145.00, originalPrice: 175.00, discountPercent: 17, rating: 4.0, reviewCount: 31, stockQuantity: 60, colors: [['Black','#000000'],['Gray','#808080'],['Navy','#1a1a6e']], sizes: ['Small','Medium','Large','X-Large'] },
    { categoryId: categories[3].id, name: 'Lightweight Windbreaker', slug: 'lightweight-windbreaker', description: 'An ultra-lightweight packable windbreaker with reflective details. Ideal for outdoor runs in any weather.', price: 190.00, originalPrice: 230.00, discountPercent: 17, rating: 4.5, reviewCount: 26, stockQuantity: 45, newArrival: true, colors: [['Orange','#FF4500'],['Black','#000000'],['Navy','#00008B']], sizes: ['Small','Medium','Large','X-Large','XX-Large'] }
  ]

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stockQuantity: p.stockQuantity,
        featured: p.featured || false,
        newArrival: p.newArrival || false,
        images: {
          create: [{
            imageUrl: `https://placehold.co/400x480/f2f0f1/333?text=${p.name.replace(/ /g,'+')}`,
            altText: p.name,
            sortOrder: 0,
            isPrimary: true
          }]
        },
        colors: {
          create: p.colors.map(([name, hex], i) => ({ name, hexCode: hex, sortOrder: i }))
        },
        sizes: {
          create: p.sizes.map((size, i) => ({ sizeLabel: size, sortOrder: i }))
        }
      }
    })
  }
  console.log('✓ Products seeded')

  // ── 3. Promo Codes ─────────────────────────────────────────────────────────
  await prisma.promoCode.createMany({
    data: [
      { code: 'WELCOME20', discountType: 'PERCENT', discountValue: 20, minOrderAmount: 0, maxUses: 1000 },
      { code: 'SAVE10', discountType: 'PERCENT', discountValue: 10, minOrderAmount: 100 },
      { code: 'FLAT50', discountType: 'FIXED', discountValue: 50, minOrderAmount: 200, maxUses: 500 },
      { code: 'NEWUSER', discountType: 'PERCENT', discountValue: 15, minOrderAmount: 0, maxUses: 1 }
    ],
    skipDuplicates: true
  })
  console.log('✓ Promo codes seeded')

  // ── 4. Admin User ──────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@shopco.com' },
    update: {},
    create: {
      email: 'admin@shopco.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  })
  console.log('✓ Admin user created (admin@shopco.com / Admin@123)')

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
