import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating machines with new images...');

  // Update 1C 20L 600PH
  await prisma.product.updateMany({
    where: { slug: 'pet-blow-molding-1c-20l' },
    data: {
      images: JSON.stringify([
        '/uploads/machines/blow-1c-20l-photo.jpg',
        '/uploads/machines/q 1c 20 liter ar.png',
        '/uploads/machines/q 1c 20 liter en.png',
        '/uploads/machines/4cavity blowing machine render (2)_Beauty.jpg'
      ]),
      descriptionAr: `أحد منتجات شركة العتال والتي تصل طاقتها الإنتاجية القصوى إلى 600 زجاجة / الساعة.
موتور سيرفو للتحكم في سرعة التغذية بمعادلة توقيت أوتوماتيكية وفقاً لأي تغيير يحدث على أوقات الماكينة.
الماكينة مجهزة بنظام لاستعادة الهواء المستخدم في النفخ إلى زجاجة الضغط المنخفض.
كذلك مجهزة بحساس ليزر لقياس جاهزية البريفورم لمرحلة الشد والنفخ.
الماكينة مجهزة بوحدة تحكم بشاشة تعمل باللمس بثلاث لغات (العربية والإنجليزية والتركية).
ضبط مروحة الفرن للحفاظ على استقرار درجة حرارة الفرن.
مستشعر ضغط رقمي للتحكم في وحدة الهواء المضغوط.`,
      descriptionEn: `One of the products of AL-ATTAL company which its max production capacity is 600 bottle per hour.
Servo motor to control feed speed with timing equation automatically according to any change occurs over the machine times.
The machine is equipped with a system to recover the air used in blowing back to the low pressure bottle.
Also equipped with laser sensor to measure the perform readiness to the blowing stretch stage.
The machine is equipped with touch screen 3 languages controlling unit (Arabic, English and Turkish).
Adjust the oven fan to maintain the stability of the oven temperature.
Digital pressure sensor to control the compressed air unit.`,
      descriptionTr: `Saatte maksimum 600 şişe üretim kapasitesine sahip AL-ATTAL şirketi ürünlerinden biridir.
Makine sürelerinde meydana gelen herhangi bir değişikliğe göre otomatik zamanlama denklemiyle besleme hızını kontrol etmek için servo motor.
Makine, şişirmede kullanılan havayı düşük basınçlı şişeye geri kazanmak için bir sistemle donatılmıştır.
Ayrıca preformun şişirme germe aşamasına hazırlığını ölçmek için lazer sensörle donatılmıştır.
Makine 3 dilli dokunmatik ekran kontrol ünitesiyle donatılmıştır (Arapça, İngilizce ve Türkçe).
Fırın sıcaklığının stabilitesini korumak için fırın fanını ayarlayın.
Basınçlı hava ünitesini kontrol etmek için dijital basınç sensörü.`,
      features: JSON.stringify([
        'موتور سيرفو للتحكم في سرعة التغذية',
        'نظام استعادة الهواء',
        'حساس ليزر لقياس جاهزية البريفورم',
        'شاشة تحكم بثلاث لغات',
        'ضبط مروحة الفرن',
        'مستشعر ضغط رقمي'
      ]),
      specifications: JSON.stringify({
        capacity: '600 زجاجة/ساعة',
        cavities: '1',
        maxVolume: '20 لتر',
        model: 'SE121LA',
        controlSystem: 'PLC + شاشة لمس',
        languages: 'عربي - إنجليزي - تركي'
      })
    }
  });
  console.log('✅ Updated 1C 20L 600PH');

  // Update 2C 11L 2400PH
  await prisma.product.updateMany({
    where: { slug: 'pet-blow-molding-2c-11l' },
    data: {
      images: JSON.stringify([
        '/uploads/machines/blow-2c-11l-photo.jpg',
        '/uploads/machines/q 2c 11 liter en.png',
        '/uploads/machines/q 2c 11liter ar.png',
        '/uploads/machines/BLOWING MACHINE INTERNAL PIC.jpg'
      ]),
      descriptionAr: `أحد منتجات شركة العتال والتي تصل طاقتها الإنتاجية القصوى إلى 2400 زجاجة / الساعة.
موتور سيرفو للتحكم في سرعة التغذية بمعادلة توقيت أوتوماتيكية وفقاً لأي تغيير يحدث على أوقات الماكينة.
الماكينة مجهزة بنظام لاستعادة الهواء المستخدم في النفخ إلى زجاجة الضغط المنخفض.
كذلك مجهزة بحساس ليزر لقياس جاهزية البريفورم لمرحلة الشد والنفخ.
الماكينة مجهزة بوحدة تحكم بشاشة تعمل باللمس بثلاث لغات (العربية والإنجليزية والتركية).
ضبط مروحة الفرن للحفاظ على استقرار درجة حرارة الفرن.
مستشعر ضغط رقمي للتحكم في وحدة الهواء المضغوط.`,
      descriptionEn: `One of the products of AL-ATTAL company which its max production capacity is 2400 bottle per hour.
Servo motor to control feed speed with timing equation automatically according to any change occurs over the machine times.
The machine is equipped with a system to recover the air used in blowing back to the low pressure bottle.
Also equipped with laser sensor to measure the perform readiness to the blowing stretch stage.
The machine is equipped with touch screen 3 languages controlling unit (Arabic, English and Turkish).
Adjust the oven fan to maintain the stability of the oven temperature.
Digital pressure sensor to control the compressed air unit.`,
      descriptionTr: `Saatte maksimum 2400 şişe üretim kapasitesine sahip AL-ATTAL şirketi ürünlerinden biridir.
Makine sürelerinde meydana gelen herhangi bir değişikliğe göre otomatik zamanlama denklemiyle besleme hızını kontrol etmek için servo motor.
Makine, şişirmede kullanılan havayı düşük basınçlı şişeye geri kazanmak için bir sistemle donatılmıştır.
Ayrıca preformun şişirme germe aşamasına hazırlığını ölçmek için lazer sensörle donatılmıştır.
Makine 3 dilli dokunmatik ekran kontrol ünitesiyle donatılmıştır.`,
      features: JSON.stringify([
        'موتور سيرفو للتحكم في سرعة التغذية',
        'نظام استعادة الهواء',
        'حساس ليزر لقياس جاهزية البريفورم',
        'شاشة تحكم بثلاث لغات',
        'تجويفان للإنتاج السريع',
        'مستشعر ضغط رقمي'
      ]),
      specifications: JSON.stringify({
        capacity: '2400 زجاجة/ساعة',
        cavities: '2',
        maxVolume: '11 لتر',
        model: 'SE221LA',
        controlSystem: 'PLC + شاشة لمس',
        languages: 'عربي - إنجليزي - تركي'
      })
    }
  });
  console.log('✅ Updated 2C 11L 2400PH');

  // Update 2C 4000PH
  await prisma.product.updateMany({
    where: { slug: 'pet-blow-molding-2c-4000ph' },
    data: {
      images: JSON.stringify([
        '/uploads/machines/blow-2c-4000ph-photo.jpg',
        '/uploads/machines/q 2c en.png',
        '/uploads/machines/q 2c ar.png',
        '/uploads/machines/BLOWING MACHINE INTERNAL PIC 2.jpg'
      ]),
      descriptionAr: `أحد منتجات شركة العتال والتي تصل طاقتها الإنتاجية القصوى إلى 4000 زجاجة / الساعة.
موتور سيرفو للتحكم في سرعة التغذية بمعادلة توقيت أوتوماتيكية وفقاً لأي تغيير يحدث على أوقات الماكينة.
الماكينة مجهزة بنظام لاستعادة الهواء المستخدم في النفخ إلى زجاجة الضغط المنخفض.
كذلك مجهزة بحساس ليزر لقياس جاهزية البريفورم لمرحلة الشد والنفخ.
الماكينة مجهزة بوحدة تحكم بشاشة تعمل باللمس بثلاث لغات (العربية والإنجليزية والتركية).
ضبط مروحة الفرن للحفاظ على استقرار درجة حرارة الفرن.
مستشعر ضغط رقمي للتحكم في وحدة الهواء المضغوط.`,
      descriptionEn: `One of the products of AL-ATTAL company which its max production capacity is 4000 bottle per hour.
Servo motor to control feed speed with timing equation automatically according to any change occurs over the machine times.
The machine is equipped with a system to recover the air used in blowing back to the low pressure bottle.
Also equipped with laser sensor to measure the perform readiness to the blowing stretch stage.
The machine is equipped with touch screen 3 languages controlling unit (Arabic, English and Turkish).
Adjust the oven fan to maintain the stability of the oven temperature.
Digital pressure sensor to control the compressed air unit.`,
      descriptionTr: `Saatte maksimum 4000 şişe üretim kapasitesine sahip AL-ATTAL şirketi ürünlerinden biridir.`,
      features: JSON.stringify([
        'موتور سيرفو للتحكم في سرعة التغذية',
        'نظام استعادة الهواء',
        'حساس ليزر لقياس جاهزية البريفورم',
        'شاشة تحكم بثلاث لغات',
        'تجويفان للإنتاج المتوسط',
        'مستشعر ضغط رقمي'
      ]),
      specifications: JSON.stringify({
        capacity: '4000 زجاجة/ساعة',
        cavities: '2',
        model: 'SE221A',
        controlSystem: 'PLC + شاشة لمس',
        languages: 'عربي - إنجليزي - تركي'
      })
    }
  });
  console.log('✅ Updated 2C 4000PH');

  // Update 4C 8000PH
  await prisma.product.updateMany({
    where: { slug: 'pet-blow-molding-4c-8000ph' },
    data: {
      images: JSON.stringify([
        '/uploads/machines/blow-4c-8000ph-photo.jpg',
        '/uploads/machines/q 4c en.png',
        '/uploads/machines/q 4c ar.png',
        '/uploads/machines/4 cavityBeauty.jpg',
        '/uploads/machines/4 cavity Albedo.jpg'
      ]),
      descriptionAr: `أحد منتجات شركة العتال والتي تصل طاقتها الإنتاجية القصوى إلى 8000 زجاجة / الساعة.
موتور سيرفو للتحكم في سرعة التغذية بمعادلة توقيت أوتوماتيكية وفقاً لأي تغيير يحدث على أوقات الماكينة.
الماكينة مجهزة بنظام لاستعادة الهواء المستخدم في النفخ إلى زجاجة الضغط المنخفض.
كذلك مجهزة بحساس ليزر لقياس جاهزية البريفورم لمرحلة الشد والنفخ.
الماكينة مجهزة بوحدة تحكم بشاشة تعمل باللمس بثلاث لغات (العربية والإنجليزية والتركية).
ضبط مروحة الفرن للحفاظ على استقرار درجة حرارة الفرن.
مستشعر ضغط رقمي للتحكم في وحدة الهواء المضغوط.`,
      descriptionEn: `One of the products of AL-ATTAL company which its max production capacity is 8000 bottle per hour.
Servo motor to control feed speed with timing equation automatically according to any change occurs over the machine times.
The machine is equipped with a system to recover the air used in blowing back to the low pressure bottle.
Also equipped with laser sensor to measure the perform readiness to the blowing stretch stage.
The machine is equipped with touch screen 3 languages controlling unit (Arabic, English and Turkish).
Adjust the oven fan to maintain the stability of the oven temperature.
Digital pressure sensor to control the compressed air unit.`,
      descriptionTr: `Saatte maksimum 8000 şişe üretim kapasitesine sahip AL-ATTAL şirketi ürünlerinden biridir.`,
      features: JSON.stringify([
        'موتور سيرفو للتحكم في سرعة التغذية',
        'نظام استعادة الهواء',
        'حساس ليزر لقياس جاهزية البريفورم',
        'شاشة تحكم بثلاث لغات',
        '4 تجاويف للإنتاج الكبير',
        'مستشعر ضغط رقمي'
      ]),
      specifications: JSON.stringify({
        capacity: '8000 زجاجة/ساعة',
        cavities: '4',
        model: 'SE421A',
        controlSystem: 'PLC + شاشة لمس',
        languages: 'عربي - إنجليزي - تركي'
      })
    }
  });
  console.log('✅ Updated 4C 8000PH');

  // Update 8C 16000PH
  await prisma.product.updateMany({
    where: { slug: 'pet-blow-molding-8c-16000ph' },
    data: {
      images: JSON.stringify([
        '/uploads/machines/blow-8c-16000ph-photo.jpg',
        '/uploads/machines/q 8c en.png',
        '/uploads/machines/q 8c ar.png',
        '/uploads/machines/BLOWING MACHINE INTERNAL PIC 3.jpg'
      ]),
      descriptionAr: `أحد منتجات شركة العتال والتي تصل طاقتها الإنتاجية القصوى إلى 16000 زجاجة / الساعة.
موتور سيرفو للتحكم في سرعة التغذية بمعادلة توقيت أوتوماتيكية وفقاً لأي تغيير يحدث على أوقات الماكينة.
الماكينة مجهزة بنظام لاستعادة الهواء المستخدم في النفخ إلى زجاجة الضغط المنخفض.
كذلك مجهزة بحساس ليزر لقياس جاهزية البريفورم لمرحلة الشد والنفخ.
الماكينة مجهزة بوحدة تحكم بشاشة تعمل باللمس بثلاث لغات (العربية والإنجليزية والتركية).
ضبط مروحة الفرن للحفاظ على استقرار درجة حرارة الفرن.
مستشعر ضغط رقمي للتحكم في وحدة الهواء المضغوط.`,
      descriptionEn: `One of the products of AL-ATTAL company which its max production capacity is 16000 bottle per hour.
Servo motor to control feed speed with timing equation automatically according to any change occurs over the machine times.
The machine is equipped with a system to recover the air used in blowing back to the low pressure bottle.
Also equipped with laser sensor to measure the perform readiness to the blowing stretch stage.
The machine is equipped with touch screen 3 languages controlling unit (Arabic, English and Turkish).
Adjust the oven fan to maintain the stability of the oven temperature.
Digital pressure sensor to control the compressed air unit.`,
      descriptionTr: `Saatte maksimum 16000 şişe üretim kapasitesine sahip AL-ATTAL şirketi ürünlerinden biridir.`,
      features: JSON.stringify([
        'موتور سيرفو للتحكم في سرعة التغذية',
        'نظام استعادة الهواء',
        'حساس ليزر لقياس جاهزية البريفورم',
        'شاشة تحكم بثلاث لغات',
        '8 تجاويف للإنتاج الضخم',
        'مستشعر ضغط رقمي'
      ]),
      specifications: JSON.stringify({
        capacity: '16000 زجاجة/ساعة',
        cavities: '8',
        model: 'SE821A',
        controlSystem: 'PLC + شاشة لمس',
        languages: 'عربي - إنجليزي - تركي'
      })
    }
  });
  console.log('✅ Updated 8C 16000PH');

  // Add video slide
  const videoSlide = await prisma.slide.upsert({
    where: { id: 'slide-video-1' },
    update: {},
    create: {
      id: 'slide-video-1',
      titleAr: 'شاهد خط إنتاج كامل',
      titleEn: 'Watch Complete Production Line',
      titleTr: 'Tam Üretim Hattını İzleyin',
      subtitleAr: 'تصنيع محلي بجودة عالمية',
      subtitleEn: 'Local Manufacturing with Global Quality',
      subtitleTr: 'Küresel Kalitede Yerel Üretim',
      descriptionAr: 'شاهد كيف تعمل ماكيناتنا في خط إنتاج كامل',
      descriptionEn: 'Watch how our machines work in a complete production line',
      descriptionTr: 'Makinelerimizin tam üretim hattında nasıl çalıştığını izleyin',
      // Using YouTube thumbnail as image, video will be embedded
      image: 'https://img.youtube.com/vi/QRESUDZ3IdA/maxresdefault.jpg',
      buttonTextAr: 'شاهد الفيديو',
      buttonTextEn: 'Watch Video',
      buttonTextTr: 'Videoyu İzle',
      buttonLink: 'https://www.youtube.com/watch?v=QRESUDZ3IdA',
      isActive: true,
      order: 4,
    },
  });
  console.log('✅ Added video slide:', videoSlide.id);

  // Make sure all TV interviews are seeded
  const tvInterviewsData = [
    { id: 'tv-chairman-speech', titleAr: 'كلمة رئيس مجلس الادارة', titleEn: 'Chairman\'s Speech', titleTr: 'Yönetim Kurulu Başkanı Konuşması', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/tocPgV9Tx0k', thumbnail: 'https://img.youtube.com/vi/tocPgV9Tx0k/hqdefault.jpg', date: new Date('2024-12-01'), isActive: true, order: 1 },
    { id: 'tv-nahar-interview', titleAr: 'لقاء مع قناة النهار الفضائية', titleEn: 'Interview with Al-Nahar TV', titleTr: 'Al-Nahar TV Röportajı', channelAr: 'قناة النهار', channelEn: 'Al-Nahar TV', channelTr: 'Al-Nahar TV', videoUrl: 'https://www.youtube.com/embed/QhrfnGvOpY0', thumbnail: 'https://img.youtube.com/vi/QhrfnGvOpY0/hqdefault.jpg', date: new Date('2024-11-15'), isActive: true, order: 2 },
    { id: 'tv-sada-elbalad', titleAr: 'لقاء مع قناة صدى البلد', titleEn: 'Interview with Sada El-Balad TV', titleTr: 'Sada El-Balad TV Röportajı', channelAr: 'قناة صدى البلد', channelEn: 'Sada El-Balad TV', channelTr: 'Sada El-Balad TV', videoUrl: 'https://www.youtube.com/embed/C_6jIeM2ZBo', thumbnail: 'https://img.youtube.com/vi/C_6jIeM2ZBo/hqdefault.jpg', date: new Date('2024-11-01'), isActive: true, order: 3 },
    { id: 'tv-chairman-interview-2', titleAr: 'لقاء مع رئيس مجلس الادارة', titleEn: 'Interview with the Chairman', titleTr: 'Yönetim Kurulu Başkanı ile Röportaj', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/f4gL711XD0E', thumbnail: 'https://img.youtube.com/vi/f4gL711XD0E/hqdefault.jpg', date: new Date('2024-10-15'), isActive: true, order: 4 },
    { id: 'tv-marketing-director', titleAr: 'د. محمد الحيالي - مدير التسويق', titleEn: 'Dr. Mohamed Al-Hayali - Marketing Director', titleTr: 'Dr. Mohamed Al-Hayali - Pazarlama Müdürü', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/5tHeA8Jst2c', thumbnail: 'https://img.youtube.com/vi/5tHeA8Jst2c/hqdefault.jpg', date: new Date('2024-10-01'), isActive: true, order: 5 },
    { id: 'tv-company-overview', titleAr: 'شركة العتال للصناعات الهندسية', titleEn: 'Al-Attal Engineering Industries', titleTr: 'Al-Attal Mühendislik Sanayi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/TL5e5JzxrKk', thumbnail: 'https://img.youtube.com/vi/TL5e5JzxrKk/hqdefault.jpg', date: new Date('2024-09-15'), isActive: true, order: 6 },
    { id: 'tv-1', titleAr: 'العتال للصناعات الهندسية', titleEn: 'Al-Attal Engineering Industries', titleTr: 'Al-Attal Mühendislik Sanayi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/IO77jUIjmo0', thumbnail: 'https://img.youtube.com/vi/IO77jUIjmo0/hqdefault.jpg', date: new Date('2024-09-01'), isActive: true, order: 7 },
    { id: 'tv-machine-manufacturing', titleAr: 'صناعة ماكينات', titleEn: 'Machine Manufacturing', titleTr: 'Makine Üretimi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/m9BW7CySw1E', thumbnail: 'https://img.youtube.com/vi/m9BW7CySw1E/hqdefault.jpg', date: new Date('2024-08-15'), isActive: true, order: 8 },
    { id: 'tv-machine-review', titleAr: 'استعراض للمكن ومواصفاتها', titleEn: 'Machine Review & Specifications', titleTr: 'Makine İncelemesi ve Özellikleri', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/2mM6FK5itI8', thumbnail: 'https://img.youtube.com/vi/2mM6FK5itI8/hqdefault.jpg', date: new Date('2024-08-01'), isActive: true, order: 9 },
    { id: 'tv-assembly-team', titleAr: 'فريق تجميع الماكنة', titleEn: 'Machine Assembly Team', titleTr: 'Makine Montaj Ekibi', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/8xecIUHiDe4', thumbnail: 'https://img.youtube.com/vi/8xecIUHiDe4/hqdefault.jpg', date: new Date('2024-07-15'), isActive: true, order: 10 },
    { id: 'tv-water-lines', titleAr: 'خطوط انتاج مياه', titleEn: 'Water Production Lines', titleTr: 'Su Üretim Hatları', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/frW5lCz9ZmY', thumbnail: 'https://img.youtube.com/vi/frW5lCz9ZmY/hqdefault.jpg', date: new Date('2024-07-01'), isActive: true, order: 11 },
    { id: 'tv-complete-line', titleAr: 'خط انتاج كامل', titleEn: 'Complete Production Line', titleTr: 'Tam Üretim Hattı', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/QRESUDZ3IdA', thumbnail: 'https://img.youtube.com/vi/QRESUDZ3IdA/hqdefault.jpg', date: new Date('2024-06-15'), isActive: true, order: 12 },
    { id: 'tv-mineral-factory', titleAr: 'كيف تؤسس مصنع للمياه المعدنية', titleEn: 'How to Establish a Mineral Water Factory', titleTr: 'Maden Suyu Fabrikası Nasıl Kurulur', channelAr: 'العتال ميديا', channelEn: 'Al-Attal Media', channelTr: 'Al-Attal Medya', videoUrl: 'https://www.youtube.com/embed/FDo7bz96ujc', thumbnail: 'https://img.youtube.com/vi/FDo7bz96ujc/hqdefault.jpg', date: new Date('2024-06-01'), isActive: true, order: 13 },
    { id: 'tv-aljazeera', titleAr: 'لقاء مع قناة الجزيرة', titleEn: 'Interview with Al Jazeera', titleTr: 'Al Jazeera Röportajı', channelAr: 'قناة الجزيرة', channelEn: 'Al Jazeera', channelTr: 'Al Jazeera', videoUrl: 'https://www.youtube.com/embed/8JDKTl3n2OQ', thumbnail: 'https://img.youtube.com/vi/8JDKTl3n2OQ/hqdefault.jpg', date: new Date('2024-05-15'), isActive: true, order: 14 },
  ];

  for (const tvData of tvInterviewsData) {
    await prisma.tVInterview.upsert({
      where: { id: tvData.id },
      update: {},
      create: tvData,
    });
  }
  console.log('✅ TV Interviews updated:', tvInterviewsData.length);

  console.log('\n🎉 Database update completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
