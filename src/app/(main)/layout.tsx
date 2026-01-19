import { Navbar, Footer } from '@/components/layout';
import { OnboardingExperience } from '@/components/onboarding';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OnboardingExperience />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
