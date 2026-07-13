import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const products = [
  // CASUAL
  {
    _id: 'casual-1',
    name: 'Gradient Graphic T-shirt',
    price: 145,
    rating: 3.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Gradient+Tshirt',
    category: 'casual',
    description: 'A vibrant gradient graphic t-shirt perfect for any casual occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Gradient+Tshirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Side+View',
    ],
    colors: ['#4F4FF1', '#31BABD', '#3E3E3E'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'casual-2',
    name: 'Polo with Tipping Details',
    price: 180,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Polo+Shirt',
    category: 'casual',
    description: 'A classic polo shirt with elegant tipping details on the collar and cuffs. Made from premium cotton for all-day comfort.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Polo+Shirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#8B4513', '#000000', '#FFFFFF'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'casual-3',
    name: 'Black Striped T-shirt',
    price: 120,
    originalPrice: 150,
    discount: 30,
    rating: 5.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Striped+Tshirt',
    category: 'casual',
    description: 'A bold black striped t-shirt with raglan sleeves. The perfect blend of sporty and casual style.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Striped+Tshirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Model+View',
    ],
    colors: ['#000000', '#3E3E3E', '#FFFFFF'],
    sizes: ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'casual-4',
    name: 'Skinny Fit Jeans',
    price: 240,
    originalPrice: 260,
    discount: 20,
    rating: 3.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Skinny+Jeans',
    category: 'casual',
    description: 'Slim-cut denim jeans with a modern fit. Made from stretch denim for comfort and style throughout the day.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Skinny+Jeans',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#1a3c6e', '#3E3E3E', '#000000'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
  },
  {
    _id: 'casual-5',
    name: 'Checkered Shirt',
    price: 180,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Checkered+Shirt',
    category: 'casual',
    description: 'A timeless checkered shirt crafted from soft woven fabric. Versatile enough to dress up or down for any occasion.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Checkered+Shirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#8B0000', '#000080', '#006400'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'casual-6',
    name: 'Sleeve Striped T-shirt',
    price: 130,
    originalPrice: 160,
    discount: 30,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Sleeve+Tshirt',
    category: 'casual',
    description: 'A fun and vibrant sleeve striped t-shirt with contrasting raglan sleeves. Lightweight and perfect for everyday wear.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Sleeve+Tshirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Model+View',
    ],
    colors: ['#FF6600', '#CC0000', '#0000CC'],
    sizes: ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'casual-7',
    name: 'Vertical Striped Shirt',
    price: 212,
    originalPrice: 232,
    discount: 20,
    rating: 5.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Vert+Shirt',
    category: 'casual',
    description: 'A sophisticated vertical striped shirt that elongates your silhouette. Perfect for smart-casual occasions.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Vert+Shirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Model+View',
    ],
    colors: ['#2E4A2E', '#1a1a1a', '#4a3728'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
  },
  {
    _id: 'casual-8',
    name: 'Courage Graphic T-shirt',
    price: 145,
    rating: 4.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Graphic+Tee',
    category: 'casual',
    description: 'A bold graphic tee featuring an artistic print. Made from 100% organic cotton for maximum softness.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Graphic+Tee',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#CC6600', '#333333', '#FFFFFF'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'casual-9',
    name: 'Loose Fit Bermuda Shorts',
    price: 80,
    rating: 3.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Bermuda+Shorts',
    category: 'casual',
    description: 'Relaxed fit bermuda shorts with an elasticated waistband. Ideal for warm days and casual outings.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Bermuda+Shorts',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#4a7c8f', '#5c4a3a', '#2E4A2E'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
  },

  // FORMAL
  {
    _id: 'formal-1',
    name: 'Classic Oxford Shirt',
    price: 195,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Oxford+Shirt',
    category: 'formal',
    description: 'A timeless oxford shirt crafted from premium cotton. Features a button-down collar and a relaxed fit perfect for the office.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Oxford+Shirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#FFFFFF', '#87CEEB', '#F5DEB3'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'formal-2',
    name: 'Slim Fit Blazer',
    price: 340,
    originalPrice: 400,
    discount: 15,
    rating: 5.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Slim+Blazer',
    category: 'formal',
    description: 'A sharp slim-fit blazer with structured shoulders and a single-button closure. Elevate any formal or smart-casual look.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Slim+Blazer',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#1a1a2e', '#2c2c2c', '#4a3f35'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'formal-3',
    name: 'Tailored Trousers',
    price: 220,
    rating: 4.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Trousers',
    category: 'formal',
    description: 'Expertly tailored trousers with a clean silhouette. A wardrobe staple for the modern professional.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Trousers',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#1a1a1a', '#4a3f35', '#2c3e50'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
  },
  {
    _id: 'formal-4',
    name: 'Classic White Shirt',
    price: 150,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=White+Shirt',
    category: 'formal',
    description: 'A crisp white dress shirt with French seams and a spread collar. The foundation of every great formal outfit.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=White+Shirt',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#FFFFFF', '#E8E8E8', '#ADD8E6'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },

  // PARTY
  {
    _id: 'party-1',
    name: 'Sequin Bomber Jacket',
    price: 265,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Bomber+Jacket',
    category: 'party',
    description: 'A show-stopping sequin bomber jacket that catches the light beautifully. Perfect for parties and special occasions.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Bomber+Jacket',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#C0C0C0', '#FFD700', '#000000'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },
  {
    _id: 'party-2',
    name: 'Velvet Blazer',
    price: 310,
    originalPrice: 380,
    discount: 18,
    rating: 5.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Velvet+Blazer',
    category: 'party',
    description: 'A luxurious velvet blazer that makes a bold statement. The perfect addition to any party or event wardrobe.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Velvet+Blazer',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#4B0082', '#8B0000', '#00008B'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
  },

  // GYM
  {
    _id: 'gym-1',
    name: 'Performance Dry-Fit Tee',
    price: 85,
    rating: 4.5,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=DriFit+Tee',
    category: 'gym',
    description: 'High-performance dry-fit t-shirt with moisture-wicking technology. Engineered for intense workouts.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=DriFit+Tee',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#000000', '#FF4500', '#00008B'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'],
  },
  {
    _id: 'gym-2',
    name: 'Compression Shorts',
    price: 70,
    originalPrice: 90,
    discount: 22,
    rating: 4.0,
    bgColor: '#f2f0f1',
    image: 'https://placehold.co/400x480/f2f0f1/333?text=Comp+Shorts',
    category: 'gym',
    description: 'Premium compression shorts with 4-way stretch fabric. Provides muscle support and reduces fatigue during intense exercise.',
    images: [
      'https://placehold.co/400x480/f2f0f1/333?text=Comp+Shorts',
      'https://placehold.co/400x480/e8e8e8/333?text=Back+View',
      'https://placehold.co/400x480/ddd/333?text=Detail+View',
    ],
    colors: ['#000000', '#1a1a6e', '#006400'],
    sizes: ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    // Seed products
    await Product.insertMany(products);
    console.log('Mock products seeded successfully!');

    // Create a default admin user if not exists
    const adminEmail = 'admin@shop.co';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin Shop.co',
        email: adminEmail,
        password: 'adminpassword123', // will be hashed automatically in pre-save hook
        role: 'admin',
      });
      await adminUser.save();
      console.log(`Default admin created: ${adminEmail} / adminpassword123`);
    } else {
      console.log('Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
