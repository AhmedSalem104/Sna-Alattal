import Image from 'next/image';

interface PageBackgroundProps {
  image: string;
  children: React.ReactNode;
}

export function PageBackground({ image, children }: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5" aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
