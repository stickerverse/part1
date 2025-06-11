
import { User, Sticker, Artist, Order, UserRole, StickerStatus, OrderStatus, StickerCustomizationConfig, ClipartItem } from './types';
import React from 'react'; // Import React for potential JSX in icons, though not used in this snippet directly

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@example.com', role: UserRole.ADMIN, joinedDate: '2023-01-15', status: 'Active', avatarUrl: 'https://picsum.photos/seed/alice/100/100' },
  { id: 'u2', name: 'Bob Artist', email: 'bob@example.com', role: UserRole.ARTIST, joinedDate: '2023-02-20', status: 'Active', avatarUrl: 'https://picsum.photos/seed/bob/100/100' },
  { id: 'u3', name: 'Charlie Customer', email: 'charlie@example.com', role: UserRole.CUSTOMER, joinedDate: '2023-03-10', status: 'Active', avatarUrl: 'https://picsum.photos/seed/charlie/100/100' },
  { id: 'u4', name: 'Diana Banned', email: 'diana@example.com', role: UserRole.CUSTOMER, joinedDate: '2023-04-05', status: 'Banned', avatarUrl: 'https://picsum.photos/seed/diana/100/100' },
  { id: 'u5', name: 'Edward Pending', email: 'edward@example.com', role: UserRole.ARTIST, joinedDate: '2024-07-20', status: 'Pending', avatarUrl: 'https://picsum.photos/seed/edward/100/100' },
];

export const MOCK_ARTISTS: Artist[] = [
  { id: 'a1', userId: 'u2', name: 'Bob Artist', email: 'bob@example.com', bio: 'Loves creating vibrant and quirky stickers.', status: 'Verified', joinedDate: '2023-02-20', totalSales: 1250.75, stickerCount: 15, portfolioUrl: 'https://example.com/bobart' },
  { id: 'a2', userId: 'u5', name: 'Edward Pending', email: 'edward@example.com', bio: 'Aspiring digital artist focusing on minimalist designs.', status: 'Pending Verification', joinedDate: '2024-07-20', totalSales: 0, stickerCount: 0 },
  { id: 'a3', name: 'Fiona Creative', email: 'fiona@example.com', userId: 'u6', bio: 'Specializes in cute animal stickers.', status: 'Verified', joinedDate: '2023-05-10', totalSales: 850.00, stickerCount: 22, portfolioUrl: 'https://example.com/fiona' },
];

export const MOCK_STICKERS: Sticker[] = [
  { id: 's1', name: 'Cool Cat', imageUrl: 'https://picsum.photos/seed/catsticker/200/200', artistId: 'a1', artistName: 'Bob Artist', category: 'Animals', tags: ['cat', 'cool', 'sunglasses'], price: 3.99, description: 'A very cool cat wearing sunglasses.', status: StickerStatus.APPROVED, submissionDate: '2023-03-01', sales: 150, approvedDate: '2023-03-05' },
  { id: 's2', name: 'Space Explorer', imageUrl: 'https://picsum.photos/seed/spacesticker/200/200', artistId: 'a1', artistName: 'Bob Artist', category: 'Space', tags: ['astronaut', 'rocket', 'stars'], price: 4.50, description: 'An adventurous astronaut exploring the cosmos.', status: StickerStatus.APPROVED, submissionDate: '2023-04-10', sales: 95, approvedDate: '2023-04-15' },
  { id: 's3', name: 'Geometric Pattern', imageUrl: 'https://picsum.photos/seed/patternsticker/200/200', artistId: 'a3', artistName: 'Fiona Creative', category: 'Abstract', tags: ['geometric', 'pattern', 'modern'], price: 2.99, description: 'A mesmerizing geometric pattern sticker.', status: StickerStatus.PENDING, submissionDate: '2024-07-15', sales: 0 },
  { id: 's4', name: 'Happy Avocado', imageUrl: 'https://picsum.photos/seed/avocadosticker/200/200', artistId: 'a3', artistName: 'Fiona Creative', category: 'Food', tags: ['avocado', 'cute', 'happy', 'foodie'], price: 3.25, description: 'A cheerful and adorable avocado sticker.', status: StickerStatus.REJECTED, submissionDate: '2024-06-20', sales: 0 },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'o1', customerId: 'u3', customerName: 'Charlie Customer', orderDate: '2024-07-01', items: [{ stickerId: 's1', stickerName: 'Cool Cat', quantity: 2, pricePerUnit: 3.99 }], totalAmount: 7.98, status: OrderStatus.DELIVERED, shippingAddress: '123 Main St, Anytown, USA', trackingNumber: 'XYZ123456789' },
  { id: 'o2', customerId: 'u3', customerName: 'Charlie Customer', orderDate: '2024-07-10', items: [{ stickerId: 's2', stickerName: 'Space Explorer', quantity: 1, pricePerUnit: 4.50 }, { stickerId: 's1', stickerName: 'Cool Cat', quantity: 1, pricePerUnit: 3.99 }], totalAmount: 8.49, status: OrderStatus.SHIPPED, shippingAddress: '123 Main St, Anytown, USA', trackingNumber: 'ABC987654321' },
  { id: 'o3', customerId: 'u4', customerName: 'Diana Banned', orderDate: '2024-07-15', items: [{ stickerId: 's3', stickerName: 'Geometric Pattern', quantity: 3, pricePerUnit: 2.99 }], totalAmount: 8.97, status: OrderStatus.PROCESSING, shippingAddress: '456 Oak Ave, Otherville, USA' },
  { id: 'o4', customerId: 'u3', customerName: 'Charlie Customer', orderDate: '2024-07-20', items: [{ stickerId: 's1', stickerName: 'Cool Cat', quantity: 5, pricePerUnit: 3.99 }], totalAmount: 19.95, status: OrderStatus.PENDING, shippingAddress: '123 Main St, Anytown, USA' },
];

