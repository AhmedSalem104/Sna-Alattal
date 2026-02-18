import { Navbar, Footer } from '@/components/layout';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { FloatingContactWidget } from '@/components/ui/floating-contact-widget';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="skip-to-main"
      >
        تخطى إلى المحتوى الرئيسي
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />

      {/* Floating Contact Widget (KHS-inspired) */}
      <FloatingContactWidget />

      {/* Scroll to Top Button */}
      <ScrollToTop threshold={400} />
    </>
  );
}
