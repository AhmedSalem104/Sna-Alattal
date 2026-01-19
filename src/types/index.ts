// Base Types
export interface LocalizedString {
  ar: string;
  en: string;
  tr: string;
}

export interface SEO {
  title: LocalizedString;
  description: LocalizedString;
  keywords: string[];
}

export interface Image {
  url: string;
  alt: LocalizedString;
  width?: number;
  height?: number;
}

// Product Types
export interface Product {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  shortDescription: LocalizedString;
  images: Image[];
  categoryId: string;
  category?: Category;
  features: LocalizedString[];
  specifications: Record<string, LocalizedString>;
  seo: SEO;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  image?: Image;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Solution Types
export interface Solution {
  id: string;
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  shortDescription: LocalizedString;
  icon: string;
  image: Image;
  features: LocalizedString[];
  products?: Product[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Client Types
export interface Client {
  id: string;
  name: LocalizedString;
  logo: Image;
  website?: string;
  description?: LocalizedString;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Team Types
export interface TeamMember {
  id: string;
  name: LocalizedString;
  position: LocalizedString;
  bio: LocalizedString;
  image: Image;
  email?: string;
  phone?: string;
  linkedin?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Certificate Types
export interface Certificate {
  id: string;
  name: LocalizedString;
  issuingBody: LocalizedString;
  description: LocalizedString;
  image: Image;
  issueDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Exhibition Types
export interface Exhibition {
  id: string;
  name: LocalizedString;
  location: LocalizedString;
  description: LocalizedString;
  images: Image[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// TV Interview Types
export interface TVInterview {
  id: string;
  title: LocalizedString;
  channel: LocalizedString;
  description: LocalizedString;
  videoUrl: string;
  thumbnail: Image;
  date: Date;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// News Types
export interface News {
  id: string;
  title: LocalizedString;
  slug: string;
  content: LocalizedString;
  excerpt: LocalizedString;
  image: Image;
  author?: string;
  publishedAt: Date;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seo: SEO;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Slide Types
export interface Slide {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  image: Image;
  buttonText: LocalizedString;
  buttonLink: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Contact Message Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Catalogue Types
export interface Catalogue {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  fileUrl: string;
  thumbnail: Image;
  fileSize: number;
  downloadCount: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Settings Types
export interface Settings {
  id: string;
  key: string;
  value: unknown;
  group: string;
  updatedAt: Date;
}

// Page Types
export interface Page {
  id: string;
  title: LocalizedString;
  slug: string;
  content: LocalizedString;
  seo: SEO;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entity: string;
  entityId: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  image?: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}