export const SALES_DATA_MONTHLY = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
];

export const STICKER_CATEGORY_DISTRIBUTION = [
  { name: 'Animals', value: 400 },
  { name: 'Space', value: 300 },
  { name: 'Abstract', value: 200 },
  { name: 'Food', value: 250 },
  { name: 'Quotes', value: 150 },
];

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';


// --- Sticker Builder Constants ---

const genericClipart = (name: string, seed: string, tags: string[] = []): ClipartItem => ({
  id: `clipart-${seed}`,
  name,
  // Using a placeholder service that generates SVGs based on a seed.
  // In a real app, these would be curated SVGs or PNGs.
  src: `https://api.dicebear.com/8.x/icons/svg?seed=${seed}&backgroundColor=transparent&iconColor=64748b,818cf8,a78bfa,f472b6,fb923c,a3e635,4ade80,34d399,22d3ee,38bdf8,f43f5e`,
  category: 'Generic',
  tags: [name.toLowerCase(), ...tags],
});

export const STICKER_BUILDER_CONFIG: StickerCustomizationConfig = {
  availableFonts: [
    { name: 'Arial', value: 'Arial, sans-serif', genericFamily: 'sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif', genericFamily: 'sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif', genericFamily: 'serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif', genericFamily: 'cursive' },
    { name: 'Impact', value: 'Impact, fantasy', genericFamily: 'fantasy' },
    { name: 'Lobster', value: 'Lobster, cursive', genericFamily: 'cursive' }, // Example web font
    { name: 'Pacifico', value: 'Pacifico, cursive', genericFamily: 'cursive' }, // Example web font
  ],
  availableColors: [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed', '#6366f1', '#2563eb', '#0284c7',
    '#0e7490', '#0d9488', '#059669', '#16a34a', '#65a30d', '#ca8a04', '#d97706', '#ea580c',
  ],
  defaultTextColor: '#FFFFFF',
  defaultShapeFill: '#6366f1', // Indigo
  clipartCategories: [
    { 
      name: 'Emojis', 
      items: [
        genericClipart('Happy Face', 'smile', ['emoji', 'happy']),
        genericClipart('Heart', 'heart', ['emoji', 'love']),
        genericClipart('Star', 'star', ['emoji', 'favorite']),
        genericClipart('Thumbs Up', 'thumbsUp', ['emoji', 'like', 'approve']),
      ]
    },
    { 
      name: 'Abstract', 
      items: [
        genericClipart('Swirl', 'swirlAbstract', ['abstract', 'swirl']),
        genericClipart('Blocks', 'blocksAbstract', ['abstract', 'geometric']),
        genericClipart('Lines', 'linesAbstract', ['abstract', 'pattern']),
      ]
    },
     { 
      name: 'Nature', 
      items: [
        genericClipart('Leaf', 'leafNature', ['nature', 'plant', 'eco']),
        genericClipart('Mountain', 'mountainNature', ['nature', 'adventure', 'peak']),
        genericClipart('Wave', 'waveNature', ['nature', 'water', 'sea']),
      ]
    }
  ],
  stickerProductOptions: {
    shapes: [
      { name: 'Die-Cut (Follows Design)', value: 'die-cut' },
      { name: 'Rectangle', value: 'rectangle' },
      { name: 'Circle', value: 'circle' },
      { name: 'Square', value: 'square' },
    ],
    materials: [
      { name: 'Glossy Vinyl', value: 'vinyl-glossy', description: 'Shiny, durable, waterproof.', priceFactor: 1.2 },
      { name: 'Matte Vinyl', value: 'vinyl-matte', description: 'Smooth, non-glare, durable.', priceFactor: 1.1 },
      { name: 'Paper', value: 'paper', description: 'Eco-friendly, for indoor use.', priceFactor: 0.8 },
    ],
    sizes: [
      { name: 'Small (5x5 cm)', widthCM: 5, heightCM: 5, priceFactor: 1.0 },
      { name: 'Medium (8x8 cm)', widthCM: 8, heightCM: 8, priceFactor: 1.5 },
      { name: 'Large (12x12 cm)', widthCM: 12, heightCM: 12, priceFactor: 2.2 },
      { name: 'Custom', widthCM: 10, heightCM: 10, priceFactor: 1.8 }, // Placeholder for custom logic
    ],
  },
  canvasDefaultWidth: 500, // pixels for display
  canvasDefaultHeight: 500, // pixels for display
};
