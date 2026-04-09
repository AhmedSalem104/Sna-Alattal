// Translate specification keys to Arabic
const specKeyTranslations: Record<string, string> = {
  model: 'الموديل',
  capacity: 'السعة',
  system: 'النظام',
  material: 'المادة',
  control: 'التحكم',
  certifications: 'الشهادات',
  bottleType: 'نوع الزجاجة',
  bottleDiameter: 'قطر الزجاجة',
  bottleHeight: 'ارتفاع الزجاجة',
  airPressure: 'ضغط الهواء',
  washingMedium: 'وسيط الغسيل',
  rinsingPressure: 'ضغط الشطف',
  power: 'القدرة',
  dimensions: 'الأبعاد',
  height: 'الارتفاع',
  weight: 'الوزن',
  voltage: 'الجهد',
  frequency: 'التردد',
  cavities: 'التجاويف',
  maxCapacity: 'أقصى سعة',
  maxVolume: 'أقصى حجم',
  speed: 'السرعة',
  type: 'النوع',
  compatibility: 'التوافق',
  bottleSize: 'حجم الزجاجة',
  motorPower: 'قدرة المحرك',
  diameter: 'القطر',
};

export function translateSpecKey(key: string, locale: string): string {
  if (locale === 'ar' && specKeyTranslations[key]) {
    return specKeyTranslations[key];
  }
  return key.replace(/_/g, ' ');
}
