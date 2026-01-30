import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Reordering slides - making video slide first...');

  // Update video slide to order 1
  await prisma.slide.update({
    where: { id: 'slide-video-1' },
    data: { order: 0 } // Temporary
  });

  // Shift other slides
  await prisma.slide.update({
    where: { id: 'slide-main-1' },
    data: { order: 2 }
  });

  await prisma.slide.update({
    where: { id: 'slide-main-2' },
    data: { order: 3 }
  });

  await prisma.slide.update({
    where: { id: 'slide-main-3' },
    data: { order: 4 }
  });

  // Now set video to order 1
  await prisma.slide.update({
    where: { id: 'slide-video-1' },
    data: { order: 1 }
  });

  console.log('✅ Video slide is now first!');

  // Verify
  const slides = await prisma.slide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, titleAr: true, order: true }
  });

  console.log('\nNew slide order:');
  slides.forEach((s, i) => {
    console.log(`${i + 1}. ${s.titleAr} (order: ${s.order})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
