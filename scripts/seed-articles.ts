import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Article data - extracted from Word documents
const articles = [
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'ما هي أنواع البلاستيك وما هي استخداماتها؟',
    titleEn: 'What are the types of plastic and what are their uses?',
    titleTr: 'Plastik türleri nelerdir ve kullanım alanları nelerdir?',
    slug: 'plastic-types-and-uses',
    contentAr: `ما هي أنواع البلاستيك وما هي استخداماتها؟

قبل أن تبدأ القراءة، ما رأيك أن تحرك ناظريك حولك في الغرفة وتلاحظ كم هي الأشياء التي يدخل البلاستيك في صناعتها، فمن غلاف الشاشة على الحائط إلى بعض الرفوف في الثلاجة إلى الطاولة أو الكرسي الذي تجلس عليه.

يعتبر البلاستيك أحد أهم الابتكارات في القرن الماضي، حيث استطاعت المواد البلاستيكية أن تحل مكان المواد التقليدية مثل المعادن أو الزجاج أو القطن في العديد من التطبيقات اليومية.

أنواع المواد البلاستيكية:
تقسم المواد البلاستيكية إلى نوعين أساسيين هما:
- البلاستيك المعالج بالحرارة Thermoset plastics
- اللدائن الحرارية Thermoplastics

البولي إيثيلين تيريفثاليت (PET أو PETE أو البوليستر):
يُعرف PET أيضًا باسم الألياف الخالية من التجاعيد، يستخدم PET في الغالب لأغراض تغليف المواد الغذائية والمشروبات.

البولي اثيلين عالي الكثافة (HDPE):
تمتلك HDPE سلاسلًا طويلةً من البوليمرات مما يجعلها كثيفةً جدًا وبالتالي أقوى وأكثر سمكًا من PET.`,
    contentEn: `What are the types of plastic and what are their uses?

Before you start reading, look around your room and notice how many things are made with plastic, from the screen cover on the wall to some shelves in the refrigerator to the table or chair you are sitting on.

Plastic is considered one of the most important innovations of the last century, as plastic materials have been able to replace traditional materials such as metals, glass, or cotton in many everyday applications.

Types of Plastic Materials:
Plastic materials are divided into two main types:
- Thermoset plastics
- Thermoplastics

Polyethylene Terephthalate (PET or PETE or Polyester):
PET is also known as wrinkle-free fiber, PET is mostly used for food and beverage packaging purposes.

High-Density Polyethylene (HDPE):
HDPE has long polymer chains which makes it very dense and therefore stronger and thicker than PET.`,
    contentTr: `Plastik türleri nelerdir ve kullanım alanları nelerdir?

Okumaya başlamadan önce, odanıza bakın ve ne kadar çok şeyin plastikten yapıldığını fark edin.

Plastik, geçen yüzyılın en önemli buluşlarından biri olarak kabul edilir.`,
    excerptAr: 'تعرف على أنواع البلاستيك المختلفة واستخداماتها في الحياة اليومية والصناعة',
    excerptEn: 'Learn about different types of plastic and their uses in daily life and industry',
    excerptTr: 'Farklı plastik türleri ve günlük yaşam ve sanayideki kullanımları hakkında bilgi edinin',
    image: '/uploads/news/article-plastic-types.jpg',
    tags: ['البلاستيك', 'PET', 'HDPE', 'صناعة'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'تعزيز الاقتصاد الابتكاري داخل المؤسسات والشركات',
    titleEn: 'Strengthening the Innovation Economy within Institutions and Companies',
    titleTr: 'Kurum ve Şirketlerde İnovasyon Ekonomisini Güçlendirmek',
    slug: 'innovation-economy-companies',
    contentAr: `تعزيز الاقتصاد الابتكاري داخل المؤسسات والشركات

في السنوات الأخيرة اكتسب مصطلح "اقتصاد الابتكار" زخمًا بين قادة الأعمال والعلماء والباحثين على حدٍ سواء. يشير اقتصاد الابتكار إلى نظام اقتصادي يعتمد بشكل كبير على رأس المال الفكري والمعرفة التقنية ويعتمد على الابتكار كمحرك رئيسي للنمو الاقتصادي وخلق القيمة.

في العتال للصناعات الهندسية نؤمن بأهمية الابتكار والتطوير المستمر لمواكبة التغيرات العالمية في صناعة خطوط الإنتاج.

دور التكنولوجيا في الاقتصاد الابتكاري:
تلعب التكنولوجيا دورًا محوريًا في الاقتصاد الابتكاري من خلال تمكين الشركات من تطوير منتجات وخدمات جديدة.`,
    contentEn: `Strengthening the Innovation Economy within Institutions and Companies

In recent years, the term "innovation economy" has gained momentum among business leaders, scientists, and researchers alike. The innovation economy refers to an economic system that relies heavily on intellectual capital and technical knowledge and depends on innovation as a key driver of economic growth and value creation.

At Al-Attal Engineering Industries, we believe in the importance of innovation and continuous development to keep pace with global changes in the production line industry.

The Role of Technology in the Innovation Economy:
Technology plays a pivotal role in the innovation economy by enabling companies to develop new products and services.`,
    contentTr: `Kurum ve Şirketlerde İnovasyon Ekonomisini Güçlendirmek

Son yıllarda "inovasyon ekonomisi" terimi iş liderleri, bilim insanları ve araştırmacılar arasında ivme kazandı.`,
    excerptAr: 'كيف يمكن للمؤسسات والشركات تعزيز ثقافة الابتكار والنمو الاقتصادي',
    excerptEn: 'How institutions and companies can foster a culture of innovation and economic growth',
    excerptTr: 'Kurumlar ve şirketler nasıl inovasyon ve ekonomik büyüme kültürü geliştirebilir',
    image: '/uploads/news/article-innovation-economy.jpg',
    tags: ['الابتكار', 'الاقتصاد', 'التكنولوجيا', 'التطوير'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'مؤتمر المناخ COP27 يسلط الضوء على الاستخدام الامثل للبلاستيك',
    titleEn: 'COP27 Climate Conference Highlights Optimal Plastic Use',
    titleTr: 'COP27 İklim Konferansı Optimum Plastik Kullanımına Dikkat Çekiyor',
    slug: 'cop27-plastic-use',
    contentAr: `مؤتمر المناخ COP27 يسلط الضوء على الاستخدام الامثل للبلاستيك

كيف تتسرب جزيئات البلاستيك إلى أجسادنا؟

في مؤتمر المناخ COP27 الذي أقيم في شرم الشيخ، تم تسليط الضوء على أهمية الاستخدام الأمثل للبلاستيك والتقليل من النفايات البلاستيكية.

البلاستيك الدقيق:
البلاستيك الدقيق هو قطع صغيرة من البلاستيك يقل حجمها عن 5 ملليمترات. يمكن أن تتواجد هذه الجسيمات الصغيرة في البيئة نتيجة تحلل المنتجات البلاستيكية الأكبر حجمًا.

الحلول المقترحة:
- تقليل استخدام البلاستيك للاستخدام الواحد
- إعادة التدوير بشكل فعال
- تطوير بدائل صديقة للبيئة`,
    contentEn: `COP27 Climate Conference Highlights Optimal Plastic Use

How do plastic particles leak into our bodies?

At the COP27 climate conference held in Sharm El-Sheikh, the importance of optimal plastic use and reducing plastic waste was highlighted.

Microplastics:
Microplastics are small pieces of plastic less than 5 millimeters in size. These tiny particles can be found in the environment as a result of the decomposition of larger plastic products.

Proposed Solutions:
- Reduce single-use plastic
- Effective recycling
- Develop eco-friendly alternatives`,
    contentTr: `COP27 İklim Konferansı Optimum Plastik Kullanımına Dikkat Çekiyor

Plastik parçacıkları vücudumuza nasıl sızıyor?`,
    excerptAr: 'أبرز ما تم مناقشته في مؤتمر المناخ حول البلاستيك والاستدامة',
    excerptEn: 'Key discussions at the climate conference about plastic and sustainability',
    excerptTr: 'İklim konferansında plastik ve sürdürülebilirlik hakkındaki önemli tartışmalar',
    image: '/uploads/news/article-cop27.jpg',
    tags: ['COP27', 'المناخ', 'البلاستيك', 'الاستدامة'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'النفايات البلاستيكية خطر متزايد وفرصة ضائعة',
    titleEn: 'Plastic Waste: Growing Danger and Lost Opportunity',
    titleTr: 'Plastik Atıklar: Artan Tehlike ve Kaçırılan Fırsat',
    slug: 'plastic-waste-danger-opportunity',
    contentAr: `النفايات البلاستيكية خطر متزايد، وفرصة ضائعة

برزت منطقة جنوب شرق آسيا بوصفها نقطة ساخنة للتلوث بالمواد البلاستيكية. ففي عام 2021، أنتجت المنطقة ما يقدر بنحو 65.5 مليون طن من النفايات البلاستيكية.

التحديات:
- زيادة الإنتاج العالمي للبلاستيك
- ضعف البنية التحتية لإعادة التدوير
- التلوث البحري

الفرص:
- صناعة إعادة التدوير
- الابتكار في المواد البديلة
- الاقتصاد الدائري`,
    contentEn: `Plastic Waste: Growing Danger and Lost Opportunity

Southeast Asia has emerged as a hotspot for plastic pollution. In 2021, the region produced an estimated 65.5 million tons of plastic waste.

Challenges:
- Increasing global plastic production
- Weak recycling infrastructure
- Marine pollution

Opportunities:
- Recycling industry
- Innovation in alternative materials
- Circular economy`,
    contentTr: `Plastik Atıklar: Artan Tehlike ve Kaçırılan Fırsat

Güneydoğu Asya, plastik kirliliği için bir sıcak nokta olarak ortaya çıktı.`,
    excerptAr: 'تحليل لمشكلة النفايات البلاستيكية والفرص الاقتصادية المتاحة',
    excerptEn: 'Analysis of plastic waste problem and available economic opportunities',
    excerptTr: 'Plastik atık sorunu ve mevcut ekonomik fırsatların analizi',
    image: '/uploads/news/article-plastic-waste.jpg',
    tags: ['النفايات', 'إعادة التدوير', 'البيئة', 'الاستدامة'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'استخدام زجاجات البلاستيك مرة واحدة فقط',
    titleEn: 'Using Plastic Bottles Only Once',
    titleTr: 'Plastik Şişeleri Sadece Bir Kez Kullanmak',
    slug: 'plastic-bottles-single-use',
    contentAr: `استخدام زجاجات البلاستيك مرة واحدة فقط!

ما مدى خطورة إعادة استخدام زجاجات المياه للشرب أكثر من مرة؟

تصنع معظم زجاجات المياه من البلاستيك PET وهو مصمم للاستخدام مرة واحدة فقط. إعادة الاستخدام قد تؤدي إلى:
- تسرب المواد الكيميائية
- نمو البكتيريا
- تدهور جودة البلاستيك

النصائح:
- استخدم زجاجات قابلة لإعادة الاستخدام
- تجنب تعريض الزجاجات للحرارة
- استبدل الزجاجات بانتظام`,
    contentEn: `Using Plastic Bottles Only Once!

How dangerous is reusing water bottles for drinking more than once?

Most water bottles are made from PET plastic, which is designed for single use only. Reusing may lead to:
- Chemical leakage
- Bacterial growth
- Plastic quality deterioration

Tips:
- Use reusable bottles
- Avoid exposing bottles to heat
- Replace bottles regularly`,
    contentTr: `Plastik Şişeleri Sadece Bir Kez Kullanmak!

Su şişelerini birden fazla kez kullanmak ne kadar tehlikeli?`,
    excerptAr: 'مخاطر إعادة استخدام زجاجات المياه البلاستيكية ونصائح للاستخدام الآمن',
    excerptEn: 'Dangers of reusing plastic water bottles and tips for safe use',
    excerptTr: 'Plastik su şişelerini yeniden kullanmanın tehlikeleri ve güvenli kullanım ipuçları',
    image: '/uploads/news/article-plastic-bottles.jpg',
    tags: ['زجاجات', 'صحة', 'PET', 'نصائح'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'ما هو بلاستيك PET المستخدم في العديد من الصناعات',
    titleEn: 'What is PET Plastic Used in Many Industries',
    titleTr: 'Birçok Sektörde Kullanılan PET Plastik Nedir',
    slug: 'what-is-pet-plastic',
    contentAr: `ما هو بلاستيك PET المستخدم في العديد من الصناعات

ينقسم عالم البلاستيك إلى أنواع مختلفة من المواد الصناعية. من أشهر هذه الأنواع بلاستيك PET (البولي إيثيلين تيريفثاليت).

خصائص بلاستيك PET:
- شفافية عالية
- خفيف الوزن
- مقاوم للكسر
- قابل لإعادة التدوير

استخدامات PET:
- تعبئة المياه والمشروبات
- حاويات الأطعمة
- الألياف الصناعية
- التغليف الصناعي`,
    contentEn: `What is PET Plastic Used in Many Industries

The world of plastic is divided into different types of industrial materials. One of the most famous types is PET plastic (Polyethylene Terephthalate).

Properties of PET Plastic:
- High transparency
- Lightweight
- Shatter-resistant
- Recyclable

Uses of PET:
- Water and beverage packaging
- Food containers
- Synthetic fibers
- Industrial packaging`,
    contentTr: `Birçok Sektörde Kullanılan PET Plastik Nedir

Plastik dünyası farklı endüstriyel malzeme türlerine ayrılır.`,
    excerptAr: 'تعرف على بلاستيك PET وخصائصه واستخداماته المتعددة في الصناعة',
    excerptEn: 'Learn about PET plastic, its properties and multiple industrial uses',
    excerptTr: 'PET plastik, özellikleri ve çoklu endüstriyel kullanımları hakkında bilgi edinin',
    image: '/uploads/news/article-pet-plastic.jpg',
    tags: ['PET', 'بلاستيك', 'صناعة', 'تعبئة'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'ما هي ماكينة الاستعدال',
    titleEn: 'What is an Unscrambler Machine',
    titleTr: 'Düzenleme Makinesi Nedir',
    slug: 'what-is-unscrambler-machine',
    contentAr: `ما هي ماكينة الاستعدال

ماكينة الاستعدال وتسمى أيضاً آلة ترتيب العبوات، هي معدة صناعية مهمة في خطوط الإنتاج والتعبئة.

وظيفة ماكينة الاستعدال:
تقوم ماكينة الاستعدال بترتيب العبوات الفارغة (زجاجات، عبوات) بشكل منظم على السيور الناقلة لتجهيزها لعملية التعبئة.

مميزات ماكينات الاستعدال من العتال:
- سرعة عالية في الأداء
- تصميم موفر للطاقة
- سهولة الصيانة
- توافق مع مختلف أحجام العبوات`,
    contentEn: `What is an Unscrambler Machine

An unscrambler machine, also called a bottle orienter, is important industrial equipment in production and filling lines.

Function of Unscrambler Machine:
The unscrambler machine arranges empty containers (bottles, jars) in an organized manner on conveyor belts to prepare them for the filling process.

Features of Al-Attal Unscrambler Machines:
- High-speed performance
- Energy-efficient design
- Easy maintenance
- Compatible with various container sizes`,
    contentTr: `Düzenleme Makinesi Nedir

Düzenleme makinesi, üretim ve dolum hatlarında önemli bir endüstriyel ekipmandır.`,
    excerptAr: 'تعرف على ماكينة الاستعدال ودورها الأساسي في خطوط الإنتاج والتعبئة',
    excerptEn: 'Learn about the unscrambler machine and its essential role in production lines',
    excerptTr: 'Düzenleme makinesi ve üretim hatlarındaki temel rolü hakkında bilgi edinin',
    image: '/uploads/news/article-unscrambler.jpg',
    tags: ['ماكينات', 'استعدال', 'خطوط إنتاج', 'تعبئة'],
    author: 'فريق العتال',
  },
  {
    id: `news-${randomUUID().slice(0, 8)}`,
    titleAr: 'ما هي ماكينات نفخ PET وكيف تعمل',
    titleEn: 'What are PET Blow Molding Machines and How Do They Work',
    titleTr: 'PET Şişirme Makineleri Nedir ve Nasıl Çalışır',
    slug: 'pet-blow-molding-machines',
    contentAr: `ما هي ماكينات نفخ PET وكيف تعمل

في البداية وقبل أنّ نتعرف على ماكينات نفخ PET يجب أنّ نتعرف على عملية نفخ البلاستيك.

عملية نفخ البلاستيك:
هي عملية تصنيع تستخدم لإنتاج أجزاء بلاستيكية مجوفة مثل الزجاجات والحاويات.

مراحل العملية:
1. تسخين البريفورم
2. وضعه في القالب
3. نفخ الهواء المضغوط
4. تبريد المنتج النهائي

أنواع ماكينات نفخ PET:
- ماكينات النفخ الخطية
- ماكينات النفخ الدوارة
- ماكينات النفخ المتكاملة`,
    contentEn: `What are PET Blow Molding Machines and How Do They Work

First, before we learn about PET blow molding machines, we need to understand the plastic blow molding process.

Plastic Blow Molding Process:
It is a manufacturing process used to produce hollow plastic parts such as bottles and containers.

Process Stages:
1. Heating the preform
2. Placing it in the mold
3. Blowing compressed air
4. Cooling the final product

Types of PET Blow Molding Machines:
- Linear blow molding machines
- Rotary blow molding machines
- Integrated blow molding machines`,
    contentTr: `PET Şişirme Makineleri Nedir ve Nasıl Çalışır

İlk olarak, PET şişirme makinelerini öğrenmeden önce plastik şişirme sürecini anlamamız gerekiyor.`,
    excerptAr: 'شرح مفصل لماكينات نفخ PET ومراحل عملها وأنواعها المختلفة',
    excerptEn: 'Detailed explanation of PET blow molding machines, their operation stages and types',
    excerptTr: 'PET şişirme makineleri, çalışma aşamaları ve türleri hakkında detaylı açıklama',
    image: '/uploads/news/article-pet-plastic.jpg', // Reuse pet image since no specific image
    tags: ['ماكينات نفخ', 'PET', 'تصنيع', 'زجاجات'],
    author: 'فريق العتال',
  },
];

async function main() {
  console.log('Starting to seed articles...');

  for (const article of articles) {
    try {
      await prisma.news.create({
        data: {
          id: article.id,
          titleAr: article.titleAr,
          titleEn: article.titleEn,
          titleTr: article.titleTr,
          slug: article.slug,
          contentAr: article.contentAr,
          contentEn: article.contentEn,
          contentTr: article.contentTr,
          excerptAr: article.excerptAr,
          excerptEn: article.excerptEn,
          excerptTr: article.excerptTr,
          image: article.image,
          author: article.author,
          isActive: true,
          isFeatured: false,
          tags: article.tags,
          seoKeywords: article.tags,
        },
      });
      console.log(`✅ Added: ${article.titleAr}`);
    } catch (error) {
      console.error(`❌ Error adding ${article.titleAr}:`, error);
    }
  }

  console.log('✅ All articles seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
