import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { SectionSkeleton } from '@/components/skeletons';

// Dynamic imports - direct file paths for real code splitting
const ProductsSection = dynamic(
  () => import('@/components/sections/products-section').then(mod => ({ default: mod.ProductsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const SolutionsSection = dynamic(
  () => import('@/components/sections/solutions-section').then(mod => ({ default: mod.SolutionsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const ClientsSection = dynamic(
  () => import('@/components/sections/clients-section').then(mod => ({ default: mod.ClientsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const TeamSection = dynamic(
  () => import('@/components/sections/team-section').then(mod => ({ default: mod.TeamSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const CertificatesSection = dynamic(
  () => import('@/components/sections/certificates-section').then(mod => ({ default: mod.CertificatesSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const ExhibitionsSection = dynamic(
  () => import('@/components/sections/exhibitions-section').then(mod => ({ default: mod.ExhibitionsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const TVSection = dynamic(
  () => import('@/components/sections/tv-section').then(mod => ({ default: mod.TVSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const NewsSection = dynamic(
  () => import('@/components/sections/news-section').then(mod => ({ default: mod.NewsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then(mod => ({ default: mod.ContactSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

export default function HomePage() {
  return (
    <>
      {/* Above the fold - Eager loaded */}
      <HeroSection />
      <AboutSection />

      {/* Below the fold - Dynamically imported */}
      <ProductsSection />
      <SolutionsSection />
      <ClientsSection />
      {/* TeamSection hidden per request - keep code */}
      {/* <TeamSection /> */}
      <CertificatesSection />
      <ExhibitionsSection />
      <TVSection />
      <NewsSection />
      <ContactSection />
    </>
  );
}
