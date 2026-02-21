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
      <FloatingContactWidget />
      <ScrollToTop threshold={400} />
    </>
  );
}
