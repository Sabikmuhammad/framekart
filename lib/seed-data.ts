// Dummy data for seeding the database
// You can import this in a seed script or add manually through the admin panel

export const dummyFrames = [
  {
    title: "Modern Black Frame",
    description: "Sleek and contemporary black frame perfect for modern interiors. Made with high-quality materials for lasting durability.",
    price: 1299,
    category: "Modern",
    frame_material: "Aluminum",
    frame_size: "12x16 inches",
    tags: ["modern", "black", "aluminum", "contemporary"],
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
    stock: 25,
  },
  {
    title: "Classic Wooden Frame",
    description: "Timeless wooden frame with elegant finish. Perfect for traditional and rustic decor styles.",
    price: 1599,
    category: "Classic",
    frame_material: "Oak Wood",
    frame_size: "16x20 inches",
    tags: ["classic", "wood", "traditional", "oak"],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800",
    stock: 18,
  },
  {
    title: "Vintage Gold Frame",
    description: "Ornate gold frame with intricate detailing. Adds a touch of luxury to any artwork or photograph.",
    price: 2499,
    category: "Vintage",
    frame_material: "Gold-plated Metal",
    frame_size: "18x24 inches",
    tags: ["vintage", "gold", "ornate", "luxury"],
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    stock: 12,
  },
  {
    title: "Minimalist White Frame",
    description: "Clean and simple white frame for a minimalist aesthetic. Versatile design works with any decor.",
    price: 999,
    category: "Minimalist",
    frame_material: "MDF",
    frame_size: "8x10 inches",
    tags: ["minimalist", "white", "simple", "clean"],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800",
    stock: 35,
  },
  {
    title: "Industrial Metal Frame",
    description: "Rugged metal frame with industrial charm. Perfect for urban loft spaces and modern industrial decor.",
    price: 1799,
    category: "Modern",
    frame_material: "Iron",
    frame_size: "20x24 inches",
    tags: ["industrial", "metal", "urban", "loft"],
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    stock: 20,
  },
  {
    title: "Rustic Barnwood Frame",
    description: "Reclaimed barnwood frame with authentic weathered finish. Each piece is unique with natural variations.",
    price: 2199,
    category: "Vintage",
    frame_material: "Reclaimed Wood",
    frame_size: "16x20 inches",
    tags: ["rustic", "barnwood", "reclaimed", "vintage"],
    imageUrl: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800",
    stock: 10,
  },
  {
    title: "Contemporary Silver Frame",
    description: "Sophisticated silver frame with brushed finish. Adds elegance to contemporary spaces.",
    price: 1499,
    category: "Modern",
    frame_material: "Aluminum",
    frame_size: "12x16 inches",
    tags: ["contemporary", "silver", "brushed", "elegant"],
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
    stock: 22,
  },
  {
    title: "Classic Mahogany Frame",
    description: "Rich mahogany wood frame with deep tones. Traditional craftsmanship meets timeless design.",
    price: 2799,
    category: "Classic",
    frame_material: "Mahogany Wood",
    frame_size: "20x30 inches",
    tags: ["classic", "mahogany", "traditional", "rich"],
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800",
    stock: 8,
  },
  {
    title: "Scandinavian Pine Frame",
    description: "Light pine frame with natural finish. Embodies Scandinavian simplicity and warmth.",
    price: 1199,
    category: "Minimalist",
    frame_material: "Pine Wood",
    frame_size: "11x14 inches",
    tags: ["scandinavian", "pine", "natural", "nordic"],
    imageUrl: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800",
    stock: 28,
  },
  {
    title: "Art Deco Gold Frame",
    description: "Glamorous Art Deco style frame with geometric patterns. Perfect for statement pieces.",
    price: 3299,
    category: "Vintage",
    frame_material: "Brass",
    frame_size: "24x36 inches",
    tags: ["art-deco", "gold", "geometric", "glamorous"],
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    stock: 6,
  },
  {
    title: "Modern Acrylic Frame",
    description: "Ultra-modern clear acrylic frame. Creates a floating effect for your artwork.",
    price: 1899,
    category: "Modern",
    frame_material: "Acrylic",
    frame_size: "16x20 inches",
    tags: ["modern", "acrylic", "clear", "floating"],
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
    stock: 15,
  },
  {
    title: "Gallery Black Matte Frame",
    description: "Professional gallery-quality matte black frame. Museum-grade materials for your precious art.",
    price: 2999,
    category: "Modern",
    frame_material: "Wood Composite",
    frame_size: "24x36 inches",
    tags: ["gallery", "black", "matte", "professional"],
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
    stock: 14,
  },
];

// Instructions to seed:
// 1. Use the admin panel at /admin/frames
// 2. Or create a seed script:
/*
import dbConnect from '@/lib/db';
import Frame from '@/models/Frame';
import { dummyFrames } from './seed-data';

async function seed() {
  await dbConnect();
  await Frame.deleteMany({}); // Clear existing
  await Frame.insertMany(dummyFrames);
  console.log('Database seeded!');
}

seed();
*/
