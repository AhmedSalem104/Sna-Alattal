/**
 * Static data layer - reads from pre-exported JSON files in src/data/
 * instead of querying the database at runtime.
 */

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import clientsData from '@/data/clients.json';
import certificatesData from '@/data/certificates.json';
import exhibitionsData from '@/data/exhibitions.json';
import slidesData from '@/data/slides.json';
import settingsData from '@/data/settings.json';
import teamData from '@/data/team.json';
import tvInterviewsData from '@/data/tv-interviews.json';
import newsData from '@/data/news.json';
import solutionsData from '@/data/solutions.json';
import compressorsData from '@/data/compressors.json';
import { parseImages } from '@/lib/parse-images';

// ─── Types ───────────────────────────────────────────────────────────────────

type Product = (typeof productsData)[number];
type Category = (typeof categoriesData)[number];
type Client = (typeof clientsData)[number];
type Certificate = (typeof certificatesData)[number];
type Exhibition = (typeof exhibitionsData)[number];
type Slide = (typeof slidesData)[number];
type TeamMember = (typeof teamData)[number];
type TVInterview = (typeof tvInterviewsData)[number];
type NewsItem = (typeof newsData)[number];
type Solution = (typeof solutionsData)[number];
type Compressor = (typeof compressorsData)[number];

// ─── Helper: sort by multiple fields ─────────────────────────────────────────

function sortBy<T>(arr: T[], ...keys: { key: keyof T; dir: 'asc' | 'desc' }[]): T[] {
  return [...arr].sort((a, b) => {
    for (const { key, dir } of keys) {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv == null) continue;
      if (av == null) return dir === 'asc' ? -1 : 1;
      if (bv == null) return dir === 'asc' ? 1 : -1;
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

export function getProducts(options?: {
  featured?: boolean;
  limit?: number;
  categoryId?: string;
}) {
  let items = (productsData as Product[]).filter(
    (p) => p.isActive && !p.deletedAt
  );

  if (options?.featured) {
    items = items.filter((p) => p.isFeatured);
  }
  if (options?.categoryId) {
    items = items.filter((p) => p.categoryId === options.categoryId);
  }

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  // Transform: include category and ensure images is always an array
  return items.map((p) => ({
    ...p,
    images: parseImages(p.images),
    category: p.category ?? null,
  }));
}

export function getProductBySlug(slug: string) {
  const products = productsData as Product[];
  const product = products.find(
    (p) => p.slug === slug && p.isActive && !p.deletedAt
  );

  if (!product) return null;

  // Parse product images
  const productImages = parseImages(product.images);
  const productImage =
    productImages.length > 0
      ? productImages[0]
      : '/images/placeholders/product.svg';

  // Get related products from same category
  const relatedProducts = sortBy(
    products.filter(
      (p) =>
        p.categoryId === product.categoryId &&
        p.isActive &&
        !p.deletedAt &&
        p.id !== product.id
    ),
    { key: 'order', dir: 'asc' }
  )
    .slice(0, 4)
    .map((p) => {
      const imgs = parseImages(p.images);
      return {
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        nameTr: p.nameTr,
        slug: p.slug,
        images: imgs,
        image: imgs.length > 0 ? imgs[0] : '/images/placeholders/product.svg',
      };
    });

  // Safely parse JSON fields
  let specifications = product.specifications as unknown;
  if (typeof specifications === 'string') {
    try {
      specifications = JSON.parse(specifications);
    } catch {
      specifications = {};
    }
  }
  if (
    !specifications ||
    typeof specifications !== 'object' ||
    Array.isArray(specifications)
  ) {
    specifications = {};
  }

  let features = product.features as unknown;
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features);
    } catch {
      features = [];
    }
  }
  if (!Array.isArray(features)) {
    features = [];
  }

  return {
    ...product,
    images: productImages,
    image: productImage,
    category: product.category ?? null,
    specifications,
    features,
    relatedProducts,
  };
}

