
export enum UserRole {
  ADMIN = 'Admin',
  ARTIST = 'Artist',
  CUSTOMER = 'Customer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  avatarUrl?: string;
  status: 'Active' | 'Banned' | 'Pending';
}

export enum StickerStatus {
  PENDING = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  UNLISTED = 'Unlisted'
}

export interface Sticker {
  id: string;
  name: string;
  imageUrl: string;
  artistId: string;
  artistName: string;
  category: string;
  tags: string[];
  price: number;
  description: string;
  status: StickerStatus;
  submissionDate: string;
  approvedDate?: string;
  sales: number;
}

export interface Artist {
  id: string;
  userId: string; // Links to User table
  name: string; // Denormalized for convenience
  email: string; // Denormalized
  portfolioUrl?: string;
  bio: string;
  payoutInfo?: string; // e.g., PayPal email, bank details (mocked)
  status: 'Verified' | 'Pending Verification' | 'Suspended';
  joinedDate: string;
  totalSales: number;
  stickerCount: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded'
}

export interface OrderItem {
  stickerId: string;
  stickerName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Order {
  id: string;
  customerId: string; // Links to User table
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentageChange?: number; // Optional: e.g., +5% or -2% from last period
}

export interface TableColumn<T> {
  key: keyof T | string; // Allow string for custom render keys
  header: string;
  render?: (item: T) => React.ReactNode; // Custom render function for a cell
}

export interface GroundingChunkWeb {
  uri?: string; // Made optional
  title?: string; // Made optional
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields can be added here
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // Other candidate fields
}

export interface GeminiAnalysisResult {
  summary?: string;
  suggestedTags?: string[];
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  safetyRating?: 'Safe' | 'Caution' | 'Unsafe';
  error?: string;
  sources?: GroundingChunkWeb[];
}

// Types for Custom Sticker Builder
export type DesignElementType = 'text' | 'shape' | 'image' | 'clipart';

export interface DesignElement {
  id: string;
  type: DesignElementType;
  x: number;
  y: number;
  width: number; 
  height: number; 
  rotation: number;
  fill: string; 
  stroke?: string; 
  strokeWidth?: number;
  opacity: number;
  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  // Shape specific
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'star';
  // Image/Clipart specific
  src?: string;
  originalWidth?: number; // for scaling images
  originalHeight?: number; // for scaling images
}

export interface ClipartItem {
  id: string;
  name: string;
  src: string; // URL to the clipart image (SVG or PNG)
  category: string;
  tags: string[];
}

export interface StickerCustomizationConfig {
  availableFonts: { name: string; value: string; genericFamily: string }[];
  availableColors: string[];
  defaultTextColor: string;
  defaultShapeFill: string;
  clipartCategories: { name: string; items: ClipartItem[] }[];
  stickerProductOptions: {
    shapes: { name: string; value: 'die-cut' | 'rectangle' | 'circle' | 'square'; icon?: React.ReactNode }[];
    materials: { name: string; value: string; description: string; priceFactor: number }[];
    sizes: { name: string; widthCM: number; heightCM: number; priceFactor: number }[]; // Predefined, or allow custom
  };
  canvasDefaultWidth: number;
  canvasDefaultHeight: number;
}

export type ActiveTool = DesignElementType | 'select' | 'upload' | null;

export interface StickerFinalDetails {
  size: { widthCM: number; heightCM: number; name?: string };
  shape: string;
  material: string;
  quantity: number;
  estimatedPrice: number;
}