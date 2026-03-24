import dynamic from 'next/dynamic';
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
      <ClientsSection />
      <CertificatesSection />
      <ExhibitionsSection />
      <TVSection />
      <ContactSection />
    </>
  );
}
