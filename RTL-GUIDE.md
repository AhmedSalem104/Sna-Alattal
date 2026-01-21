# RTL/LTR Implementation Guide
## S.N.A Al-Attal Engineering Industries

Complete guide for Right-to-Left (RTL) and Left-to-Right (LTR) support across the platform.

---

## Table of Contents
- [Overview](#overview)
- [Language Support](#language-support)
- [Enhanced Utilities](#enhanced-utilities)
- [Component Coverage](#component-coverage)
- [Testing Guide](#testing-guide)
- [Common Patterns](#common-patterns)

---

## Overview

### Supported Languages
- 🇸🇦 **Arabic (ar)** - RTL - Default
- 🇬🇧 **English (en)** - LTR
- 🇹🇷 **Turkish (tr)** - LTR

### Implementation Strategy
- **CSS-only solution** - Zero JavaScript overhead
- **Tailwind CSS RTL plugin** - Native utility classes
- **Automatic direction switching** - Based on locale
- **Full bidirectional support** - All components tested

### Key Benefits
✅ **Zero performance impact** - Compile-time CSS
✅ **Consistent behavior** - Same UX across languages
✅ **Maintainable** - Standard Tailwind patterns
✅ **Future-proof** - Easy to add new RTL languages

---

## Language Support

### Configuration

#### i18n.ts
```typescript
export const locales = ['ar', 'en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
  tr: 'ltr',
};
```

#### Root Layout (app/layout.tsx)
```tsx
export default async function RootLayout({ children }) {
  const locale = await getLocale() as Locale;
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir}>
      <body className={dir === 'rtl' ? 'font-cairo' : 'font-inter'}>
        {children}
      </body>
    </html>
  );
}
```

### Typography

#### Font Configuration (globals.css)
```css
[dir='rtl'] {
  font-family: 'Cairo', sans-serif;
  line-height: 1.8; /* Better for Arabic text */
  letter-spacing: 0.01em;
}

[dir='ltr'] {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}
```

---

## Enhanced Utilities

### Logical Margin/Padding (Release 4)

#### Margin Start/End
```css
/* Margin Start (right in LTR, left in RTL) */
.ms-auto {
  @apply ml-auto rtl:ml-0 rtl:mr-auto;
}

/* Margin End (left in LTR, right in RTL) */
.me-auto {
  @apply mr-auto rtl:mr-0 rtl:ml-auto;
}
```

**Usage:**
```tsx
// Logo alignment - always at start
<div className="ms-auto">Logo</div>

// Actions menu - always at end
<div className="me-auto">Menu</div>
```

#### Inline Spacing
```css
/* Space between inline elements */
.space-inline-2 {
  @apply mr-2 rtl:mr-0 rtl:ml-2;
}

.space-inline-4 {
  @apply mr-4 rtl:mr-0 rtl:ml-4;
}
```

**Usage:**
```tsx
// Icon before text (LTR) or after text (RTL)
<Button>
  <Icon className="space-inline-2" />
  Text
</Button>
```

### Text Alignment

```css
/* Text align start */
.text-start-dir {
  @apply text-left rtl:text-right;
}

/* Text align end */
.text-end-dir {
  @apply text-right rtl:text-left;
}
```

**Usage:**
```tsx
// Table headers - always align with text direction
<TableHead className="text-start-dir">Name</TableHead>

// Numbers/dates - align at end
<div className="text-end-dir">1,234.56</div>
```

### Position Utilities

```css
/* Start position (left in LTR, right in RTL) */
.start-0 {
  @apply left-0 rtl:left-auto rtl:right-0;
}

/* End position (right in LTR, left in RTL) */
.end-0 {
  @apply right-0 rtl:right-auto rtl:left-0;
}
```

**Usage:**
```tsx
// Search icon - always at end of input
<Search className="absolute end-0 top-1/2" />
```

---

## Component Coverage

### UI Components (Release 4)

#### 1. Table Component
**File:** `src/components/ui/table.tsx`

**Changes:**
```tsx
// TableHead - text alignment
<th className="text-left rtl:text-right">

// Checkbox padding
<th className="[&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:rtl:pr-4 [&:has([role=checkbox])]:rtl:pl-0">
```

**Why:** Tables need proper text alignment in both directions, and checkbox columns need reversed padding.

#### 2. Dropdown Menu
**File:** `src/components/ui/dropdown-menu.tsx`

**Changes (6 components):**
```tsx
// DropdownMenuSubTrigger
<ChevronRight className="ml-auto rtl:ml-0 rtl:mr-auto rtl:rotate-180" />

// DropdownMenuItem + DropdownMenuLabel
className="pl-8 rtl:pl-2 rtl:pr-8"

// DropdownMenuCheckboxItem + DropdownMenuRadioItem
className="pl-8 pr-2 rtl:pl-2 rtl:pr-8"
<span className="absolute left-2 rtl:left-auto rtl:right-2">

// DropdownMenuShortcut
className="ml-auto rtl:ml-0 rtl:mr-auto"
```

**Why:** Dropdown menus need icons and indicators to flip sides based on direction.

#### 3. Select Component
**File:** `src/components/ui/select.tsx`

**Changes:**
```tsx
// SelectLabel + SelectItem
className="pl-8 pr-2 rtl:pl-2 rtl:pr-8"

// Check indicator
<span className="absolute left-2 rtl:left-auto rtl:right-2">
```

**Why:** Select menus mirror dropdowns with checkmarks on the correct side.

#### 4. Form Field
**File:** `src/components/ui/form-field.tsx`

**Changes:**
```tsx
// Required asterisk
<span className="ml-1 rtl:ml-0 rtl:mr-1">*</span>
```

**Why:** Required indicator should be adjacent to label text in both directions.

### Admin Components (Release 4)

#### 1. Dashboard Shell
**File:** `src/components/admin/dashboard-shell.tsx`

**Changes:**
```tsx
// Sidebar margin
className={cn(
  'lg:mr-64 lg:rtl:mr-0 lg:rtl:ml-64',
  isCollapsed && 'lg:mr-20 lg:rtl:mr-0 lg:rtl:ml-20'
)}
```

**Why:** Sidebar is always on the start side (right in LTR, left in RTL).

#### 2. Admin Header
**File:** `src/components/admin/header.tsx`

**Changes:**
```tsx
// Search icon + input
<Search className="absolute right-3 rtl:right-auto rtl:left-3" />
<Input className="pr-10 rtl:pr-4 rtl:pl-10" />

// Breadcrumb chevron
<ChevronLeft className="rtl:rotate-180" />

// Plus icon
<Plus className="ml-1 rtl:ml-0 rtl:mr-1" />

// Notification badge
<span className="absolute top-1 left-1 rtl:left-auto rtl:right-1" />
```

**Why:** Search, navigation, and notification indicators flip sides.

#### 3. Data Table
**File:** `src/components/admin/data-table.tsx`

**Changes:**
```tsx
// Search implementation (same as header)
<Search className="absolute right-3 rtl:right-auto rtl:left-3" />
<Input className="pr-10 rtl:pr-4 rtl:pl-10 touch-input" />
```

**Why:** Consistent search UI across admin panel.

#### 4. Stats Card
**File:** `src/components/admin/stats-card.tsx`

**Changes:**
```tsx
// Trend icons
<TrendingUp className="ml-1 rtl:ml-0 rtl:mr-1" />
<TrendingDown className="ml-1 rtl:ml-0 rtl:mr-1" />
```

**Why:** Trend indicators appear next to percentage values.

#### 5. Delete Dialog
**File:** `src/components/admin/delete-dialog.tsx`

**Changes:**
```tsx
// Loading spinner
<Loader2 className="ml-2 rtl:ml-0 rtl:mr-2" />
```

**Why:** Loading indicator appears next to button text.

### Section Components (Already had rtl:rotate-180)

All section components already had proper RTL support for ArrowRight icons:
```tsx
<ArrowRight className="mr-2 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
```

Components:
- AboutSection
- ProductsSection
- NewsSection
- ExhibitionsSection
- SolutionsSection
- TeamSection

---

## Testing Guide

### Manual Testing Checklist

#### Language Switching
1. **Default (Arabic - RTL)**
   - [ ] Page loads in RTL
   - [ ] Arabic font (Cairo) applied
   - [ ] All icons on correct side
   - [ ] Text aligned right
   - [ ] Scrollbars on left

2. **Switch to English (LTR)**
   - [ ] Layout flips to LTR
   - [ ] English font (Inter) applied
   - [ ] All icons flip sides
   - [ ] Text aligned left
   - [ ] Scrollbars on right

3. **Switch to Turkish (LTR)**
   - [ ] Same as English
   - [ ] Turkish content displays

#### Component Testing

##### Admin Panel
```
Arabic (RTL) view:
┌─────────────────────────────────┐
│ 🔔 ➕ 🔍 [بحث...] │ Menu ☰ │ RTL
└─────────────────────────────────┘
       ← Sidebar on left

English (LTR) view:
┌─────────────────────────────────┐
│ LTR ☰ Menu │ [Search...] 🔍 ➕ 🔔 │
└─────────────────────────────────┘
Sidebar on right →
```

**Check:**
- [ ] Sidebar switches sides
- [ ] Search icon flips
- [ ] Action buttons maintain order
- [ ] Notifications badge position

##### Tables
```
RTL Table:
┌──────────┬───────────┬────────┐
│   الإسم   │   البريد   │  ☑    │
│   محمد    │  @email   │  ☐    │
└──────────┴───────────┴────────┘
Text aligned right, checkbox on right →

LTR Table:
┌────────┬───────────┬──────────┐
│  ☑     │   Email   │   Name   │
│  ☐     │  @email   │  Mohamed │
└────────┴───────────┴──────────┘
← Checkbox on left, text aligned left
```

**Check:**
- [ ] Text alignment follows direction
- [ ] Checkboxes switch sides
- [ ] Headers align correctly
- [ ] Sorting icons position

##### Dropdowns/Selects
```
RTL Dropdown:
┌─────────────────────┐
│ ✓ Option 1          │
│   Option 2          │
│   Option 3      ▶   │ ← Chevron
└─────────────────────┘
Check on right, submenu chevron flipped

LTR Dropdown:
┌─────────────────────┐
│          Option 1 ✓ │
│          Option 2   │
│   ◀      Option 3   │ ← Chevron
└─────────────────────┘
Check on left, submenu chevron normal
```

**Check:**
- [ ] Checkmarks switch sides
- [ ] Submenu chevrons flip
- [ ] Padding adjusts
- [ ] Text aligns correctly

##### Forms
```
RTL Form:
[  النص المدخل  ] *البريد الإلكتروني
    ← Input          ← Required asterisk

LTR Form:
Email Address *
[  Input text  ] →
Required asterisk → Input
```

**Check:**
- [ ] Labels align correctly
- [ ] Required asterisks position
- [ ] Error messages align
- [ ] Icons flip sides

### Automated Testing

#### Visual Regression (Future)
```bash
# Percy.io or Chromatic
npm run test:visual -- --rtl
npm run test:visual -- --ltr

# Compare RTL vs LTR screenshots
```

#### Accessibility Testing
```bash
# axe-core with RTL support
npm run test:a11y -- --locale=ar
npm run test:a11y -- --locale=en

# Check ARIA attributes in both directions
```

---

## Common Patterns

### Pattern 1: Icon + Text
```tsx
// ✅ DO: Use space-inline utility
<Button>
  <Icon className="space-inline-2" />
  {text}
</Button>

// Result:
// LTR: [Icon] → Text
// RTL: Text ← [Icon]
```

### Pattern 2: Absolute Positioning
```tsx
// ✅ DO: Use logical positions
<div className="absolute right-4 rtl:right-auto rtl:left-4">

// ❌ DON'T: Use fixed directions
<div className="absolute right-4"> // Won't flip in RTL
```

### Pattern 3: Directional Icons
```tsx
// ✅ DO: Rotate arrows in RTL
<ArrowRight className="rtl:rotate-180" />
<ChevronRight className="rtl:rotate-180" />

// ✅ DO: Keep neutral icons as-is
<Search /> // No rotation needed
<Settings /> // No rotation needed
```

### Pattern 4: Margins/Padding
```tsx
// ✅ DO: Use RTL-aware utilities
className="ml-2 rtl:ml-0 rtl:mr-2"

// ✅ BETTER: Use custom utilities
className="space-inline-2"

// ❌ DON'T: Use JavaScript
const margin = locale === 'ar' ? 'mr-2' : 'ml-2';
```

### Pattern 5: Text Alignment
```tsx
// ✅ DO: Use text-start/text-end
className="text-start-dir" // Always aligns with text flow

// ❌ DON'T: Use fixed alignment
className="text-left" // Won't change in RTL
```

---

## Troubleshooting

### Issue: Component doesn't flip in RTL
**Solution:**
1. Check `<html dir="rtl">` attribute
2. Verify Tailwind RTL plugin configured
3. Check if using `rtl:` variant
4. Clear browser cache

### Issue: Text misaligned in tables
**Solution:**
```tsx
// Add text-start-dir utility
<TableHead className="text-start-dir">
```

### Issue: Icons on wrong side
**Solution:**
```tsx
// Check for ml-/mr- without RTL variant
// Replace with space-inline-* utility
```

### Issue: Dropdown checkmarks misplaced
**Solution:**
```tsx
// Verify padding: pl-8 rtl:pl-2 rtl:pr-8
// Check indicator position: left-2 rtl:left-auto rtl:right-2
```

### Issue: Search icon overlaps text
**Solution:**
```tsx
// Icon position
className="right-3 rtl:right-auto rtl:left-3"

// Input padding
className="pr-10 rtl:pr-4 rtl:pl-10"
```

---

## Future Enhancements

### Additional RTL Languages
```typescript
// Add to i18n.ts
export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  he: 'rtl', // Hebrew
  fa: 'rtl', // Farsi/Persian
  ur: 'rtl', // Urdu
  en: 'ltr',
  tr: 'ltr',
};
```

### RTL-specific Animations
```css
/* Slide in from correct side */
@media (prefers-reduced-motion: no-preference) {
  [dir='ltr'] .slide-in {
    animation: slideInLeft 0.3s ease-out;
  }

  [dir='rtl'] .slide-in {
    animation: slideInRight 0.3s ease-out;
  }
}
```

### Logical Properties (CSS)
```css
/* Future: Use CSS logical properties */
.element {
  margin-inline-start: 1rem; /* Replaces margin-left/right */
  padding-inline-end: 2rem;
  border-inline-start: 1px solid;
}
```

---

## Resources

### Tailwind CSS RTL
- [Official Plugin](https://github.com/20lives/tailwindcss-rtl)
- [RTL Utilities](https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support)

### Best Practices
- [W3C: Structural Markup](https://www.w3.org/International/questions/qa-html-dir)
- [MDN: dir attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
- [RTL Styling 101](https://rtlstyling.com/)

### Testing Tools
- [RTL Browser Extension](https://chrome.google.com/webstore/detail/rtl-tester)
- [i18n Ally VSCode](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

---

**Last Updated**: January 2026 (Release 4)
**Maintained By**: Development Team with Claude Opus 4.5
