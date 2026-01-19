'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Settings,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

const productData = {
  'automatic-filling-machine': {
    nameKey: 'products.filling1.name',
    descKey: 'products.filling1.desc',
    fullDescKey: 'products.filling1.fullDesc',
    images: [
      '/images/products/filling-machine.jpg',
      '/images/products/filling-machine-2.jpg',
      '/images/products/filling-machine-3.jpg',
    ],
    category: 'filling',
    specifications: [
      { label: 'Capacity', value: '2000-6000 BPH' },
      { label: 'Bottle Size', value: '100ml - 5L' },
      { label: 'Filling Accuracy', value: '±0.5%' },
      { label: 'Power', value: '380V/50Hz' },
      { label: 'Air Pressure', value: '0.6-0.8 MPa' },
      { label: 'Material', value: 'SS304/SS316' },
    ],
    features: [
      'Servo motor driven for precise filling',
      'PLC control with touch screen interface',
      'Anti-drip filling nozzles',
      'Automatic bottle positioning',
      'CIP cleaning system',
      'GMP compliant design',
    ],
    applications: ['Water', 'Juice', 'Oil', 'Chemicals', 'Pharmaceuticals'],
  },
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const t = useTranslations('productDetail');
  const [activeImage, setActiveImage] = useState(0);

  const product = productData[params.slug as keyof typeof productData] || productData['automatic-filling-machine'];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Breadcrumb */}
      <div className="bg-dark-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
              {t('breadcrumb.home')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <Link href="/products" className="text-gray-400 hover:text-primary transition-colors">
              {t('breadcrumb.products')}
            </Link>
            <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
            <span className="text-primary">{t(product.nameKey)}</span>
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
                <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-dark-50">
                  <Image
                    src={product.images[activeImage]}
                    alt={t(product.nameKey)}
                    fill
                    className="object-cover"
                  />

                  {/* Navigation Arrows */}
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
                </div>

                {/* Thumbnails */}
                <div className="flex gap-4 mt-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
                {t(`categories.${product.category}`)}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t(product.nameKey)}
              </h1>

              <p className="text-gray-300 text-lg mb-8">
                {t(product.descKey)}
              </p>

              {/* Key Features Icons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Zap className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('features.highSpeed')}</p>
                    <p className="text-gray-400 text-sm">{t('features.highSpeedDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Shield className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('features.quality')}</p>
                    <p className="text-gray-400 text-sm">{t('features.qualityDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Settings className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('features.customizable')}</p>
                    <p className="text-gray-400 text-sm">{t('features.customizableDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-xl">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Award className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('features.certified')}</p>
                    <p className="text-gray-400 text-sm">{t('features.certifiedDesc')}</p>
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
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Download size={18} className="ml-2" />
                  {t('downloadBrochure')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-dark-50 mb-8">
              <TabsTrigger value="specifications">{t('tabs.specifications')}</TabsTrigger>
              <TabsTrigger value="features">{t('tabs.features')}</TabsTrigger>
              <TabsTrigger value="applications">{t('tabs.applications')}</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{t('technicalSpecs')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-dark rounded-xl border border-white/10"
                    >
                      <span className="text-gray-400">{spec.label}</span>
                      <span className="text-white font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="features">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{t('keyFeatures')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-dark rounded-xl border border-white/10"
                    >
                      <div className="p-1 bg-primary/20 rounded-full">
                        <Check className="text-primary" size={16} />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="applications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-50 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{t('suitableFor')}</h3>
                <div className="flex flex-wrap gap-4">
                  {product.applications.map((app, index) => (
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
          </Tabs>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-dark to-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-300 mb-8">
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
                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
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
