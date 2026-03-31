import dynamic from 'next/dynamic';
import { Download, FileText } from 'lucide-react';
import { HeroSection } from '@/components/sections/hero-section';

// Shared loading skeleton for below-fold sections
function SectionSkeleton() {
  return (
    <div className="py-20 lg:py-28 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

// Lazy load below-the-fold sections for faster initial page load
const AboutSection = dynamic(
  () => import('@/components/sections/about-section').then(m => ({ default: m.AboutSection })),
  { loading: () => <SectionSkeleton /> }
);
const ProductionLineSection = dynamic(
  () => import('@/components/sections/production-line-section').then(m => ({ default: m.ProductionLineSection })),
  { loading: () => <SectionSkeleton /> }
);
const ProductsSection = dynamic(
  () => import('@/components/sections/products-section').then(m => ({ default: m.ProductsSection })),
  { loading: () => <SectionSkeleton /> }
);
const CompressorsSection = dynamic(
  () => import('@/components/sections/compressors-section').then(m => ({ default: m.CompressorsSection })),
  { loading: () => <SectionSkeleton /> }
);
const ClientsSection = dynamic(
  () => import('@/components/sections/clients-section').then(m => ({ default: m.ClientsSection })),
  { loading: () => <SectionSkeleton /> }
);
const CertificatesSection = dynamic(
  () => import('@/components/sections/certificates-section').then(m => ({ default: m.CertificatesSection })),
  { loading: () => <SectionSkeleton /> }
);
const ExhibitionsSection = dynamic(
  () => import('@/components/sections/exhibitions-section').then(m => ({ default: m.ExhibitionsSection })),
  { loading: () => <SectionSkeleton /> }
);
const TVSection = dynamic(
  () => import('@/components/sections/tv-section').then(m => ({ default: m.TVSection })),
  { loading: () => <SectionSkeleton /> }
);
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then(m => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton /> }
);

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductionLineSection />
      <ProductsSection />
      <CompressorsSection />

      {/* Catalogs Download Section */}
      <section className="py-12 lg:py-16 bg-steel-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
              تحميل الكتالوجات
            </h2>
            <p className="text-white/50 text-sm">حمّل كتالوجات منتجاتنا للاطلاع على كافة التفاصيل والمواصفات</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Products Catalog */}
            <a
              href="/downloads/products-catalog.pdf"
              download="SNA-Products-Catalog.pdf"
              className="group flex items-center gap-5 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 p-6 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                <FileText size={28} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1">كتالوج المنتجات</h3>
                <p className="text-white/40 text-xs mb-2">Products Catalog — PDF</p>
                <span className="text-primary text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  <Download size={12} />
                  تحميل الآن
                </span>
              </div>
            </a>

            {/* Compressors Catalog */}
            <a
              href="/downloads/compressors-catalog.pdf"
              download="SNA-Compressors-Catalog.pdf"
              className="group flex items-center gap-5 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 p-6 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                <FileText size={28} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1">كتالوج الضواغط</h3>
                <p className="text-white/40 text-xs mb-2">Compressors Catalog — PDF</p>
                <span className="text-primary text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  <Download size={12} />
                  تحميل الآن
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <ClientsSection />
      <CertificatesSection />
      <ExhibitionsSection />
      <TVSection />
      <ContactSection />

      {/* Map Section */}
      <section className="bg-neutral-50">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-steel-900 mb-2">موقعنا</h2>
            <p className="text-neutral-500 text-sm">مدينة العاشر من رمضان — المنطقة الصناعية B4 — قطعة 183</p>
          </div>
          <div className="h-64 md:h-80 lg:h-96 overflow-hidden border border-neutral-200">
            <iframe
              src="https://maps.google.com/maps?q=30.3152746,31.7830169&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SNA Al-Attal Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
