import dynamic from 'next/dynamic';
import { Navbar, Footer } from '@/components/layout';

// Lazy load non-critical UI widgets
const ScrollToTop = dynamic(
  () => import('@/components/ui/scroll-to-top').then(m => ({ default: m.ScrollToTop }))
);
const FloatingContactWidget = dynamic(
  () => import('@/components/ui/floating-contact-widget').then(m => ({ default: m.FloatingContactWidget }))
);
const ScrollingGears = dynamic(
  () => import('@/components/decorative/ScrollingGears').then(m => ({ default: m.ScrollingGears }))
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="skip-to-main"
      >
        تخطى إلى المحتوى الرئيسي
      </a>
      <ScrollingGears />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative z-[1]">
        {children}
      </main>
      <Footer />
      <FloatingContactWidget />
      <ScrollToTop threshold={400} />
    </>
  );
}
