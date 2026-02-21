import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ProductsSection } from '@/components/sections/products-section';
import { SolutionsSection } from '@/components/sections/solutions-section';
import { ClientsSection } from '@/components/sections/clients-section';
import { CertificatesSection } from '@/components/sections/certificates-section';
import { ExhibitionsSection } from '@/components/sections/exhibitions-section';
import { TVSection } from '@/components/sections/tv-section';
import { NewsSection } from '@/components/sections/news-section';
import { ContactSection } from '@/components/sections/contact-section';
import { ProductionLineSection } from '@/components/sections/production-line-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductionLineSection />
      <ProductsSection />
      <SolutionsSection />
      <ClientsSection />
      <CertificatesSection />
      <ExhibitionsSection />
      <TVSection />
      <NewsSection />
      <ContactSection />
    </>
  );
}
