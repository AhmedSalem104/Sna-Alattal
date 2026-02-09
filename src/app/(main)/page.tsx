import dynamic from 'next/dynamic';
import { HeroSection, AboutSection } from '@/components/sections';
import { SectionSkeleton } from '@/components/skeletons';

// Dynamic imports for below-the-fold sections
const ProductsSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.ProductsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const SolutionsSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.SolutionsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const ClientsSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.ClientsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const TeamSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.TeamSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const CertificatesSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.CertificatesSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const ExhibitionsSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.ExhibitionsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const TVSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.TVSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const NewsSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.NewsSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const CataloguesSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.CataloguesSection })),
  { loading: () => <SectionSkeleton />, ssr: true }
);

const ContactSection = dynamic(
  () => import('@/components/sections').then(mod => ({ default: mod.ContactSection })),
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
      {/* CataloguesSection hidden per request - keep code */}
      {/* <CataloguesSection /> */}
      <ContactSection />
    </>
  );
}
