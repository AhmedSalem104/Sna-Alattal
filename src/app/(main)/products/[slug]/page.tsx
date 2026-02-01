'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Check,
  Download,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Settings,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocale } from '@/hooks/useLocale';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  slug: string;
  image: string;
  images: string[] | null;
  specifications: Record<string, string> | null;
  features: string[] | null;
  applications: string[] | null;
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    slug: string;
  } | null;
  relatedProducts: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameTr: string;
    slug: string;
    image: string;
  }[];
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const t = useTranslations('productDetail');
  const { locale } = useLocale();
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/products/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('notFound');
          } else {
            setError('fetchError');
          }
          return;
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('fetchError');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const getName = (item: { nameAr: string; nameEn: string; nameTr: string }) => {
    switch (locale) {
      case 'ar': return item.nameAr;
      case 'tr': return item.nameTr;
      default: return item.nameEn;
    }
  };

  const getDescription = (item: { descriptionAr: string; descriptionEn: string; descriptionTr: string }) => {
    switch (locale) {
      case 'ar': return item.descriptionAr;
      case 'tr': return item.descriptionTr;
      default: return item.descriptionEn;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'notFound' ? t('errors.notFound') : t('errors.fetchError')}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'notFound' ? t('errors.notFoundDesc') : t('errors.fetchErrorDesc')}
          </p>
          <Link href="/products">
            <Button variant="gold">{t('backToProducts')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const specifications = product.specifications
    ? Object.entries(product.specifications).map(([label, value]) => ({ label, value }))
    : [];

  const features = product.features || [];
  const applications = product.applications || [];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
              {t('breadcrumb.products')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <span className="text-primary">{getName(product)}</span>
          </div>
        </div>
      </div>

      {/* Product Hero */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-50">
                  <Image
                    src={allImages[activeImage] || '/images/placeholders/product.svg'}
                    alt={getName(product)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-primary transition-colors"
                      >
                        <ChevronRight size={24} className="text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-primary transition-colors"
                      >
                        <ChevronLeft size={24} className="text-white" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                    {allImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt="" fill sizes="96px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {product.category && (
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
                  {getName(product.category)}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getName(product)}
              </h1>

              <p className="text-gray-700 text-lg mb-8">
                {getDescription(product)}
              </p>

              {/* Key Features Icons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Zap className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{t('features.highSpeed')}</p>
                    <p className="text-gray-600 text-sm">{t('features.highSpeedDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Shield className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{t('features.quality')}</p>
                    <p className="text-gray-600 text-sm">{t('features.qualityDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Settings className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{t('features.customizable')}</p>
                    <p className="text-gray-600 text-sm">{t('features.customizableDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Award className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{t('features.certified')}</p>
                    <p className="text-gray-600 text-sm">{t('features.certifiedDesc')}</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="gold" size="lg">
                    <Phone size={18} className="ml-2" />
                    {t('requestQuote')}
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                  <Download size={18} className="ml-2" />
                  {t('downloadBrochure')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      {(specifications.length > 0 || features.length > 0 || applications.length > 0) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue={specifications.length > 0 ? "specifications" : features.length > 0 ? "features" : "applications"} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-gray-50 mb-8">
                {specifications.length > 0 && (
                  <TabsTrigger value="specifications">{t('tabs.specifications')}</TabsTrigger>
                )}
                {features.length > 0 && (
                  <TabsTrigger value="features">{t('tabs.features')}</TabsTrigger>
                )}
                {applications.length > 0 && (
                  <TabsTrigger value="applications">{t('tabs.applications')}</TabsTrigger>
                )}
              </TabsList>

              {specifications.length > 0 && (
                <TabsContent value="specifications">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-2xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('technicalSpecs')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specifications.map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200"
                        >
                          <span className="text-gray-600">{spec.label}</span>
                          <span className="text-gray-900 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              )}

              {features.length > 0 && (
                <TabsContent value="features">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-2xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('keyFeatures')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200"
                        >
                          <div className="p-1 bg-primary/20 rounded-full">
                            <Check className="text-primary" size={16} />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              )}

              {applications.length > 0 && (
                <TabsContent value="applications">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-2xl p-8"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('suitableFor')}</h3>
                    <div className="flex flex-wrap gap-4">
                      {applications.map((app, index) => (
                        <div
                          key={index}
                          className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-full text-primary font-medium"
                        >
                          {app}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
      )}

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.relatedProducts.map((related) => (
                <Link key={related.id} href={`/products/${related.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-lg transition-all group">
                    <div className="relative h-40">
                      <Image
                        src={related.image || '/images/placeholders/product.svg'}
                        alt={getName(related)}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {getName(related)}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-white to-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-700 mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="gold" size="xl">
                  <Mail size={20} className="ml-2" />
                  {t('cta.contact')}
                </Button>
              </Link>
              <a href="tel:+201234567890">
                <Button variant="outline" size="xl" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                  <Phone size={20} className="ml-2" />
                  {t('cta.call')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
