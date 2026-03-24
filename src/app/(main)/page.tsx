import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';

// Lazy load below-the-fold sections for faster initial page load
const AboutSection = dynamic(() => import('@/components/sections/about-section').then(m => ({ default: m.AboutSection })));
const ProductionLineSection = dynamic(() => import('@/components/sections/production-line-section').then(m => ({ default: m.ProductionLineSection })));
const ProductsSection = dynamic(() => import('@/components/sections/products-section').then(m => ({ default: m.ProductsSection })));
const ClientsSection = dynamic(() => import('@/components/sections/clients-section').then(m => ({ default: m.ClientsSection })));
const CertificatesSection = dynamic(() => import('@/components/sections/certificates-section').then(m => ({ default: m.CertificatesSection })));
const ExhibitionsSection = dynamic(() => import('@/components/sections/exhibitions-section').then(m => ({ default: m.ExhibitionsSection })));
const TVSection = dynamic(() => import('@/components/sections/tv-section').then(m => ({ default: m.TVSection })));
const ContactSection = dynamic(() => import('@/components/sections/contact-section').then(m => ({ default: m.ContactSection })));

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
