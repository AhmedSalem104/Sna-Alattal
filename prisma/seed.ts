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

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'filling-machines' },
      update: {},
      create: {
        nameAr: 'ماكينات التعبئة',
        nameEn: 'Filling Machines',
        nameTr: 'Dolum Makineleri',
        slug: 'filling-machines',
        descriptionAr: 'ماكينات تعبئة السوائل بجميع أنواعها وأحجامها للصناعات المختلفة',
        descriptionEn: 'Liquid filling machines of all types and sizes for various industries',
        descriptionTr: 'Çeşitli endüstriler için her tür ve boyutta sıvı dolum makineleri',
        image: '/images/categories/filling.jpg',
        isActive: true,
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'capping-machines' },
      update: {},
      create: {
        nameAr: 'ماكينات الغلق',
        nameEn: 'Capping Machines',
        nameTr: 'Kapatma Makineleri',
        slug: 'capping-machines',
        descriptionAr: 'ماكينات غلق الزجاجات والعبوات بدقة عالية',
        descriptionEn: 'High-precision bottle and container capping machines',
        descriptionTr: 'Yüksek hassasiyetli şişe ve kap kapatma makineleri',
        image: '/images/categories/capping.jpg',
        isActive: true,
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'labeling-machines' },
      update: {},
      create: {
        nameAr: 'ماكينات اللصق',
        nameEn: 'Labeling Machines',
        nameTr: 'Etiketleme Makineleri',
        slug: 'labeling-machines',
        descriptionAr: 'ماكينات لصق الملصقات على العبوات المستديرة والمربعة',
        descriptionEn: 'Label application machines for round and square containers',
        descriptionTr: 'Yuvarlak ve kare kaplar için etiket uygulama makineleri',
        image: '/images/categories/labeling.jpg',
        isActive: true,
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'production-lines' },
      update: {},
      create: {
        nameAr: 'خطوط الإنتاج',
        nameEn: 'Production Lines',
        nameTr: 'Üretim Hatları',
        slug: 'production-lines',
        descriptionAr: 'خطوط إنتاج متكاملة للسوائل تشمل التعبئة والغلق واللصق',
        descriptionEn: 'Complete liquid production lines including filling, capping, and labeling',
        descriptionTr: 'Dolum, kapatma ve etiketleme dahil komple sıvı üretim hatları',
        image: '/images/categories/production-lines.jpg',
        isActive: true,
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'packaging-machines' },
      update: {},
      create: {
        nameAr: 'ماكينات التغليف',
        nameEn: 'Packaging Machines',
        nameTr: 'Paketleme Makineleri',
        slug: 'packaging-machines',
        descriptionAr: 'ماكينات تغليف المنتجات بأفلام شرنك وكرتون',
        descriptionEn: 'Product packaging machines with shrink wrap and carton',
        descriptionTr: 'Shrink film ve karton ile ürün paketleme makineleri',
        image: '/images/categories/packaging.jpg',
        isActive: true,
        order: 5,
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  // Create Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'automatic-liquid-filling-machine' },
      update: {},
      create: {
        nameAr: 'ماكينة تعبئة السوائل الأوتوماتيكية',
        nameEn: 'Automatic Liquid Filling Machine',
        nameTr: 'Otomatik Sıvı Dolum Makinesi',
        slug: 'automatic-liquid-filling-machine',
        descriptionAr: 'ماكينة تعبئة سوائل أوتوماتيكية بالكامل مع نظام تحكم PLC متقدم. مناسبة لتعبئة المياه والعصائر والزيوت والمنظفات.',
        descriptionEn: 'Fully automatic liquid filling machine with advanced PLC control system. Suitable for filling water, juices, oils, and detergents.',
        descriptionTr: 'Gelişmiş PLC kontrol sistemli tam otomatik sıvı dolum makinesi. Su, meyve suları, yağlar ve deterjanlar için uygundur.',
        shortDescAr: 'تعبئة أوتوماتيكية عالية السرعة',
        shortDescEn: 'High-speed automatic filling',
        shortDescTr: 'Yüksek hızlı otomatik dolum',
        images: ['/images/products/filling-1.jpg', '/images/products/filling-2.jpg'],
        categoryId: categories[0].id,
        specifications: {
          capacity: '1000-5000 bottles/hour',
          accuracy: '±0.5%',
          power: '3KW',
          weight: '500kg',
          voltage: '380V/50Hz',
          airPressure: '0.6-0.8 MPa',
        },
        features: ['تحكم PLC سيمنز', 'شاشة تعمل باللمس 10 بوصة', 'تعديل حجم العبوات بسهولة', 'نظام منع التسرب'],
        isActive: true,
        isFeatured: true,
        order: 1,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'rotary-capping-machine' },
      update: {},
      create: {
        nameAr: 'ماكينة غلق دوارة',
        nameEn: 'Rotary Capping Machine',
        nameTr: 'Döner Kapatma Makinesi',
        slug: 'rotary-capping-machine',
        descriptionAr: 'ماكينة غلق دوارة عالية السرعة للإنتاج الكبير. تدعم أنواع متعددة من الأغطية وتتميز بدقة عالية في ضبط عزم الغلق.',
        descriptionEn: 'High-speed rotary capping machine for large production. Supports multiple cap types with high precision torque control.',
        descriptionTr: 'Büyük üretim için yüksek hızlı döner kapatma makinesi. Yüksek hassasiyetli tork kontrolü ile çoklu kapak türlerini destekler.',
        shortDescAr: 'غلق سريع ودقيق',
        shortDescEn: 'Fast and precise capping',
        shortDescTr: 'Hızlı ve hassas kapatma',
        images: ['/images/products/capping-1.jpg'],
        categoryId: categories[1].id,
        specifications: {
          capacity: '3000-8000 bottles/hour',
          capTypes: 'Screw, Press-on, ROPP',
          power: '2.5KW',
          weight: '400kg',
        },
        features: ['تعدد أنواع الأغطية', 'ضبط عزم الغلق رقمياً', 'سهولة التغيير', 'كشف الأغطية التالفة'],
        isActive: true,
        isFeatured: true,
        order: 2,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'automatic-labeling-machine' },
      update: {},
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
        images: ['/images/products/labeling-1.jpg'],
        categoryId: categories[2].id,
        specifications: {
          capacity: '2000-6000 bottles/hour',
          accuracy: '±1mm',
          labelWidth: '20-150mm',
          power: '1.5KW',
        },
        features: ['تعدد أشكال العبوات', 'دقة عالية ±1مم', 'سهولة الإعداد', 'نظام كشف الفراغات'],
        isActive: true,
        isFeatured: true,
        order: 3,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'complete-water-production-line' },
      update: {},
      create: {
        nameAr: 'خط إنتاج مياه متكامل',
        nameEn: 'Complete Water Production Line',
        nameTr: 'Komple Su Üretim Hattı',
        slug: 'complete-water-production-line',
        descriptionAr: 'خط إنتاج مياه متكامل يشمل التعبئة والغلق واللصق والتغليف. حل شامل لمصانع المياه مع ضمان 3 سنوات.',
        descriptionEn: 'Complete water production line including filling, capping, labeling, and packaging. Comprehensive solution for water factories with 3-year warranty.',
        descriptionTr: 'Dolum, kapatma, etiketleme ve paketleme dahil komple su üretim hattı. 3 yıl garantili su fabrikaları için kapsamlı çözüm.',
        shortDescAr: 'حل متكامل لإنتاج المياه',
        shortDescEn: 'Complete water production solution',
        shortDescTr: 'Komple su üretim çözümü',
        images: ['/images/products/line-1.jpg', '/images/products/line-2.jpg'],
        categoryId: categories[3].id,
        specifications: {
          capacity: '5000-20000 bottles/hour',
          bottleSize: '200ml-2L',
          power: '15KW',
          area: '50-100 sqm',
        },
        features: ['خط متكامل', 'توفير العمالة', 'جودة عالية', 'ضمان 3 سنوات'],
        isActive: true,
        isFeatured: true,
        order: 4,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'shrink-wrapping-machine' },
      update: {},
      create: {
        nameAr: 'ماكينة التغليف بالشرنك',
        nameEn: 'Shrink Wrapping Machine',
        nameTr: 'Shrink Ambalaj Makinesi',
        slug: 'shrink-wrapping-machine',
        descriptionAr: 'ماكينة تغليف بأفلام الشرنك للعبوات الفردية والمجموعات. مناسبة للمشروبات والأغذية.',
        descriptionEn: 'Shrink wrapping machine for individual and group packaging. Suitable for beverages and food products.',
        descriptionTr: 'Bireysel ve grup paketleme için shrink ambalaj makinesi. İçecekler ve gıda ürünleri için uygundur.',
        shortDescAr: 'تغليف احترافي بالشرنك',
        shortDescEn: 'Professional shrink wrapping',
        shortDescTr: 'Profesyonel shrink ambalaj',
        images: ['/images/products/shrink-1.jpg'],
        categoryId: categories[4].id,
        specifications: {
          capacity: '15-30 packs/min',
          packSize: '2x3, 3x4, 4x6',
          power: '8KW',
        },
        features: ['تغليف فردي ومجموعات', 'تحكم درجة الحرارة', 'سهولة الضبط'],
        isActive: true,
        isFeatured: false,
        order: 5,
      },
    }),
  ]);

  console.log('✅ Products created:', products.length);

  // Create Solutions
  const solutions = await Promise.all([
    prisma.solution.upsert({
      where: { slug: 'food-beverages' },
      update: {},
      create: {
        titleAr: 'الأغذية والمشروبات',
        titleEn: 'Food & Beverages',
        titleTr: 'Gıda ve İçecek',
        slug: 'food-beverages',
        descriptionAr: 'حلول متكاملة لصناعة الأغذية والمشروبات تشمل خطوط تعبئة العصائر والمياه والمشروبات الغازية',
        descriptionEn: 'Complete solutions for food and beverage industry including juice, water, and soft drink filling lines',
        descriptionTr: 'Meyve suyu, su ve meşrubat dolum hatları dahil gıda ve içecek sektörü için komple çözümler',
        shortDescAr: 'حلول صناعة الأغذية',
        shortDescEn: 'Food industry solutions',
        shortDescTr: 'Gıda sektörü çözümleri',
        icon: 'utensils',
        image: '/images/solutions/food.jpg',
        isActive: true,
        isFeatured: true,
        order: 1,
      },
    }),
    prisma.solution.upsert({
      where: { slug: 'pharmaceuticals' },
      update: {},
      create: {
        titleAr: 'الأدوية',
        titleEn: 'Pharmaceuticals',
        titleTr: 'İlaç',
        slug: 'pharmaceuticals',
        descriptionAr: 'حلول متكاملة لصناعة الأدوية مع معايير GMP العالمية',
        descriptionEn: 'Complete solutions for pharmaceutical industry with global GMP standards',
        descriptionTr: 'Küresel GMP standartlarıyla ilaç sektörü için komple çözümler',
        shortDescAr: 'حلول صناعة الأدوية',
        shortDescEn: 'Pharmaceutical solutions',
        shortDescTr: 'İlaç sektörü çözümleri',
        icon: 'pill',
        image: '/images/solutions/pharma.jpg',
        isActive: true,
        isFeatured: true,
        order: 2,
      },
    }),
    prisma.solution.upsert({
      where: { slug: 'cosmetics' },
      update: {},
      create: {
        titleAr: 'مستحضرات التجميل',
        titleEn: 'Cosmetics',
        titleTr: 'Kozmetik',
        slug: 'cosmetics',
        descriptionAr: 'حلول متكاملة لصناعة مستحضرات التجميل والعناية الشخصية',
        descriptionEn: 'Complete solutions for cosmetics and personal care industry',
        descriptionTr: 'Kozmetik ve kişisel bakım sektörü için komple çözümler',
        shortDescAr: 'حلول مستحضرات التجميل',
        shortDescEn: 'Cosmetics solutions',
        shortDescTr: 'Kozmetik çözümleri',
        icon: 'sparkles',
        image: '/images/solutions/cosmetics.jpg',
        isActive: true,
        isFeatured: true,
        order: 3,
      },
    }),
    prisma.solution.upsert({
      where: { slug: 'chemicals' },
      update: {},
      create: {
        titleAr: 'الكيماويات',
        titleEn: 'Chemicals',
        titleTr: 'Kimyasallar',
        slug: 'chemicals',
        descriptionAr: 'حلول متكاملة للصناعات الكيماوية والمنظفات',
        descriptionEn: 'Complete solutions for chemical and detergent industry',
        descriptionTr: 'Kimya ve deterjan sektörü için komple çözümler',
        shortDescAr: 'حلول الصناعات الكيماوية',
        shortDescEn: 'Chemical industry solutions',
        shortDescTr: 'Kimya sektörü çözümleri',
        icon: 'flask',
        image: '/images/solutions/chemicals.jpg',
        isActive: true,
        isFeatured: true,
        order: 4,
      },
    }),
  ]);

  console.log('✅ Solutions created:', solutions.length);

  // Create Clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'client-almarai' },
      update: {},
      create: {
        id: 'client-almarai',
        nameAr: 'شركة المراعي',
        nameEn: 'Almarai Company',
        nameTr: 'Almarai Şirketi',
        logo: '/images/clients/almarai.png',
        website: 'https://www.almarai.com',
        country: 'Saudi Arabia',
        isActive: true,
        order: 1,
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-juhayna' },
      update: {},
      create: {
        id: 'client-juhayna',
        nameAr: 'شركة جهينة',
        nameEn: 'Juhayna Company',
        nameTr: 'Juhayna Şirketi',
        logo: '/images/clients/juhayna.png',
        website: 'https://www.juhayna.com',
        country: 'Egypt',
        isActive: true,
        order: 2,
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-nestle' },
      update: {},
      create: {
        id: 'client-nestle',
        nameAr: 'نستله مصر',
        nameEn: 'Nestle Egypt',
        nameTr: 'Nestle Mısır',
        logo: '/images/clients/nestle.png',
        website: 'https://www.nestle.com.eg',
        country: 'Egypt',
        isActive: true,
        order: 3,
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-hayat' },
      update: {},
      create: {
        id: 'client-hayat',
        nameAr: 'مياه حياة',
        nameEn: 'Hayat Water',
        nameTr: 'Hayat Su',
        logo: '/images/clients/hayat.png',
        website: 'https://www.hayatwater.com',
        country: 'Saudi Arabia',
        isActive: true,
        order: 4,
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-aquafina' },
      update: {},
      create: {
        id: 'client-aquafina',
        nameAr: 'أكوافينا',
        nameEn: 'Aquafina',
        nameTr: 'Aquafina',
        logo: '/images/clients/aquafina.png',
        country: 'UAE',
        isActive: true,
        order: 5,
      },
    }),
  ]);

  console.log('✅ Clients created:', clients.length);

  // Create News
  const news = await Promise.all([
    prisma.news.upsert({
      where: { slug: 'new-production-line-launch-2025' },
      update: {},
      create: {
        titleAr: 'إطلاق خط إنتاج جديد عالي السرعة',
        titleEn: 'New High-Speed Production Line Launch',
        titleTr: 'Yeni Yüksek Hızlı Üretim Hattı Lansmanı',
        slug: 'new-production-line-launch-2025',
        contentAr: 'يسر شركة S.N.A العطال أن تعلن عن إطلاق خط إنتاج جديد عالي السرعة قادر على معالجة 20,000 زجاجة في الساعة. هذا الخط الجديد يمثل قفزة نوعية في تقنية التعبئة ويعكس التزامنا المستمر بتقديم أحدث التقنيات لعملائنا.',
        contentEn: 'S.N.A Al-Attal is pleased to announce the launch of a new high-speed production line capable of processing 20,000 bottles per hour. This new line represents a quantum leap in filling technology and reflects our continued commitment to delivering cutting-edge technology to our customers.',
        contentTr: 'S.N.A Al-Attal, saatte 20.000 şişe işleyebilen yeni bir yüksek hızlı üretim hattının lansmanını duyurmaktan mutluluk duyar. Bu yeni hat, dolum teknolojisinde bir sıçramayı temsil eder.',
        excerptAr: 'خط إنتاج جديد بسعة 20,000 زجاجة في الساعة',
        excerptEn: 'New production line with 20,000 bottles/hour capacity',
        excerptTr: 'Saatte 20.000 şişe kapasiteli yeni üretim hattı',
        image: '/images/news/production-line.jpg',
        author: 'فريق التسويق',
        publishedAt: new Date(),
        isActive: true,
        isFeatured: true,
        tags: ['خطوط إنتاج', 'تقنية', 'جديد'],
      },
    }),
    prisma.news.upsert({
      where: { slug: 'gulfood-exhibition-2025' },
      update: {},
      create: {
        titleAr: 'مشاركتنا في معرض جلفود 2025',
        titleEn: 'Our Participation in Gulfood Exhibition 2025',
        titleTr: 'Gulfood Fuarı 2025 Katılımımız',
        slug: 'gulfood-exhibition-2025',
        contentAr: 'شاركت شركة S.N.A العطال في معرض جلفود 2025 بدبي، حيث عرضنا أحدث منتجاتنا وتقنياتنا في مجال خطوط الإنتاج. كان المعرض فرصة رائعة للقاء عملائنا الحاليين والتعرف على عملاء جدد من مختلف أنحاء العالم.',
        contentEn: 'S.N.A Al-Attal participated in Gulfood Exhibition 2025 in Dubai, where we showcased our latest products and technologies in production lines. The exhibition was a great opportunity to meet our existing customers and connect with new ones from around the world.',
        contentTr: 'S.N.A Al-Attal, Dubai\'deki Gulfood Fuarı 2025\'e katıldı ve üretim hatlarındaki en son ürünlerimizi ve teknolojilerimizi sergiledik.',
        excerptAr: 'شاركنا في أكبر معرض للأغذية في الشرق الأوسط',
        excerptEn: 'We participated in the largest food exhibition in the Middle East',
        excerptTr: 'Orta Doğu\'nun en büyük gıda fuarına katıldık',
        image: '/images/news/gulfood.jpg',
        author: 'فريق التسويق',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        tags: ['معارض', 'دبي', 'جلفود'],
      },
    }),
    prisma.news.upsert({
      where: { slug: 'iso-certification-renewal' },
      update: {},
      create: {
        titleAr: 'تجديد شهادة الأيزو 9001:2015',
        titleEn: 'ISO 9001:2015 Certification Renewal',
        titleTr: 'ISO 9001:2015 Sertifika Yenilemesi',
        slug: 'iso-certification-renewal',
        contentAr: 'نحن فخورون بالإعلان عن تجديد شهادة الأيزو 9001:2015 لنظام إدارة الجودة. هذا التجديد يؤكد التزامنا المستمر بأعلى معايير الجودة في جميع عملياتنا.',
        contentEn: 'We are proud to announce the renewal of our ISO 9001:2015 quality management system certification. This renewal confirms our continued commitment to the highest quality standards in all our operations.',
        contentTr: 'ISO 9001:2015 kalite yönetim sistemi sertifikamızın yenilendiğini duyurmaktan gurur duyuyoruz.',
        excerptAr: 'تجديد شهادة الأيزو لضمان أعلى معايير الجودة',
        excerptEn: 'ISO certification renewal ensuring highest quality standards',
        excerptTr: 'En yüksek kalite standartlarını sağlayan ISO sertifikası yenilemesi',
        image: '/images/news/iso.jpg',
        author: 'إدارة الجودة',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        isActive: true,
        isFeatured: false,
        tags: ['جودة', 'أيزو', 'شهادات'],
      },
    }),
  ]);

  console.log('✅ News created:', news.length);

  // Create Exhibitions
  const exhibitions = await Promise.all([
    prisma.exhibition.upsert({
      where: { id: 'exhibition-gulfood-2025' },
      update: {},
      create: {
        id: 'exhibition-gulfood-2025',
        nameAr: 'معرض جلفود 2025',
        nameEn: 'Gulfood Exhibition 2025',
        nameTr: 'Gulfood Fuarı 2025',
        descriptionAr: 'أكبر معرض سنوي للأغذية والمشروبات في الشرق الأوسط. نعرض فيه أحدث خطوط الإنتاج.',
        descriptionEn: 'The largest annual food and beverage exhibition in the Middle East. We showcase our latest production lines.',
        descriptionTr: 'Orta Doğu\'nun en büyük yıllık gıda ve içecek fuarı. En son üretim hatlarımızı sergiliyoruz.',
        location: 'Dubai World Trade Centre, UAE',
        startDate: new Date('2025-02-17'),
        endDate: new Date('2025-02-21'),
        images: ['/images/exhibitions/gulfood-1.jpg', '/images/exhibitions/gulfood-2.jpg'],
        boothNumber: 'Hall 5, Stand A25',
        isActive: true,
        isFeatured: true,
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
        location: 'Egypt International Exhibition Center, Cairo',
        startDate: new Date('2025-03-10'),
        endDate: new Date('2025-03-13'),
        images: ['/images/exhibitions/packprocess-1.jpg'],
        boothNumber: 'Hall 2, Stand B10',
        isActive: true,
        isFeatured: true,
        order: 2,
      },
    }),
    prisma.exhibition.upsert({
      where: { id: 'exhibition-interpack-2026' },
      update: {},
      create: {
        id: 'exhibition-interpack-2026',
        nameAr: 'معرض إنترباك 2026',
        nameEn: 'Interpack 2026',
        nameTr: 'Interpack 2026',
        descriptionAr: 'أكبر معرض دولي لصناعة التعبئة والتغليف في العالم',
        descriptionEn: 'The world\'s largest trade fair for the packaging industry',
        descriptionTr: 'Dünyanın en büyük ambalaj endüstrisi fuarı',
        location: 'Düsseldorf, Germany',
        startDate: new Date('2026-05-07'),
        endDate: new Date('2026-05-13'),
        images: ['/images/exhibitions/interpack-1.jpg'],
        boothNumber: 'TBA',
        isActive: true,
        isFeatured: false,
        order: 3,
      },
    }),
  ]);

  console.log('✅ Exhibitions created:', exhibitions.length);

  // Create Certificates
  const certificates = await Promise.all([
    prisma.certificate.upsert({
      where: { id: 'cert-iso-9001' },
      update: {},
      create: {
        id: 'cert-iso-9001',
        nameAr: 'شهادة ISO 9001:2015',
        nameEn: 'ISO 9001:2015 Certificate',
        nameTr: 'ISO 9001:2015 Sertifikası',
        descriptionAr: 'شهادة نظام إدارة الجودة المعتمدة دولياً',
        descriptionEn: 'Internationally recognized quality management system certificate',
        descriptionTr: 'Uluslararası tanınmış kalite yönetim sistemi sertifikası',
        image: '/images/certificates/iso-9001.jpg',
        issuedBy: 'TÜV SÜD',
        issuedDate: new Date('2024-01-15'),
        expiryDate: new Date('2027-01-14'),
        isActive: true,
        order: 1,
      },
    }),
    prisma.certificate.upsert({
      where: { id: 'cert-ce' },
      update: {},
      create: {
        id: 'cert-ce',
        nameAr: 'شهادة CE',
        nameEn: 'CE Certificate',
        nameTr: 'CE Sertifikası',
        descriptionAr: 'شهادة المطابقة الأوروبية لمعايير السلامة',
        descriptionEn: 'European Conformity certificate for safety standards',
        descriptionTr: 'Güvenlik standartları için Avrupa Uygunluk sertifikası',
        image: '/images/certificates/ce.jpg',
        issuedBy: 'SGS',
        issuedDate: new Date('2024-03-01'),
        expiryDate: new Date('2026-03-01'),
        isActive: true,
        order: 2,
      },
    }),
    prisma.certificate.upsert({
      where: { id: 'cert-gmp' },
      update: {},
      create: {
        id: 'cert-gmp',
        nameAr: 'شهادة GMP',
        nameEn: 'GMP Certificate',
        nameTr: 'GMP Sertifikası',
        descriptionAr: 'شهادة ممارسات التصنيع الجيدة',
        descriptionEn: 'Good Manufacturing Practices certificate',
        descriptionTr: 'İyi Üretim Uygulamaları sertifikası',
        image: '/images/certificates/gmp.jpg',
        issuedBy: 'Bureau Veritas',
        issuedDate: new Date('2024-06-01'),
        expiryDate: new Date('2027-06-01'),
        isActive: true,
        order: 3,
      },
    }),
  ]);

  console.log('✅ Certificates created:', certificates.length);

  // Create Catalogues
  const catalogues = await Promise.all([
    prisma.catalogue.upsert({
      where: { id: 'catalogue-filling' },
      update: {},
      create: {
        id: 'catalogue-filling',
        nameAr: 'كتالوج ماكينات التعبئة 2025',
        nameEn: 'Filling Machines Catalogue 2025',
        nameTr: 'Dolum Makineleri Kataloğu 2025',
        descriptionAr: 'كتالوج شامل لجميع ماكينات التعبئة مع المواصفات التفصيلية',
        descriptionEn: 'Comprehensive catalogue of all filling machines with detailed specifications',
        descriptionTr: 'Detaylı özelliklerle tüm dolum makinelerinin kapsamlı kataloğu',
        fileUrl: '/catalogues/filling-machines-2025.pdf',
        thumbnail: '/images/catalogues/filling-thumb.jpg',
        fileSize: 5242880,
        isActive: true,
        order: 1,
      },
    }),
    prisma.catalogue.upsert({
      where: { id: 'catalogue-lines' },
      update: {},
      create: {
        id: 'catalogue-lines',
        nameAr: 'كتالوج خطوط الإنتاج 2025',
        nameEn: 'Production Lines Catalogue 2025',
        nameTr: 'Üretim Hatları Kataloğu 2025',
        descriptionAr: 'كتالوج خطوط الإنتاج المتكاملة للمشروبات والسوائل',
        descriptionEn: 'Complete production lines catalogue for beverages and liquids',
        descriptionTr: 'İçecekler ve sıvılar için komple üretim hatları kataloğu',
        fileUrl: '/catalogues/production-lines-2025.pdf',
        thumbnail: '/images/catalogues/lines-thumb.jpg',
        fileSize: 8388608,
        isActive: true,
        order: 2,
      },
    }),
    prisma.catalogue.upsert({
      where: { id: 'catalogue-company' },
      update: {},
      create: {
        id: 'catalogue-company',
        nameAr: 'بروفايل الشركة',
        nameEn: 'Company Profile',
        nameTr: 'Şirket Profili',
        descriptionAr: 'نبذة شاملة عن شركة العطال وإنجازاتها',
        descriptionEn: 'Comprehensive overview of Al-Attal company and achievements',
        descriptionTr: 'Al-Attal şirketi ve başarılarına kapsamlı genel bakış',
        fileUrl: '/catalogues/company-profile-2025.pdf',
        thumbnail: '/images/catalogues/profile-thumb.jpg',
        fileSize: 3145728,
        isActive: true,
        order: 3,
      },
    }),
  ]);

  console.log('✅ Catalogues created:', catalogues.length);

  // Create Settings
  const settings = await Promise.all([
    prisma.settings.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: JSON.stringify({
          ar: 'العتال للصناعات الهندسية',
          en: 'S.N.A Al-Attal Engineering Industries',
          tr: 'S.N.A Al-Attal Mühendislik Sanayi',
        }),
        group: 'general',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: JSON.stringify({
          ar: 'الشركة الرائدة في تصنيع خطوط إنتاج التعبئة السائلة',
          en: 'Leading manufacturer of liquid filling production lines',
          tr: 'Sıvı dolum üretim hatlarının önde gelen üreticisi',
        }),
        group: 'general',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: {
        key: 'contact_email',
        value: JSON.stringify('info@sna-alattal.com'),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'contact_phone_egypt' },
      update: {},
      create: {
        key: 'contact_phone_egypt',
        value: JSON.stringify('+201032221038'),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'contact_phone_turkey' },
      update: {},
      create: {
        key: 'contact_phone_turkey',
        value: JSON.stringify('+905551234567'),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'address_egypt' },
      update: {},
      create: {
        key: 'address_egypt',
        value: JSON.stringify({
          ar: 'المدينة العاشر من رمضان، المنطقة الصناعية الثالثة، مصر',
          en: '10th of Ramadan City, 3rd Industrial Zone, Egypt',
          tr: '10. Ramazan Şehri, 3. Sanayi Bölgesi, Mısır',
        }),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'address_turkey' },
      update: {},
      create: {
        key: 'address_turkey',
        value: JSON.stringify({
          ar: 'إسطنبول، تركيا',
          en: 'Istanbul, Turkey',
          tr: 'İstanbul, Türkiye',
        }),
        group: 'contact',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'social_facebook' },
      update: {},
      create: {
        key: 'social_facebook',
        value: JSON.stringify('https://facebook.com/snaalattal'),
        group: 'social',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'social_linkedin' },
      update: {},
      create: {
        key: 'social_linkedin',
        value: JSON.stringify('https://linkedin.com/company/snaalattal'),
        group: 'social',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'social_youtube' },
      update: {},
      create: {
        key: 'social_youtube',
        value: JSON.stringify('https://youtube.com/@snaalattal'),
        group: 'social',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'social_instagram' },
      update: {},
      create: {
        key: 'social_instagram',
        value: JSON.stringify('https://instagram.com/snaalattal'),
        group: 'social',
      },
    }),
    prisma.settings.upsert({
      where: { key: 'social_whatsapp' },
      update: {},
      create: {
        key: 'social_whatsapp',
        value: JSON.stringify('+201032221038'),
        group: 'social',
      },
    }),
  ]);

  console.log('✅ Settings created:', settings.length);

  // Create Sample Slides
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
        image: '/images/slides/hero-1.jpg',
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
        image: '/images/slides/hero-2.jpg',
        buttonTextAr: 'تواصل معنا',
        buttonTextEn: 'Contact Us',
        buttonTextTr: 'Bize Ulaşın',
        buttonLink: '/contact',
        isActive: true,
        order: 2,
      },
    }),
  ]);

  console.log('✅ Slides created:', slides.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