// ─── Categories ──────────────────────────────────────────────────────────────

export function getCategories() {
  let items = (categoriesData as Category[]).filter(
    (c) => c.isActive && !c.deletedAt
  );

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'nameAr', dir: 'asc' });

  // Compute _count.products from products data if not already present
  const activeProducts = (productsData as Product[]).filter(
    (p) => p.isActive && !p.deletedAt
  );

  return items.map((c) => ({
    ...c,
    _count: c._count ?? {
      products: activeProducts.filter((p) => p.categoryId === c.id).length,
    },
  }));
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export function getClients(options?: { featured?: boolean; limit?: number }) {
  let items = (clientsData as Client[]).filter(
    (c) => c.isActive && !c.deletedAt
  );

  if (options?.featured) {
    items = items.filter((c) => (c as Client & { isFeatured?: boolean }).isFeatured);
  }

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

// ─── Certificates ────────────────────────────────────────────────────────────

export function getCertificates(options?: { limit?: number }) {
  let items = (certificatesData as Certificate[]).filter(
    (c) => c.isActive && !c.deletedAt
  );

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

// ─── Exhibitions ─────────────────────────────────────────────────────────────

export function getExhibitions(options?: { limit?: number }) {
  let items = (exhibitionsData as Exhibition[]).filter(
    (e) => e.isActive && !e.deletedAt
  );

  items = sortBy(items, { key: 'startDate', dir: 'desc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  // Ensure images is always a proper array
  return items.map((e) => ({
    ...e,
    images: parseImages(e.images),
  }));
}

// ─── Slides ──────────────────────────────────────────────────────────────────

export function getSlides() {
  let items = (slidesData as Slide[]).filter(
    (s) => s.isActive && !s.deletedAt
  );

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'createdAt', dir: 'desc' });

  return items;
}

// ─── Settings ────────────────────────────────────────────────────────────────

// Map setting keys to groups for group-based filtering
const SETTINGS_GROUP_MAP: Record<string, string> = {
  site_name: 'general',
  site_description: 'general',
  contact_email: 'contact',
  contact_phone_egypt: 'contact',
  contact_phone_turkey: 'contact',
  address_egypt: 'offices',
  address_turkey: 'offices',
  social_facebook: 'contact',
  social_linkedin: 'contact',
  social_youtube: 'contact',
  social_instagram: 'contact',
  social_whatsapp: 'contact',
};

const PUBLIC_GROUPS = ['timeline', 'offices', 'statistics', 'contact', 'general'];

export function getSettings(group?: string) {
  // If a specific group is requested, validate it's public
  if (group && !PUBLIC_GROUPS.includes(group)) {
    return null; // signals invalid group
  }

  const allSettings = settingsData as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(allSettings)) {
    const keyGroup = SETTINGS_GROUP_MAP[key] || 'general';
    if (group) {
      if (keyGroup === group) {
        result[key] = value;
      }
    } else {
      // Return all public settings
      if (PUBLIC_GROUPS.includes(keyGroup)) {
        result[key] = value;
      }
    }
  }

  return result;
}

// ─── Team ────────────────────────────────────────────────────────────────────

export function getTeam(options?: { limit?: number }) {
  let items = (teamData as TeamMember[]).filter(
    (t) => t.isActive && !t.deletedAt
  );

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

// ─── TV Interviews ───────────────────────────────────────────────────────────

export function getTvInterviews(options?: { limit?: number }) {
  let items = (tvInterviewsData as TVInterview[]).filter(
    (t) => t.isActive && !t.deletedAt
  );

  items = sortBy(items, { key: 'date', dir: 'desc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

// ─── News ────────────────────────────────────────────────────────────────────

export function getNews(options?: { featured?: boolean; limit?: number }) {
  const now = new Date().toISOString();
  let items = (newsData as NewsItem[]).filter(
    (n) => n.isActive && !n.deletedAt && n.publishedAt && n.publishedAt <= now
  );

  if (options?.featured) {
    items = items.filter((n) => n.isFeatured);
  }

  items = sortBy(items, { key: 'publishedAt', dir: 'desc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

export function getNewsBySlug(slug: string) {
  const now = new Date().toISOString();
  const allNews = (newsData as NewsItem[]).filter(
    (n) => n.isActive && !n.deletedAt && n.publishedAt && n.publishedAt <= now
  );

  const news = allNews.find((n) => n.slug === slug);

  if (!news) return null;

  // Get related news articles
  const relatedNews = sortBy(
    allNews.filter((n) => n.id !== news.id),
    { key: 'publishedAt', dir: 'desc' }
  )
    .slice(0, 3)
    .map((n) => ({
      id: n.id,
      titleAr: n.titleAr,
      titleEn: n.titleEn,
      titleTr: n.titleTr,
      slug: n.slug,
      image: n.image,
      publishedAt: n.publishedAt,
    }));

  return {
    ...news,
    relatedNews,
  };
}

// ─── Solutions ───────────────────────────────────────────────────────────────

export function getSolutions(options?: { featured?: boolean; limit?: number }) {
  let items = (solutionsData as Solution[]).filter(
    (s) => s.isActive && !s.deletedAt
  );

  if (options?.featured) {
    items = items.filter((s) => s.isFeatured);
  }

  items = sortBy(items, { key: 'order', dir: 'asc' }, { key: 'createdAt', dir: 'desc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

export function getSolutionBySlug(slug: string) {
  const allSolutions = solutionsData as Solution[];
  const solution = allSolutions.find(
    (s) => s.slug === slug && s.isActive && !s.deletedAt
  );

  if (!solution) return null;

  // Transform products to include image field from images array
  const transformedProducts = (solution.products || []).map((sp) => {
    const product = sp.product as typeof sp.product & { images?: unknown };
    const imgs = parseImages(product.images);
    return {
      ...sp,
      product: {
        ...product,
        image: imgs.length > 0 ? imgs[0] : '/images/placeholders/product.svg',
      },
    };
  });

  // Safely parse features
  let features = solution.features as unknown;
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features);
    } catch {
      features = [];
    }
  }
  if (!Array.isArray(features)) {
    features = [];
  }

  // Get related solutions
  const relatedSolutions = sortBy(
    allSolutions.filter(
      (s) => s.isActive && !s.deletedAt && s.id !== solution.id
    ),
    { key: 'order', dir: 'asc' }
  )
    .slice(0, 3)
    .map((s) => ({
      id: s.id,
      titleAr: s.titleAr,
      titleEn: s.titleEn,
      titleTr: s.titleTr,
      slug: s.slug,
      icon: s.icon,
    }));

  return {
    ...solution,
    features,
    products: transformedProducts,
    relatedSolutions,
  };
}

// ─── Compressors ──────────────────────────────────────────────────────────────

export function getCompressors(options?: { limit?: number }) {
  let items = [...(compressorsData as Compressor[])];

  items = sortBy(items, { key: 'order', dir: 'asc' });

  if (options?.limit) {
    items = items.slice(0, options.limit);
  }

  return items;
}

export function getCompressorBySlug(slug: string) {
  const allCompressors = compressorsData as Compressor[];
  const compressor = allCompressors.find((c) => c.slug === slug);

  if (!compressor) return null;

  // Get related compressors
  const relatedCompressors = sortBy(
    allCompressors.filter((c) => c.id !== compressor.id),
    { key: 'order', dir: 'asc' }
  )
    .slice(0, 3)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      nameAr: c.nameAr,
      nameEn: c.nameEn,
      nameTr: c.nameTr,
      shortDescAr: c.shortDescAr,
      shortDescEn: c.shortDescEn,
      shortDescTr: c.shortDescTr,
      image: c.image,
    }));

  return {
    ...compressor,
    relatedCompressors,
  };
}
