import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await hash(process.env.SEED_ADMIN_PASSWORD || 'SNA@Attal2025#Admin', 12);

  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || 'admin@sna-alattal.com' },
    update: {},
    create: {
      name: process.env.SEED_ADMIN_NAME || 'مدير النظام',
      email: process.env.SEED_ADMIN_EMAIL || 'admin@sna-alattal.com',
      phone: '+201032221038',
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // ═══════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════
  const categoriesData = [
    { slug: 'filling-machines', nameAr: 'ماكينات التعبئة', nameEn: 'Filling Machines', nameTr: 'Dolum Makineleri', descriptionAr: 'ماكينات تعبئة السوائل بجميع أنواعها وأحجامها للصناعات المختلفة', descriptionEn: 'Liquid filling machines of all types and sizes for various industries', descriptionTr: 'Çeşitli endüstriler için her tür ve boyutta sıvı dolum makineleri', image: '/uploads/products/filling-machine.png', isActive: true, order: 1 },
    { slug: 'blow-molding-machines', nameAr: 'ماكينات نفخ البلاستيك PET', nameEn: 'PET Blow Molding Machines', nameTr: 'PET Şişirme Makineleri', descriptionAr: 'ماكينات نفخ زجاجات البلاستيك PET بسعات مختلفة من 600 إلى 16000 زجاجة في الساعة', descriptionEn: 'PET plastic bottle blow molding machines with capacities from 600 to 16,000 bottles per hour', descriptionTr: 'Saatte 600 ila 16.000 şişe kapasiteli PET plastik şişe şişirme makineleri', image: '/uploads/products/blow-4c-8000ph.png', isActive: true, order: 2 },
    { slug: 'labeling-machines', nameAr: 'ماكينات اللصق', nameEn: 'Labeling Machines', nameTr: 'Etiketleme Makineleri', descriptionAr: 'ماكينات لصق الملصقات على العبوات المستديرة والمربعة', descriptionEn: 'Label application machines for round and square containers', descriptionTr: 'Yuvarlak ve kare kaplar için etiket uygulama makineleri', image: '/uploads/products/labeling-machine.png', isActive: true, order: 3 },
    { slug: 'packaging-machines', nameAr: 'ماكينات التغليف', nameEn: 'Packaging Machines', nameTr: 'Paketleme Makineleri', descriptionAr: 'ماكينات تغليف المنتجات بأفلام شرنك وكرتون', descriptionEn: 'Product packaging machines with shrink wrap and carton', descriptionTr: 'Shrink film ve karton ile ürün paketleme makineleri', image: '/uploads/products/shrink-machine.png', isActive: true, order: 4 },
    { slug: 'conveyors', nameAr: 'السيور الناقلة', nameEn: 'Conveyors', nameTr: 'Konveyörler', descriptionAr: 'سيور ناقلة متعددة الأنواع لربط خطوط الإنتاج', descriptionEn: 'Various types of conveyors to connect production lines', descriptionTr: 'Üretim hatlarını birbirine bağlamak için çeşitli konveyörler', image: '/uploads/products/conveyor.png', isActive: true, order: 5 },
    { slug: 'auxiliary-machines', nameAr: 'ماكينات مساعدة', nameEn: 'Auxiliary Machines', nameTr: 'Yardımcı Makineler', descriptionAr: 'ماكينات مساعدة مثل الاستعدال والكرتنة', descriptionEn: 'Auxiliary machines like unscrambling and cartoning', descriptionTr: 'Düzenleme ve kartonlama gibi yardımcı makineler', image: '/uploads/products/straightening-machine.png', isActive: true, order: 6 },
  ];
  const categories = await Promise.all(
    categoriesData.map(({ slug, ...data }) =>
      prisma.category.upsert({ where: { slug }, update: data, create: { slug, ...data } })
    )
  );

  console.log('✅ Categories created:', categories.length);

  // ═══════════════════════════════════════════
  // PRODUCTS
  // ═══════════════════════════════════════════
  const products = await Promise.all([
    // Filling Machine
    prisma.product.upsert({
      where: { slug: 'automatic-liquid-filling-machine' },
      update: { nameAr: 'ماكينة تعبئة السوائل الأوتوماتيكية', nameEn: 'Automatic Liquid Filling Machine', nameTr: 'Otomatik Sıvı Dolum Makinesi', images: JSON.parse(JSON.stringify(['/uploads/products/filling-machine.png', '/uploads/products/home-product-1.jpg'])), categoryId: categories[0].id, isActive: true, isFeatured: true, order: 1 },
      create: {
        nameAr: 'ماكينة تعبئة السوائل الأوتوماتيكية',
        nameEn: 'Automatic Liquid Filling Machine',
        nameTr: 'Otomatik Sıvı Dolum Makinesi',
        slug: 'automatic-liquid-filling-machine',
        descriptionAr: 'ماكينة تعبئة سوائل أوتوماتيكية بالكامل مع نظام تحكم PLC متقدم. مناسبة لتعبئة المياه والعصائر والزيوت والمنظفات. تتميز بدقة عالية في التعبئة وسرعة إنتاج ممتازة.',
        descriptionEn: 'Fully automatic liquid filling machine with advanced PLC control system. Suitable for filling water, juices, oils, and detergents. Features high filling accuracy and excellent production speed.',
        descriptionTr: 'Gelişmiş PLC kontrol sistemli tam otomatik sıvı dolum makinesi. Su, meyve suları, yağlar ve deterjanlar için uygundur.',
        shortDescAr: 'تعبئة أوتوماتيكية عالية السرعة للسوائل',
        shortDescEn: 'High-speed automatic liquid filling',
        shortDescTr: 'Yüksek hızlı otomatik sıvı dolum',
        images: JSON.parse(JSON.stringify(['/uploads/products/filling-machine.png', '/uploads/products/home-product-1.jpg'])),
        categoryId: categories[0].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '1000-5000 bottles/hour', accuracy: '±0.5%', power: '3KW', weight: '500kg', voltage: '380V/50Hz' })),
        features: JSON.parse(JSON.stringify(['تحكم PLC سيمنز', 'شاشة تعمل باللمس 10 بوصة', 'تعديل حجم العبوات بسهولة', 'نظام منع التسرب'])),
        isActive: true,
        isFeatured: true,
        order: 1,
      },
    }),

    // Blow Molding 1C 20L
    prisma.product.upsert({
      where: { slug: 'pet-blow-molding-1c-20l' },
      update: { nameAr: 'ماكينة نفخ بلاستيك PET - 1 تجويف 20 لتر', nameEn: 'PET Blow Molding Machine - 1 Cavity 20L SE121LA', nameTr: 'PET Şişirme Makinesi - 1 Kavite 20L SE121LA', images: JSON.parse(JSON.stringify(['/uploads/products/blow-1c-20l.png', '/uploads/products/blow-1c-20l-photo.jpg'])), categoryId: categories[1].id, isActive: true, isFeatured: true, order: 2 },
      create: {
        nameAr: 'ماكينة نفخ بلاستيك PET - 1 تجويف 20 لتر',
        nameEn: 'PET Blow Molding Machine - 1 Cavity 20L SE121LA',
        nameTr: 'PET Şişirme Makinesi - 1 Kavite 20L SE121LA',
        slug: 'pet-blow-molding-1c-20l',
        descriptionAr: 'ماكينة نفخ زجاجات PET بتجويف واحد لإنتاج عبوات حتى 20 لتر بسعة 600 زجاجة في الساعة. مثالية لعبوات المياه والزيوت الكبيرة.',
        descriptionEn: '1-cavity PET bottle blow molding machine for producing containers up to 20L at 600 bottles/hour. Ideal for large water and oil containers.',
        descriptionTr: '1 kaviteli PET şişe şişirme makinesi, saatte 600 şişe kapasitesiyle 20L\'ye kadar kap üretimi.',
        shortDescAr: 'نفخ عبوات PET حتى 20 لتر',
        shortDescEn: 'PET blow molding up to 20L',
        shortDescTr: '20L\'ye kadar PET şişirme',
        images: JSON.parse(JSON.stringify(['/uploads/products/blow-1c-20l.png', '/uploads/products/blow-1c-20l-photo.jpg'])),
        categoryId: categories[1].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '600 bottles/hour', cavities: '1', maxVolume: '20L', model: 'SE121LA' })),
        features: JSON.parse(JSON.stringify(['تجويف واحد', 'حتى 20 لتر', '600 زجاجة/ساعة', 'توفير الطاقة'])),
        isActive: true,
        isFeatured: true,
        order: 2,
      },
    }),

    // Blow Molding 2C 11L
    prisma.product.upsert({
      where: { slug: 'pet-blow-molding-2c-11l' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/blow-2c-11l.png', '/uploads/products/blow-2c-11l-photo.jpg'])), categoryId: categories[1].id, isActive: true, order: 3 },
      create: {
        nameAr: 'ماكينة نفخ بلاستيك PET - 2 تجويف 11 لتر',
        nameEn: 'PET Blow Molding Machine - 2 Cavity 11L SE221LA',
        nameTr: 'PET Şişirme Makinesi - 2 Kavite 11L SE221LA',
        slug: 'pet-blow-molding-2c-11l',
        descriptionAr: 'ماكينة نفخ زجاجات PET بتجويفين لإنتاج عبوات حتى 11 لتر بسعة 2400 زجاجة في الساعة.',
        descriptionEn: '2-cavity PET bottle blow molding machine for containers up to 11L at 2,400 bottles/hour.',
        descriptionTr: '2 kaviteli PET şişe şişirme makinesi, saatte 2.400 şişe kapasitesi, 11L\'ye kadar.',
        shortDescAr: 'نفخ عبوات PET حتى 11 لتر',
        shortDescEn: 'PET blow molding up to 11L',
        shortDescTr: '11L\'ye kadar PET şişirme',
        images: JSON.parse(JSON.stringify(['/uploads/products/blow-2c-11l.png', '/uploads/products/blow-2c-11l-photo.jpg'])),
        categoryId: categories[1].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '2400 bottles/hour', cavities: '2', maxVolume: '11L', model: 'SE221LA' })),
        features: JSON.parse(JSON.stringify(['تجويفان', 'حتى 11 لتر', '2400 زجاجة/ساعة', 'كفاءة عالية'])),
        isActive: true,
        isFeatured: true,
        order: 3,
      },
    }),

    // Blow Molding 2C 4000PH
    prisma.product.upsert({
      where: { slug: 'pet-blow-molding-2c-4000ph' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/blow-2c-4000ph.png', '/uploads/products/blow-2c-4000ph-photo.jpg'])), categoryId: categories[1].id, isActive: true, order: 4 },
      create: {
        nameAr: 'ماكينة نفخ بلاستيك PET - 2 تجويف 4000 زجاجة/ساعة',
        nameEn: 'PET Blow Molding Machine - 2 Cavity 4000PH SE221A',
        nameTr: 'PET Şişirme Makinesi - 2 Kavite 4000PH SE221A',
        slug: 'pet-blow-molding-2c-4000ph',
        descriptionAr: 'ماكينة نفخ زجاجات PET بتجويفين بسعة إنتاجية 4000 زجاجة في الساعة. مثالية للإنتاج المتوسط.',
        descriptionEn: '2-cavity PET blow molding machine with 4,000 bottles/hour capacity. Ideal for medium production.',
        descriptionTr: 'Saatte 4.000 şişe kapasiteli 2 kaviteli PET şişirme makinesi.',
        shortDescAr: 'إنتاج متوسط 4000 زجاجة/ساعة',
        shortDescEn: 'Medium production 4000 bottles/hour',
        shortDescTr: 'Orta üretim 4000 şişe/saat',
        images: JSON.parse(JSON.stringify(['/uploads/products/blow-2c-4000ph.png', '/uploads/products/blow-2c-4000ph-photo.jpg'])),
        categoryId: categories[1].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '4000 bottles/hour', cavities: '2', model: 'SE221A' })),
        features: JSON.parse(JSON.stringify(['تجويفان', '4000 زجاجة/ساعة', 'موفرة للطاقة', 'صيانة سهلة'])),
        isActive: true,
        isFeatured: false,
        order: 4,
      },
    }),

    // Blow Molding 4C 8000PH
    prisma.product.upsert({
      where: { slug: 'pet-blow-molding-4c-8000ph' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/blow-4c-8000ph.png', '/uploads/products/blow-4c-8000ph-photo.jpg'])), categoryId: categories[1].id, isActive: true, order: 5 },
      create: {
        nameAr: 'ماكينة نفخ بلاستيك PET - 4 تجاويف 8000 زجاجة/ساعة',
        nameEn: 'PET Blow Molding Machine - 4 Cavity 8000PH SE421A',
        nameTr: 'PET Şişirme Makinesi - 4 Kavite 8000PH SE421A',
        slug: 'pet-blow-molding-4c-8000ph',
        descriptionAr: 'ماكينة نفخ زجاجات PET بأربع تجاويف بسعة إنتاجية 8000 زجاجة في الساعة. مثالية للإنتاج الكبير.',
        descriptionEn: '4-cavity PET blow molding machine with 8,000 bottles/hour capacity. Ideal for large production.',
        descriptionTr: 'Saatte 8.000 şişe kapasiteli 4 kaviteli PET şişirme makinesi. Büyük üretim için ideal.',
        shortDescAr: 'إنتاج كبير 8000 زجاجة/ساعة',
        shortDescEn: 'Large production 8000 bottles/hour',
        shortDescTr: 'Büyük üretim 8000 şişe/saat',
        images: JSON.parse(JSON.stringify(['/uploads/products/blow-4c-8000ph.png', '/uploads/products/blow-4c-8000ph-photo.jpg'])),
        categoryId: categories[1].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '8000 bottles/hour', cavities: '4', model: 'SE421A' })),
        features: JSON.parse(JSON.stringify(['4 تجاويف', '8000 زجاجة/ساعة', 'إنتاجية عالية', 'تقنية متقدمة'])),
        isActive: true,
        isFeatured: true,
        order: 5,
      },
    }),

    // Blow Molding 8C 16000PH
    prisma.product.upsert({
      where: { slug: 'pet-blow-molding-8c-16000ph' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/blow-8c-16000ph.png', '/uploads/products/blow-8c-16000ph-photo.jpg'])), categoryId: categories[1].id, isActive: true, order: 6 },
      create: {
        nameAr: 'ماكينة نفخ بلاستيك PET - 8 تجاويف 16000 زجاجة/ساعة',
        nameEn: 'PET Blow Molding Machine - 8 Cavity 16000PH SE821A',
        nameTr: 'PET Şişirme Makinesi - 8 Kavite 16000PH SE821A',
        slug: 'pet-blow-molding-8c-16000ph',
        descriptionAr: 'ماكينة نفخ زجاجات PET بثمان تجاويف بسعة إنتاجية 16000 زجاجة في الساعة. الأعلى إنتاجية في مجموعتنا.',
        descriptionEn: '8-cavity PET blow molding machine with 16,000 bottles/hour capacity. Highest productivity in our range.',
        descriptionTr: 'Saatte 16.000 şişe kapasiteli 8 kaviteli PET şişirme makinesi. Ürün yelpazemizde en yüksek verimlilik.',
        shortDescAr: 'أعلى إنتاجية 16000 زجاجة/ساعة',
        shortDescEn: 'Highest capacity 16000 bottles/hour',
        shortDescTr: 'En yüksek kapasite 16000 şişe/saat',
        images: JSON.parse(JSON.stringify(['/uploads/products/blow-8c-16000ph.png', '/uploads/products/blow-8c-16000ph-photo.jpg'])),
        categoryId: categories[1].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '16000 bottles/hour', cavities: '8', model: 'SE821A' })),
        features: JSON.parse(JSON.stringify(['8 تجاويف', '16000 زجاجة/ساعة', 'أعلى إنتاجية', 'تصميم صناعي متقدم'])),
        isActive: true,
        isFeatured: true,
        order: 6,
      },
    }),

    // Labeling Machine
    prisma.product.upsert({
      where: { slug: 'automatic-labeling-machine' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/labeling-machine.png', '/uploads/renders/label-rollers.jpg'])), categoryId: categories[2].id, isActive: true, order: 7 },
      create: {
        nameAr: 'ماكينة لصق أوتوماتيكية',
        nameEn: 'Automatic Labeling Machine',
        nameTr: 'Otomatik Etiketleme Makinesi',
        slug: 'automatic-labeling-machine',
        descriptionAr: 'ماكينة لصق ليبل أوتوماتيكية للعبوات المستديرة والمربعة والبيضاوية. دقة لصق عالية مع سرعة إنتاج ممتازة.',
        descriptionEn: 'Automatic labeling machine for round, square, and oval containers. High labeling accuracy with excellent production speed.',
        descriptionTr: 'Yuvarlak, kare ve oval kaplar için otomatik etiketleme makinesi. Mükemmel üretim hızı ile yüksek etiketleme doğruluğu.',
        shortDescAr: 'لصق دقيق ومتعدد الأشكال',
        shortDescEn: 'Precise multi-shape labeling',
        shortDescTr: 'Hassas çok şekilli etiketleme',
        images: JSON.parse(JSON.stringify(['/uploads/products/labeling-machine.png', '/uploads/renders/label-rollers.jpg'])),
        categoryId: categories[2].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '2000-6000 bottles/hour', accuracy: '±1mm', labelWidth: '20-150mm', power: '1.5KW' })),
        features: JSON.parse(JSON.stringify(['تعدد أشكال العبوات', 'دقة عالية ±1مم', 'سهولة الإعداد', 'نظام كشف الفراغات'])),
        isActive: true,
        isFeatured: true,
        order: 7,
      },
    }),

    // Shrink Wrapping Machine
    prisma.product.upsert({
      where: { slug: 'shrink-wrapping-machine' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/shrink-machine.png', '/uploads/products/shrink-1.jpg', '/uploads/products/shrink-2.jpg'])), categoryId: categories[3].id, isActive: true, order: 8 },
      create: {
        nameAr: 'ماكينة التغليف بالشرنك',
        nameEn: 'Shrink Wrapping Machine',
        nameTr: 'Shrink Ambalaj Makinesi',
        slug: 'shrink-wrapping-machine',
        descriptionAr: 'ماكينة تغليف بأفلام الشرنك للعبوات الفردية والمجموعات. مناسبة للمشروبات والأغذية.',
        descriptionEn: 'Shrink wrapping machine for individual and group packaging. Suitable for beverages and food products.',
        descriptionTr: 'Bireysel ve grup paketleme için shrink ambalaj makinesi.',
        shortDescAr: 'تغليف احترافي بالشرنك',
        shortDescEn: 'Professional shrink wrapping',
        shortDescTr: 'Profesyonel shrink ambalaj',
        images: JSON.parse(JSON.stringify(['/uploads/products/shrink-machine.png', '/uploads/products/shrink-1.jpg', '/uploads/products/shrink-2.jpg'])),
        categoryId: categories[3].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '15-30 packs/min', packSize: '2x3, 3x4, 4x6', power: '8KW' })),
        features: JSON.parse(JSON.stringify(['تغليف فردي ومجموعات', 'تحكم درجة الحرارة', 'سهولة الضبط'])),
        isActive: true,
        isFeatured: true,
        order: 8,
      },
    }),

    // Carton Machine
    prisma.product.upsert({
      where: { slug: 'carton-packing-machine' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/carton-machine.png', '/uploads/products/carton-1.jpg', '/uploads/products/carton-2.jpg'])), categoryId: categories[3].id, isActive: true, order: 9 },
      create: {
        nameAr: 'ماكينة الكرتنة الأوتوماتيكية',
        nameEn: 'Automatic Carton Packing Machine',
        nameTr: 'Otomatik Karton Paketleme Makinesi',
        slug: 'carton-packing-machine',
        descriptionAr: 'ماكينة كرتنة أوتوماتيكية لتعبئة العبوات في صناديق كرتون. مناسبة لجميع أنواع العبوات.',
        descriptionEn: 'Automatic carton packing machine for placing bottles into carton boxes. Suitable for all container types.',
        descriptionTr: 'Şişeleri karton kutulara yerleştirmek için otomatik karton paketleme makinesi.',
        shortDescAr: 'كرتنة أوتوماتيكية سريعة',
        shortDescEn: 'Fast automatic cartoning',
        shortDescTr: 'Hızlı otomatik kartonlama',
        images: JSON.parse(JSON.stringify(['/uploads/products/carton-machine.png', '/uploads/products/carton-1.jpg', '/uploads/products/carton-2.jpg'])),
        categoryId: categories[3].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '10-25 cartons/min', power: '3KW' })),
        features: JSON.parse(JSON.stringify(['كرتنة أوتوماتيكية', 'تعدد أحجام الكراتين', 'سرعة عالية'])),
        isActive: true,
        isFeatured: false,
        order: 9,
      },
    }),

    // Conveyor
    prisma.product.upsert({
      where: { slug: 'conveyor-systems' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/conveyor.png'])), categoryId: categories[4].id, isActive: true, order: 10 },
      create: {
        nameAr: 'السيور الناقلة',
        nameEn: 'Conveyor Systems',
        nameTr: 'Konveyör Sistemleri',
        slug: 'conveyor-systems',
        descriptionAr: 'سيور ناقلة متعددة الأنواع لنقل العبوات بين مراحل الإنتاج المختلفة. تصميم من الستانلس ستيل.',
        descriptionEn: 'Various conveyor systems for transporting containers between production stages. Stainless steel design.',
        descriptionTr: 'Üretim aşamaları arasında kapları taşımak için çeşitli konveyör sistemleri. Paslanmaz çelik tasarım.',
        shortDescAr: 'سيور نقل صناعية',
        shortDescEn: 'Industrial conveyor systems',
        shortDescTr: 'Endüstriyel konveyör sistemleri',
        images: JSON.parse(JSON.stringify(['/uploads/products/conveyor.png'])),
        categoryId: categories[4].id,
        specifications: JSON.parse(JSON.stringify({ material: 'Stainless Steel 304', speed: 'Variable' })),
        features: JSON.parse(JSON.stringify(['ستانلس ستيل 304', 'سرعة متغيرة', 'تصميم حسب الطلب'])),
        isActive: true,
        isFeatured: false,
        order: 10,
      },
    }),

    // Straightening/Unscrambler Machine
    prisma.product.upsert({
      where: { slug: 'bottle-unscrambler' },
      update: { images: JSON.parse(JSON.stringify(['/uploads/products/straightening-machine.png', '/uploads/renders/unscrambler-render.jpg'])), categoryId: categories[5].id, isActive: true, order: 11 },
      create: {
        nameAr: 'ماكينة الاستعدال (فرز الزجاجات)',
        nameEn: 'Bottle Unscrambler Machine',
        nameTr: 'Şişe Düzenleme Makinesi',
        slug: 'bottle-unscrambler',
        descriptionAr: 'ماكينة استعدال وترتيب الزجاجات أوتوماتيكياً لتغذية خطوط الإنتاج بشكل منتظم.',
        descriptionEn: 'Automatic bottle unscrambling and sorting machine for consistent production line feeding.',
        descriptionTr: 'Tutarlı üretim hattı beslemesi için otomatik şişe düzenleme ve sıralama makinesi.',
        shortDescAr: 'فرز وترتيب أوتوماتيكي',
        shortDescEn: 'Automatic sorting & unscrambling',
        shortDescTr: 'Otomatik sıralama ve düzenleme',
        images: JSON.parse(JSON.stringify(['/uploads/products/straightening-machine.png', '/uploads/renders/unscrambler-render.jpg'])),
        categoryId: categories[5].id,
        specifications: JSON.parse(JSON.stringify({ capacity: '2000-8000 bottles/hour', power: '2KW' })),
        features: JSON.parse(JSON.stringify(['ترتيب أوتوماتيكي', 'تعدد أحجام الزجاجات', 'تصميم مدمج'])),
        isActive: true,
        isFeatured: false,
        order: 11,
      },
    }),
  ]);

  console.log('✅ Products created:', products.length);

  // ═══════════════════════════════════════════
  // SOLUTIONS
  // ═══════════════════════════════════════════
  const solutionsData = [
    { slug: 'food-beverages', titleAr: 'الأغذية والمشروبات', titleEn: 'Food & Beverages', titleTr: 'Gıda ve İçecek', descriptionAr: 'حلول متكاملة لصناعة الأغذية والمشروبات تشمل خطوط تعبئة العصائر والمياه والمشروبات الغازية والزيوت', descriptionEn: 'Complete solutions for food and beverage industry including juice, water, soft drink, and oil filling lines', descriptionTr: 'Meyve suyu, su, meşrubat ve yağ dolum hatları dahil gıda ve içecek sektörü için komple çözümler', shortDescAr: 'حلول صناعة الأغذية والمشروبات', shortDescEn: 'Food & beverage industry solutions', shortDescTr: 'Gıda ve içecek sektörü çözümleri', icon: 'utensils', image: '/uploads/solutions/juice-industry.jpg', isActive: true, isFeatured: true, order: 1 },
    { slug: 'water-industry', titleAr: 'صناعة المياه', titleEn: 'Water Industry', titleTr: 'Su Endüstrisi', descriptionAr: 'خطوط إنتاج متكاملة لتعبئة المياه المعدنية ومياه الشرب بجميع الأحجام', descriptionEn: 'Complete production lines for mineral and drinking water bottling in all sizes', descriptionTr: 'Tüm boyutlarda maden suyu ve içme suyu şişeleme için komple üretim hatları', shortDescAr: 'حلول تعبئة المياه', shortDescEn: 'Water bottling solutions', shortDescTr: 'Su şişeleme çözümleri', icon: 'droplets', image: '/uploads/solutions/water-industry.jpg', isActive: true, isFeatured: true, order: 2 },
    { slug: 'oil-industry', titleAr: 'صناعة الزيوت', titleEn: 'Oil Industry', titleTr: 'Yağ Endüstrisi', descriptionAr: 'حلول متكاملة لتعبئة الزيوت الطبيعية وزيوت الطعام بأحجام مختلفة', descriptionEn: 'Complete solutions for filling natural oils and cooking oils in various sizes', descriptionTr: 'Çeşitli boyutlarda doğal yağlar ve yemeklik yağlar dolumu için komple çözümler', shortDescAr: 'حلول تعبئة الزيوت', shortDescEn: 'Oil filling solutions', shortDescTr: 'Yağ dolum çözümleri', icon: 'flask', image: '/uploads/solutions/oil-industry.jpg', isActive: true, isFeatured: true, order: 3 },
    { slug: 'pharmaceuticals', titleAr: 'الأدوية', titleEn: 'Pharmaceuticals', titleTr: 'İlaç', descriptionAr: 'حلول متكاملة لصناعة الأدوية مع معايير GMP العالمية', descriptionEn: 'Complete solutions for pharmaceutical industry with global GMP standards', descriptionTr: 'Küresel GMP standartlarıyla ilaç sektörü için komple çözümler', shortDescAr: 'حلول صناعة الأدوية', shortDescEn: 'Pharmaceutical solutions', shortDescTr: 'İlaç sektörü çözümleri', icon: 'pill', image: '/uploads/solutions/pharma-industry.jpg', isActive: true, isFeatured: true, order: 4 },
  ];
  const solutions = await Promise.all(
    solutionsData.map(({ slug, ...data }) =>
      prisma.solution.upsert({ where: { slug }, update: data, create: { slug, ...data } })
    )
  );

  console.log('✅ Solutions created:', solutions.length);

  // ═══════════════════════════════════════════
  // CLIENTS (Real clients from media files)
  // ═══════════════════════════════════════════
  const clientsData = [
    { id: 'client-aqua-purity', nameAr: 'أكوا بيرتي', nameEn: 'Aqua Purity', nameTr: 'Aqua Purity', logo: '/uploads/clients/aqua-purity.jpg', order: 1 },
    { id: 'client-aqua-delta', nameAr: 'أكوا دلتا', nameEn: 'Aqua Delta', nameTr: 'Aqua Delta', logo: '/uploads/clients/aqua-delta.jpg', order: 2 },
    { id: 'client-aman-siwa', nameAr: 'أمان سيوة', nameEn: 'Aman Siwa', nameTr: 'Aman Siwa', logo: '/uploads/clients/aman-siwa.jpg', order: 3 },
    { id: 'client-al-rawasi', nameAr: 'الرواسي', nameEn: 'Al Rawasi', nameTr: 'Al Rawasi', logo: '/uploads/clients/al-rawasi.jpg', order: 4 },
    { id: 'client-al-fares', nameAr: 'الفارس العربي', nameEn: 'Al Fares Al Arabi', nameTr: 'Al Fares', logo: '/uploads/clients/al-fares.jpg', order: 5 },
    { id: 'client-al-krom', nameAr: 'الكروم', nameEn: 'Al Krom', nameTr: 'Al Krom', logo: '/uploads/clients/al-krom.jpg', order: 6 },
    { id: 'client-al-mottaheda', nameAr: 'المتحدة', nameEn: 'Al Mottaheda', nameTr: 'Al Mottaheda', logo: '/uploads/clients/al-mottaheda.jpg', order: 7 },
    { id: 'client-baghdadna', nameAr: 'بغدادنا', nameEn: 'Baghdadna', nameTr: 'Baghdadna', logo: '/uploads/clients/baghdadna.jpg', order: 8 },
    { id: 'client-purity', nameAr: 'بيرتي', nameEn: 'Purity', nameTr: 'Purity', logo: '/uploads/clients/purity.jpg', order: 9 },
    { id: 'client-thuraya', nameAr: 'ثرايا', nameEn: 'Thuraya', nameTr: 'Thuraya', logo: '/uploads/clients/thuraya.jpg', order: 10 },
    { id: 'client-delta', nameAr: 'دلتا', nameEn: 'Delta', nameTr: 'Delta', logo: '/uploads/clients/delta.jpg', order: 11 },
    { id: 'client-rekaz', nameAr: 'ركاز', nameEn: 'Rekaz', nameTr: 'Rekaz', logo: '/uploads/clients/rekaz.jpg', order: 12 },
    { id: 'client-rawan', nameAr: 'روان', nameEn: 'Rawan', nameTr: 'Rawan', logo: '/uploads/clients/rawan.jpg', order: 13 },
    { id: 'client-salsabila', nameAr: 'سلسبيلا', nameEn: 'Salsabila', nameTr: 'Salsabila', logo: '/uploads/clients/salsabila.jpg', order: 14 },
    { id: 'client-souriana', nameAr: 'سوريانا', nameEn: 'Souriana', nameTr: 'Souriana', logo: '/uploads/clients/souriana.jpg', order: 15 },
    { id: 'client-sinalco', nameAr: 'سينالكو', nameEn: 'Sinalco', nameTr: 'Sinalco', logo: '/uploads/clients/sinalco.jpg', order: 16 },
    { id: 'client-siwa', nameAr: 'سيوة', nameEn: 'Siwa', nameTr: 'Siwa', logo: '/uploads/clients/siwa.jpg', order: 17 },
    { id: 'client-al-arz', nameAr: 'شركة الأرز', nameEn: 'Al Arz Company', nameTr: 'Al Arz', logo: '/uploads/clients/al-arz.jpg', order: 18 },
    { id: 'client-al-reem', nameAr: 'شركة الريم', nameEn: 'Al Reem Company', nameTr: 'Al Reem', logo: '/uploads/clients/al-reem.jpg', order: 19 },
    { id: 'client-nahl', nameAr: 'شركة نهل', nameEn: 'Nahl Company', nameTr: 'Nahl', logo: '/uploads/clients/nahl.jpg', order: 20 },
    { id: 'client-safi', nameAr: 'صافي', nameEn: 'Safi', nameTr: 'Safi', logo: '/uploads/clients/safi.jpg', order: 21 },
    { id: 'client-saba', nameAr: 'عصير صبا', nameEn: 'Saba Juice', nameTr: 'Saba Juice', logo: '/uploads/clients/saba-juice.jpg', order: 22 },
    { id: 'client-vanda', nameAr: 'فاندا', nameEn: 'Vanda', nameTr: 'Vanda', logo: '/uploads/clients/vanda.jpg', order: 23 },
    { id: 'client-lavida', nameAr: 'لافيدا', nameEn: 'Lavida', nameTr: 'Lavida', logo: '/uploads/clients/lavida.jpg', order: 24 },
    { id: 'client-al-anfal', nameAr: 'مياه الأنفال', nameEn: 'Al Anfal Water', nameTr: 'Al Anfal Su', logo: '/uploads/clients/al-anfal.jpg', order: 25 },
    { id: 'client-nab3-rayan', nameAr: 'نبع الريان', nameEn: 'Nab3 Al Rayan', nameTr: 'Nab3 Al Rayan', logo: '/uploads/clients/nab3-al-rayan.jpg', order: 26 },
    { id: 'client-hydro', nameAr: 'هيدرو', nameEn: 'Hydro', nameTr: 'Hydro', logo: '/uploads/clients/hydro.jpg', order: 27 },
    { id: 'client-well-plast', nameAr: 'ويل بلاست', nameEn: 'Well Plast', nameTr: 'Well Plast', logo: '/uploads/clients/well-plast.jpg', order: 28 },
    { id: 'client-pepsi', nameAr: 'بيبسي', nameEn: 'Pepsi', nameTr: 'Pepsi', logo: '/uploads/clients/pepsi.jpg', order: 29 },
  ];

  const clients = await Promise.all(
    clientsData.map((c) =>
      prisma.client.upsert({
        where: { id: c.id },
        update: { nameAr: c.nameAr, nameEn: c.nameEn, nameTr: c.nameTr, logo: c.logo, isActive: true, isFeatured: c.order <= 12, order: c.order },
        create: { id: c.id, nameAr: c.nameAr, nameEn: c.nameEn, nameTr: c.nameTr, logo: c.logo, isActive: true, isFeatured: c.order <= 12, order: c.order },
      })
    )
  );

  console.log('✅ Clients created:', clients.length);

  // ═══════════════════════════════════════════
  // NEWS
  // ═══════════════════════════════════════════
  const news = await Promise.all([
    prisma.news.upsert({
      where: { slug: 'plastic-bottles-single-use' },
      update: {},
      create: {
        titleAr: 'استخدام زجاجات البلاستيك مرة واحدة فقط',
        titleEn: 'Single-Use Plastic Bottles: What You Need to Know',
        titleTr: 'Tek Kullanımlık Plastik Şişeler: Bilmeniz Gerekenler',
        slug: 'plastic-bottles-single-use',
        contentAr: 'تعتبر زجاجات البلاستيك من أكثر المنتجات استخداماً في حياتنا اليومية. ولكن هل تعلم أن استخدام زجاجات البلاستيك مرة واحدة فقط هو الطريقة الأمثل للحفاظ على صحتك وسلامة المنتج؟ في هذا المقال نستعرض أهم الأسباب التي تجعل الاستخدام الواحد ضرورياً.',
        contentEn: 'Plastic bottles are among the most widely used products in our daily lives. But did you know that using plastic bottles only once is the optimal way to maintain your health and product safety? In this article, we review the key reasons why single use is necessary.',
        contentTr: 'Plastik şişeler günlük yaşamımızda en çok kullanılan ürünler arasındadır. Ancak plastik şişeleri yalnızca bir kez kullanmanın sağlığınızı ve ürün güvenliğini korumanın en iyi yolu olduğunu biliyor muydunuz?',
        excerptAr: 'لماذا يجب استخدام زجاجات البلاستيك مرة واحدة فقط؟',
        excerptEn: 'Why should plastic bottles be used only once?',
        excerptTr: 'Plastik şişeler neden sadece bir kez kullanılmalı?',
        image: '/uploads/news/plastic-bottles-usage.jpg',
        author: 'فريق المحتوى',
        publishedAt: new Date('2024-03-15'),
        isActive: true,
        isFeatured: true,
        tags: JSON.parse(JSON.stringify(['بلاستيك', 'صحة', 'بيئة'])),
      },
    }),
    prisma.news.upsert({
      where: { slug: 'plastic-waste-danger-opportunity' },
      update: {},
      create: {
        titleAr: 'النفايات البلاستيكية خطر متزايد، وفرصة ضائعة',
        titleEn: 'Plastic Waste: A Growing Danger and a Missed Opportunity',
        titleTr: 'Plastik Atık: Artan Tehlike ve Kaçırılan Fırsat',
        slug: 'plastic-waste-danger-opportunity',
        contentAr: 'تشكل النفايات البلاستيكية تحدياً بيئياً كبيراً في العالم. ولكن مع تقنيات إعادة التدوير الحديثة، يمكن تحويل هذا التحدي إلى فرصة اقتصادية. نستعرض في هذا المقال كيف يمكن للصناعة أن تساهم في حل هذه المشكلة.',
        contentEn: 'Plastic waste poses a major environmental challenge worldwide. But with modern recycling technologies, this challenge can be turned into an economic opportunity.',
        contentTr: 'Plastik atık dünya çapında büyük bir çevresel zorluk oluşturuyor. Ancak modern geri dönüşüm teknolojileriyle bu zorluk ekonomik bir fırsata dönüştürülebilir.',
        excerptAr: 'كيف يمكن تحويل أزمة البلاستيك إلى فرصة اقتصادية',
        excerptEn: 'How the plastic crisis can become an economic opportunity',
        excerptTr: 'Plastik krizi nasıl ekonomik fırsata dönüştürülebilir',
        image: '/uploads/news/plastic-waste.jpg',
        author: 'فريق المحتوى',
        publishedAt: new Date('2024-02-20'),
        isActive: true,
        isFeatured: false,
        tags: JSON.parse(JSON.stringify(['بيئة', 'إعادة تدوير', 'بلاستيك'])),
      },
    }),
    prisma.news.upsert({
      where: { slug: 'what-is-pet-plastic' },
      update: {},
      create: {
        titleAr: 'ما هو بلاستيك PET المستخدم في العديد من الصناعات',
        titleEn: 'What is PET Plastic Used in Many Industries?',
        titleTr: 'Birçok Endüstride Kullanılan PET Plastik Nedir?',
        slug: 'what-is-pet-plastic',
        contentAr: 'بلاستيك PET (البولي إيثيلين تيريفثاليت) هو أحد أكثر أنواع البلاستيك استخداماً في العالم. يتميز بخفة الوزن والشفافية والقوة، مما يجعله مثالياً لصناعة زجاجات المياه والمشروبات.',
        contentEn: 'PET plastic (Polyethylene Terephthalate) is one of the most widely used plastics in the world. It is lightweight, transparent, and strong, making it ideal for water and beverage bottles.',
        contentTr: 'PET plastik (Polietilen Tereftalat) dünyada en yaygın kullanılan plastiklerden biridir. Hafif, şeffaf ve güçlüdür.',
        excerptAr: 'تعرف على بلاستيك PET وخصائصه واستخداماته',
        excerptEn: 'Learn about PET plastic, its properties and uses',
        excerptTr: 'PET plastik, özellikleri ve kullanımları hakkında bilgi edinin',
        image: '/uploads/news/pet-plastic.jpg',
        author: 'فريق المحتوى',
        publishedAt: new Date('2024-04-10'),
        isActive: true,
        isFeatured: true,
        tags: JSON.parse(JSON.stringify(['PET', 'بلاستيك', 'صناعة'])),
      },
    }),
    prisma.news.upsert({
      where: { slug: 'cop27-plastic-usage' },
      update: {},
      create: {
        titleAr: 'مؤتمر المناخ COP27 يسلط الضوء على الاستخدام الأمثل للبلاستيك',
        titleEn: 'COP27 Climate Conference Highlights Optimal Plastic Usage',
        titleTr: 'COP27 İklim Konferansı Optimal Plastik Kullanımını Vurguluyor',
        slug: 'cop27-plastic-usage',
        contentAr: 'سلط مؤتمر المناخ COP27 الذي أقيم في شرم الشيخ الضوء على أهمية الاستخدام الأمثل للبلاستيك في الصناعة. وناقش المشاركون سبل تقليل الأثر البيئي مع الحفاظ على كفاءة الإنتاج.',
        contentEn: 'The COP27 climate conference held in Sharm El-Sheikh highlighted the importance of optimal plastic usage in industry.',
        contentTr: 'Şarm el-Şeyh\'te düzenlenen COP27 iklim konferansı, sanayide optimal plastik kullanımının önemini vurguladı.',
        excerptAr: 'ما دور الصناعة في مواجهة تحديات المناخ',
        excerptEn: 'What role does industry play in climate challenges',
        excerptTr: 'İklim zorluklarında sanayinin rolü nedir',
        image: '/uploads/news/cop27-plastic.jpg',
        author: 'فريق المحتوى',
        publishedAt: new Date('2024-01-25'),
        isActive: true,
        isFeatured: false,
        tags: JSON.parse(JSON.stringify(['مناخ', 'بيئة', 'COP27'])),
      },
    }),
    prisma.news.upsert({
      where: { slug: 'innovation-economy-industry' },
      update: {},
      create: {
        titleAr: 'تعزيز الاقتصاد الابتكاري داخل المؤسسات والشركات',
        titleEn: 'Promoting Innovation Economy Within Organizations',
        titleTr: 'Kuruluşlarda İnovasyon Ekonomisini Teşvik Etme',
        slug: 'innovation-economy-industry',
        contentAr: 'يعد الابتكار عاملاً أساسياً في تطوير الصناعة وتحقيق النمو المستدام. في هذا المقال نناقش كيف يمكن للمؤسسات الصناعية تبني ثقافة الابتكار.',
        contentEn: 'Innovation is a key factor in industry development and achieving sustainable growth. In this article, we discuss how industrial organizations can adopt an innovation culture.',
        contentTr: 'İnovasyon, endüstri gelişimi ve sürdürülebilir büyümenin temel faktörüdür.',
        excerptAr: 'كيف تعزز الابتكار في المؤسسات الصناعية',
        excerptEn: 'How to promote innovation in industrial organizations',
        excerptTr: 'Endüstriyel kuruluşlarda inovasyonu nasıl teşvik edersiniz',
        image: '/uploads/news/innovation-economy.jpg',
        author: 'فريق المحتوى',
        publishedAt: new Date('2024-05-01'),
        isActive: true,
        isFeatured: false,
        tags: JSON.parse(JSON.stringify(['ابتكار', 'صناعة', 'تطوير'])),
      },
    }),
  ]);

  console.log('✅ News created:', news.length);

  // ═══════════════════════════════════════════
  // EXHIBITIONS
  // ═══════════════════════════════════════════
  const exhibitions = await Promise.all([
    prisma.exhibition.upsert({
      where: { id: 'exhibition-gulfood-2025' },
      update: {},
      create: {
        id: 'exhibition-gulfood-2025',
        nameAr: 'معرض جلفود 2025',
        nameEn: 'Gulfood Exhibition 2025',
        nameTr: 'Gulfood Fuarı 2025',
        descriptionAr: 'أكبر معرض سنوي للأغذية والمشروبات في الشرق الأوسط',
        descriptionEn: 'The largest annual food and beverage exhibition in the Middle East',
        descriptionTr: 'Orta Doğu\'nun en büyük yıllık gıda ve içecek fuarı',
        locationAr: 'مركز دبي التجاري العالمي، الإمارات',
        locationEn: 'Dubai World Trade Centre, UAE',
        locationTr: 'Dubai Dünya Ticaret Merkezi, BAE',
        startDate: new Date('2025-02-17'),
        endDate: new Date('2025-02-21'),
        images: JSON.parse(JSON.stringify(['/uploads/exhibitions/factory-1.jpg', '/uploads/exhibitions/factory-2.jpg'])),
        isActive: true,
        order: 1,
      },
    }),
    prisma.exhibition.upsert({
      where: { id: 'exhibition-packprocess-2025' },
      update: {},
      create: {
        id: 'exhibition-packprocess-2025',
        nameAr: 'معرض باك بروسيس 2025',
        nameEn: 'Pack Process Exhibition 2025',
        nameTr: 'Pack Process Fuarı 2025',
        descriptionAr: 'معرض متخصص في تقنيات التعبئة والتغليف في مصر',
        descriptionEn: 'Specialized exhibition for packaging technologies in Egypt',
        descriptionTr: 'Mısır\'da paketleme teknolojileri için uzmanlaşmış fuar',
        locationAr: 'مركز مصر الدولي للمعارض، القاهرة',
        locationEn: 'Egypt International Exhibition Center, Cairo',
        locationTr: 'Mısır Uluslararası Fuar Merkezi, Kahire',
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-03-13'),
        images: JSON.parse(JSON.stringify(['/uploads/exhibitions/factory-3.jpg', '/uploads/exhibitions/factory-4.jpg'])),
        isActive: true,
        order: 2,
      },
    }),
  ]);

  console.log('✅ Exhibitions created:', exhibitions.length);

  // ═══════════════════════════════════════════
  // TV INTERVIEWS
  // ═══════════════════════════════════════════
  const tvData = [
    // === TV Interviews (الظهور التلفزيوني) ===
    { id: 'tv-chairman-speech', titleAr: 'كلمة رئيس مجلس الادارة', titleEn: 'Chairman\'s Speech', titleTr: 'Yönetim Kurulu Başkanı Konuşması', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/tocPgV9Tx0k', thumbnail: 'https://img.youtube.com/vi/tocPgV9Tx0k/hqdefault.jpg', date: new Date('2024-12-01'), isActive: true, order: 1 },
    { id: 'tv-nahar-interview', titleAr: 'لقاء مع قناة النهار الفضائية', titleEn: 'Interview with Al-Nahar TV', titleTr: 'Al-Nahar TV Röportajı', channelAr: 'قناة النهار', channelEn: 'Al-Nahar TV', channelTr: 'Al-Nahar TV', videoUrl: 'https://www.youtube.com/embed/QhrfnGvOpY0', thumbnail: 'https://img.youtube.com/vi/QhrfnGvOpY0/hqdefault.jpg', date: new Date('2024-11-15'), isActive: true, order: 2 },
    { id: 'tv-chairman-interview-sna', titleAr: 'مقابلة مع رئيس مجلس الإدارة لشركة العتال SNA', titleEn: 'Interview with SNA Al-Attal Chairman', titleTr: 'SNA Al-Attal Başkanı ile Röportaj', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/wgd_l_i96FY', thumbnail: 'https://img.youtube.com/vi/wgd_l_i96FY/hqdefault.jpg', date: new Date('2024-11-01'), isActive: true, order: 3 },
    { id: 'tv-chairman-interview-2', titleAr: 'لقاء مع رئيس مجلس الادارة', titleEn: 'Interview with the Chairman', titleTr: 'Yönetim Kurulu Başkanı ile Röportaj', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/f4gL711XD0E', thumbnail: 'https://img.youtube.com/vi/f4gL711XD0E/hqdefault.jpg', date: new Date('2024-10-15'), isActive: true, order: 4 },
    { id: 'tv-marketing-director', titleAr: 'د. محمد الحيالي - مدير التسويق', titleEn: 'Dr. Mohamed Al-Hayali - Marketing Director', titleTr: 'Dr. Mohamed Al-Hayali - Pazarlama Müdürü', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/5tHeA8Jst2c', thumbnail: 'https://img.youtube.com/vi/5tHeA8Jst2c/hqdefault.jpg', date: new Date('2024-10-01'), isActive: true, order: 5 },
    // === Company Overview (نبذة عن الشركة) ===
    { id: 'tv-company-overview', titleAr: 'شركة العتال للصناعات الهندسية', titleEn: 'Al-Attal Engineering Industries', titleTr: 'Al-Attal Mühendislik Sanayi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/TL5e5JzxrKk', thumbnail: 'https://img.youtube.com/vi/TL5e5JzxrKk/hqdefault.jpg', date: new Date('2024-09-15'), isActive: true, order: 6 },
    { id: 'tv-1', titleAr: 'العتال للصناعات الهندسية', titleEn: 'Al-Attal Engineering Industries', titleTr: 'Al-Attal Mühendislik Sanayi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/IO77jUIjmo0', thumbnail: 'https://img.youtube.com/vi/IO77jUIjmo0/hqdefault.jpg', date: new Date('2024-09-01'), isActive: true, order: 7 },
    // === Production Videos (فيديوهات الإنتاج) ===
    { id: 'tv-machine-manufacturing', titleAr: 'صناعة ماكينات', titleEn: 'Machine Manufacturing', titleTr: 'Makine Üretimi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/m9BW7CySw1E', thumbnail: 'https://img.youtube.com/vi/m9BW7CySw1E/hqdefault.jpg', date: new Date('2024-08-15'), isActive: true, order: 8 },
    { id: 'tv-machine-review', titleAr: 'استعراض للمكن ومواصفاتها', titleEn: 'Machine Review & Specifications', titleTr: 'Makine İncelemesi ve Özellikleri', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/2mM6FK5itI8', thumbnail: 'https://img.youtube.com/vi/2mM6FK5itI8/hqdefault.jpg', date: new Date('2024-08-01'), isActive: true, order: 9 },
    { id: 'tv-assembly-team', titleAr: 'فريق تجميع الماكنة', titleEn: 'Machine Assembly Team', titleTr: 'Makine Montaj Ekibi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/8xecIUHiDe4', thumbnail: 'https://img.youtube.com/vi/8xecIUHiDe4/hqdefault.jpg', date: new Date('2024-07-15'), isActive: true, order: 10 },
    { id: 'tv-water-lines', titleAr: 'خطوط انتاج مياه', titleEn: 'Water Production Lines', titleTr: 'Su Üretim Hatları', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/frW5lCz9ZmY', thumbnail: 'https://img.youtube.com/vi/frW5lCz9ZmY/hqdefault.jpg', date: new Date('2024-07-01'), isActive: true, order: 11 },
    { id: 'tv-complete-line', titleAr: 'خط انتاج كامل', titleEn: 'Complete Production Line', titleTr: 'Tam Üretim Hattı', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/QRESUDZ3IdA', thumbnail: 'https://img.youtube.com/vi/QRESUDZ3IdA/hqdefault.jpg', date: new Date('2024-06-15'), isActive: true, order: 12 },
    // === Educational Videos (فيديوهات تعليمية) ===
    { id: 'tv-mineral-factory', titleAr: 'كيف تؤسس مصنع للمياه المعدنية', titleEn: 'How to Establish a Mineral Water Factory', titleTr: 'Maden Suyu Fabrikası Nasıl Kurulur', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/FDo7bz96ujc', thumbnail: 'https://img.youtube.com/vi/FDo7bz96ujc/hqdefault.jpg', date: new Date('2024-06-01'), isActive: true, order: 13 },
    { id: 'tv-production-capacity', titleAr: 'كيف تزيد من طاقة مصنعك الانتاجية', titleEn: 'How to Increase Your Factory Production Capacity', titleTr: 'Fabrika Üretim Kapasitenizi Nasıl Artırırsınız', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/l_jK9j5kkzs', thumbnail: 'https://img.youtube.com/vi/l_jK9j5kkzs/hqdefault.jpg', date: new Date('2024-05-15'), isActive: true, order: 14 },
  ];

  const tvInterviews = await Promise.all(
    tvData.map(({ id, ...data }) =>
      prisma.tVInterview.upsert({ where: { id }, update: data, create: { id, ...data } })
    )
  );

  console.log('✅ TV Interviews created:', tvInterviews.length);

  // ═══════════════════════════════════════════
  // CERTIFICATES
  // ═══════════════════════════════════════════
  const certificatesData = [
    { id: 'cert-1', nameAr: 'شهادة الجودة الأولى', nameEn: 'Quality Certificate 1', nameTr: 'Kalite Sertifikası 1', issuingBodyAr: 'هيئة الاعتماد المصرية', issuingBodyEn: 'Egyptian Accreditation Body', issuingBodyTr: 'Mısır Akreditasyon Kurumu', descriptionAr: 'شهادة اعتماد الجودة في التصنيع', descriptionEn: 'Manufacturing quality accreditation certificate', descriptionTr: 'Üretim kalite akreditasyon sertifikası', image: '/uploads/certificates/cert-1.png', issueDate: new Date('2024-01-15'), expiryDate: new Date('2027-01-14'), isActive: true, order: 1 },
    { id: 'cert-2', nameAr: 'شهادة الجودة الثانية', nameEn: 'Quality Certificate 2', nameTr: 'Kalite Sertifikası 2', issuingBodyAr: 'هيئة المطابقة الأوروبية', issuingBodyEn: 'European Conformity Body', issuingBodyTr: 'Avrupa Uygunluk Kurumu', descriptionAr: 'شهادة مطابقة المعايير الأوروبية', descriptionEn: 'European standards conformity certificate', descriptionTr: 'Avrupa standartları uygunluk sertifikası', image: '/uploads/certificates/cert-2.png', issueDate: new Date('2024-03-01'), expiryDate: new Date('2026-03-01'), isActive: true, order: 2 },
    { id: 'cert-3', nameAr: 'شهادة الجودة الثالثة', nameEn: 'Quality Certificate 3', nameTr: 'Kalite Sertifikası 3', issuingBodyAr: 'مؤسسة الجودة الدولية', issuingBodyEn: 'International Quality Foundation', issuingBodyTr: 'Uluslararası Kalite Vakfı', descriptionAr: 'شهادة معايير الجودة الدولية', descriptionEn: 'International quality standards certificate', descriptionTr: 'Uluslararası kalite standartları sertifikası', image: '/uploads/certificates/cert-3.png', issueDate: new Date('2024-06-01'), expiryDate: new Date('2027-06-01'), isActive: true, order: 3 },
    { id: 'cert-4', nameAr: 'شهادة الجودة الرابعة', nameEn: 'Quality Certificate 4', nameTr: 'Kalite Sertifikası 4', issuingBodyAr: 'هيئة سلامة الغذاء', issuingBodyEn: 'Food Safety Authority', issuingBodyTr: 'Gıda Güvenliği Otoritesi', descriptionAr: 'شهادة سلامة الغذاء والتصنيع', descriptionEn: 'Food safety and manufacturing certificate', descriptionTr: 'Gıda güvenliği ve üretim sertifikası', image: '/uploads/certificates/cert-4.png', issueDate: new Date('2024-09-01'), expiryDate: new Date('2027-09-01'), isActive: true, order: 4 },
    { id: 'cert-5', nameAr: 'شهادة الاعتماد', nameEn: 'Accreditation Certificate', nameTr: 'Akreditasyon Sertifikası', issuingBodyAr: 'هيئة الاعتماد', issuingBodyEn: 'Accreditation Body', issuingBodyTr: 'Akreditasyon Kurumu', descriptionAr: 'شهادة اعتماد رسمية', descriptionEn: 'Official accreditation certificate', descriptionTr: 'Resmi akreditasyon sertifikası', image: '/uploads/certificates/01.png', issueDate: new Date('2024-02-01'), isActive: true, order: 5 },
    { id: 'cert-6', nameAr: 'شهادة PCMS', nameEn: 'PCMS Certificate', nameTr: 'PCMS Sertifikası', issuingBodyAr: 'PCMS', issuingBodyEn: 'PCMS', issuingBodyTr: 'PCMS', descriptionAr: 'شهادة نظام إدارة الجودة PCMS', descriptionEn: 'PCMS Quality Management System Certificate', descriptionTr: 'PCMS Kalite Yönetim Sistemi Sertifikası', image: '/uploads/certificates/pcms-certificate.png', issueDate: new Date('2024-02-01'), isActive: true, order: 6 },
    { id: 'cert-7', nameAr: 'شهادة ISO', nameEn: 'ISO Certificate', nameTr: 'ISO Sertifikası', issuingBodyAr: 'المنظمة الدولية للمعايير', issuingBodyEn: 'International Organization for Standardization', issuingBodyTr: 'Uluslararası Standardizasyon Örgütü', descriptionAr: 'شهادة ISO للجودة', descriptionEn: 'ISO Quality Certificate', descriptionTr: 'ISO Kalite Sertifikası', image: '/uploads/certificates/pngegg.png', issueDate: new Date('2024-03-01'), isActive: true, order: 7 },
    { id: 'cert-8', nameAr: 'شهادة CE', nameEn: 'CE Certificate', nameTr: 'CE Sertifikası', issuingBodyAr: 'الاتحاد الأوروبي', issuingBodyEn: 'European Union', issuingBodyTr: 'Avrupa Birliği', descriptionAr: 'شهادة المطابقة الأوروبية CE', descriptionEn: 'European Conformity CE Certificate', descriptionTr: 'Avrupa Uygunluk CE Sertifikası', image: '/uploads/certificates/pngegg-1.png', issueDate: new Date('2024-04-01'), isActive: true, order: 8 },
    { id: 'cert-9', nameAr: 'شهادة الجودة الشاملة', nameEn: 'Total Quality Certificate', nameTr: 'Toplam Kalite Sertifikası', issuingBodyAr: 'هيئة الجودة الشاملة', issuingBodyEn: 'Total Quality Authority', issuingBodyTr: 'Toplam Kalite Otoritesi', descriptionAr: 'شهادة الجودة الشاملة في التصنيع', descriptionEn: 'Total quality in manufacturing certificate', descriptionTr: 'Üretimde toplam kalite sertifikası', image: '/uploads/certificates/pngegg-2.png', issueDate: new Date('2024-05-01'), isActive: true, order: 9 },
    { id: 'cert-10', nameAr: 'شهادة المطابقة', nameEn: 'Conformity Certificate', nameTr: 'Uygunluk Sertifikası', issuingBodyAr: 'هيئة المطابقة', issuingBodyEn: 'Conformity Body', issuingBodyTr: 'Uygunluk Kurumu', descriptionAr: 'شهادة مطابقة المعايير الدولية', descriptionEn: 'International standards conformity certificate', descriptionTr: 'Uluslararası standartlar uygunluk sertifikası', image: '/uploads/certificates/pngegg-3.png', issueDate: new Date('2024-06-01'), isActive: true, order: 10 },
    { id: 'cert-11', nameAr: 'شهادة التصنيع', nameEn: 'Manufacturing Certificate', nameTr: 'Üretim Sertifikası', issuingBodyAr: 'هيئة التصنيع', issuingBodyEn: 'Manufacturing Authority', issuingBodyTr: 'Üretim Otoritesi', descriptionAr: 'شهادة اعتماد التصنيع', descriptionEn: 'Manufacturing accreditation certificate', descriptionTr: 'Üretim akreditasyon sertifikası', image: '/uploads/certificates/whatsapp-cert-1.jpeg', issueDate: new Date('2024-02-15'), isActive: true, order: 11 },
    { id: 'cert-12', nameAr: 'شهادة الضمان', nameEn: 'Warranty Certificate', nameTr: 'Garanti Sertifikası', issuingBodyAr: 'هيئة الضمان', issuingBodyEn: 'Warranty Authority', issuingBodyTr: 'Garanti Otoritesi', descriptionAr: 'شهادة ضمان الجودة', descriptionEn: 'Quality warranty certificate', descriptionTr: 'Kalite garanti sertifikası', image: '/uploads/certificates/whatsapp-cert-2.jpeg', issueDate: new Date('2024-02-15'), isActive: true, order: 12 },
    { id: 'cert-13', nameAr: 'شهادة المعرض', nameEn: 'Exhibition Certificate', nameTr: 'Fuar Sertifikası', issuingBodyAr: 'إدارة المعارض', issuingBodyEn: 'Exhibition Management', issuingBodyTr: 'Fuar Yönetimi', descriptionAr: 'شهادة المشاركة في المعارض الدولية', descriptionEn: 'International exhibition participation certificate', descriptionTr: 'Uluslararası fuar katılım sertifikası', image: '/uploads/certificates/cert-photo-1.jpg', issueDate: new Date('2024-07-01'), isActive: true, order: 13 },
    { id: 'cert-14', nameAr: 'شهادة التميز', nameEn: 'Excellence Certificate', nameTr: 'Mükemmellik Sertifikası', issuingBodyAr: 'هيئة التميز الصناعي', issuingBodyEn: 'Industrial Excellence Authority', issuingBodyTr: 'Endüstriyel Mükemmellik Otoritesi', descriptionAr: 'شهادة التميز في الصناعة', descriptionEn: 'Industrial excellence certificate', descriptionTr: 'Endüstriyel mükemmellik sertifikası', image: '/uploads/certificates/cert-photo-2.jpg', issueDate: new Date('2024-08-01'), isActive: true, order: 14 },
    { id: 'cert-15', nameAr: 'شعار الاعتماد', nameEn: 'Accreditation Logo', nameTr: 'Akreditasyon Logosu', issuingBodyAr: 'هيئة الاعتماد', issuingBodyEn: 'Accreditation Authority', issuingBodyTr: 'Akreditasyon Otoritesi', descriptionAr: 'شعار الاعتماد الرسمي', descriptionEn: 'Official accreditation logo', descriptionTr: 'Resmi akreditasyon logosu', image: '/uploads/certificates/logo.png', issueDate: new Date('2024-01-01'), isActive: true, order: 15 },
  ];

  const certificates = await Promise.all(
    certificatesData.map(({ id, ...data }) =>
      prisma.certificate.upsert({ where: { id }, update: data, create: { id, ...data } })
    )
  );

  console.log('✅ Certificates created:', certificates.length);

  // ═══════════════════════════════════════════
  // SLIDES
  // ═══════════════════════════════════════════
  const slides = await Promise.all([
    prisma.slide.upsert({
      where: { id: 'slide-main-1' },
      update: {},
      create: {
        id: 'slide-main-1',
        titleAr: 'العتال للصناعات الهندسية',
        titleEn: 'S.N.A Al-Attal Engineering Industries',
        titleTr: 'S.N.A Al-Attal Mühendislik Sanayi',
        subtitleAr: 'نصنع مستقبل التعبئة',
        subtitleEn: 'Shaping the Future of Packaging',
        subtitleTr: 'Ambalajın Geleceğini Şekillendiriyoruz',
        descriptionAr: 'الشركة الرائدة في تصنيع خطوط إنتاج التعبئة السائلة بخبرة تمتد لأكثر من 30 عامًا',
        descriptionEn: 'Leading manufacturer of liquid filling production lines with over 30 years of experience',
        descriptionTr: '30 yılı aşkın deneyimle sıvı dolum üretim hatlarının önde gelen üreticisi',
        image: '/uploads/slides/hero-factory.jpg',
        buttonTextAr: 'اكتشف منتجاتنا',
        buttonTextEn: 'Discover Our Products',
        buttonTextTr: 'Ürünlerimizi Keşfedin',
        buttonLink: '/products',
        isActive: true,
        order: 1,
      },
    }),
    prisma.slide.upsert({
      where: { id: 'slide-main-2' },
      update: {},
      create: {
        id: 'slide-main-2',
        titleAr: 'خطوط إنتاج متكاملة',
        titleEn: 'Complete Production Lines',
        titleTr: 'Komple Üretim Hatları',
        subtitleAr: 'من التعبئة إلى التغليف',
        subtitleEn: 'From Filling to Packaging',
        subtitleTr: 'Dolumdan Paketlemeye',
        descriptionAr: 'نقدم حلول متكاملة لجميع احتياجات التعبئة والتغليف',
        descriptionEn: 'We provide complete solutions for all your filling and packaging needs',
        descriptionTr: 'Tüm dolum ve paketleme ihtiyaçlarınız için komple çözümler sunuyoruz',
        image: '/uploads/slides/hero-products.jpg',
        buttonTextAr: 'تواصل معنا',
        buttonTextEn: 'Contact Us',
        buttonTextTr: 'Bize Ulaşın',
        buttonLink: '/contact',
        isActive: true,
        order: 2,
      },
    }),
    prisma.slide.upsert({
      where: { id: 'slide-main-3' },
      update: {},
      create: {
        id: 'slide-main-3',
        titleAr: 'ماكينات نفخ PET',
        titleEn: 'PET Blow Molding Machines',
        titleTr: 'PET Şişirme Makineleri',
        subtitleAr: 'تصنيع مصري بجودة عالمية',
        subtitleEn: 'Egyptian Manufacturing, Global Quality',
        subtitleTr: 'Mısır Üretimi, Küresel Kalite',
        descriptionAr: 'ماكينات نفخ زجاجات PET بسعات من 600 إلى 16000 زجاجة في الساعة',
        descriptionEn: 'PET bottle blow molding machines with capacities from 600 to 16,000 bottles per hour',
        descriptionTr: 'Saatte 600 ila 16.000 şişe kapasiteli PET şişe şişirme makineleri',
        image: '/uploads/slides/hero-filling.jpg',
        buttonTextAr: 'عرض المنتجات',
        buttonTextEn: 'View Products',
        buttonTextTr: 'Ürünleri Görüntüle',
        buttonLink: '/products',
        isActive: true,
        order: 3,
      },
    }),
  ]);

  console.log('✅ Slides created:', slides.length);

  // ═══════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════
  const settings = await Promise.all([
    prisma.settings.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: JSON.stringify({ ar: 'العتال للصناعات الهندسية', en: 'S.N.A Al-Attal Engineering Industries', tr: 'S.N.A Al-Attal Mühendislik Sanayi' }),
        group: 'general',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: JSON.stringify({ ar: 'الشركة الرائدة في تصنيع خطوط إنتاج التعبئة السائلة', en: 'Leading manufacturer of liquid filling production lines', tr: 'Sıvı dolum üretim hatlarının önde gelen üreticisi' }),
        group: 'general',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: { key: 'contact_email', value: JSON.stringify('info@sna-alattal.com'), group: 'contact' },
    }),
    prisma.settings.upsert({
      where: { key: 'contact_phone_egypt' },
      update: {},
      create: { key: 'contact_phone_egypt', value: JSON.stringify('+201032221038'), group: 'contact' },
    }),
    prisma.settings.upsert({
      where: { key: 'contact_phone_turkey' },
      update: {},
      create: { key: 'contact_phone_turkey', value: JSON.stringify('+905551234567'), group: 'contact' },
    }),
    prisma.settings.upsert({
      where: { key: 'address_egypt' },
      update: {},
      create: {
        key: 'address_egypt',
        value: JSON.stringify({ ar: 'المدينة العاشر من رمضان، المنطقة الصناعية الثالثة، مصر', en: '10th of Ramadan City, 3rd Industrial Zone, Egypt', tr: '10. Ramazan Şehri, 3. Sanayi Bölgesi, Mısır' }),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'address_turkey' },
      update: {},
      create: {
        key: 'address_turkey',
        value: JSON.stringify({ ar: 'إسطنبول، تركيا', en: 'Istanbul, Turkey', tr: 'İstanbul, Türkiye' }),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'social_facebook' },
      update: {},
      create: { key: 'social_facebook', value: JSON.stringify('https://facebook.com/snaalattal'), group: 'social' },
    }),
    prisma.settings.upsert({
      where: { key: 'social_linkedin' },
      update: {},
      create: { key: 'social_linkedin', value: JSON.stringify('https://linkedin.com/company/snaalattal'), group: 'social' },
    }),
    prisma.settings.upsert({
      where: { key: 'social_youtube' },
      update: {},
      create: { key: 'social_youtube', value: JSON.stringify('https://youtube.com/@snaalattal'), group: 'social' },
    }),
    prisma.settings.upsert({
      where: { key: 'social_instagram' },
      update: {},
      create: { key: 'social_instagram', value: JSON.stringify('https://instagram.com/snaalattal'), group: 'social' },
    }),
    prisma.settings.upsert({
      where: { key: 'social_whatsapp' },
      update: {},
      create: { key: 'social_whatsapp', value: JSON.stringify('+201032221038'), group: 'social' },
    }),
  ]);

  console.log('✅ Settings created:', settings.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Solutions: ${solutions.length}`);
  console.log(`   - Clients: ${clients.length}`);
  console.log(`   - News: ${news.length}`);
  console.log(`   - Exhibitions: ${exhibitions.length}`);
  console.log(`   - TV Interviews: ${tvInterviews.length}`);
  console.log(`   - Certificates: ${certificates.length}`);
  console.log(`   - Slides: ${slides.length}`);
  console.log(`   - Settings: ${settings.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
