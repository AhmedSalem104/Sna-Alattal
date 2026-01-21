'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample products data (will be fetched from API later)
const sampleProducts = [
  {
    id: '1',
    name: 'ماكينة تعبئة السوائل الأوتوماتيكية',
    nameEn: 'Automatic Liquid Filling Machine',
    category: 'ماكينات التعبئة',
    image: '/images/logo.jpg',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'ماكينة غلق الزجاجات',
    nameEn: 'Bottle Capping Machine',
    category: 'ماكينات الغلق',
    image: '/images/logo.jpg',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'ماكينة لصق الملصقات',
    nameEn: 'Labeling Machine',
    category: 'ماكينات اللصق',
    image: '/images/logo.jpg',
    isFeatured: false,
  },
  {
    id: '4',
    name: 'خط إنتاج متكامل',
    nameEn: 'Complete Production Line',
    category: 'خطوط الإنتاج',
    image: '/images/logo.jpg',
    isFeatured: true,
  },
];

export function ProductsSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('products.title')}
            </div>
            <h2 className="heading-2 text-gray-900">{t('products.subtitle')}</h2>
          </div>

          <Button variant="goldOutline" asChild className="group shrink-0">
            <Link href="/products">
              {t('products.viewAll')}
              <ArrowRight className="mr-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </Button>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.id}`}>
                <Card className="group bg-gray-50 border-gray-200 hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-60" />

                    {/* Featured Badge */}
                    {product.isFeatured && (
                      <Badge variant="gold" className="absolute top-4 right-4">
                        مميز
                      </Badge>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <ArrowUpRight size={24} className="text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <p className="text-xs text-primary mb-2">{product.category}</p>
                    <h3 className="text-gray-900 font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
