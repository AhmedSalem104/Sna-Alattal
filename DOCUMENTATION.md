# S.N.A Al-Attal - Complete Platform Documentation

> **S.N.A Al-Attal** | Packaging & Filling Machinery Manufacturer
> Full-stack web platform with Admin Dashboard & Public Website
> Built with Next.js 15 | TypeScript | Tailwind CSS | Prisma | MySQL

---

## Table of Contents

- [Platform Overview](#platform-overview)
- [Public Website](#public-website)
  - [Homepage](#homepage)
  - [About](#about-page)
  - [Products](#products-page)
  - [Solutions](#solutions-page)
  - [Clients](#clients-page)
  - [Certificates](#certificates-page)
  - [Exhibitions](#exhibitions-page)
  - [News](#news-page)
  - [Team](#team-page)
  - [Contact](#contact-page)
- [Admin Dashboard](#admin-dashboard)
  - [Dashboard Home](#dashboard-home)
  - [Products Management](#products-management)
  - [Categories Management](#categories-management)
  - [Solutions Management](#solutions-management)
  - [News Management](#news-management)
  - [Slides / Hero Carousel](#slides--hero-carousel)
  - [Team Management](#team-management)
  - [Clients Management](#clients-management)
  - [Certificates Management](#certificates-management)
  - [Exhibitions Management](#exhibitions-management)
  - [TV Interviews Management](#tv-interviews-management)
  - [Catalogues Management](#catalogues-management)
  - [Messages / Inbox](#messages--inbox)
  - [Activity Log](#activity-log)
  - [Trash / Recycle Bin](#trash--recycle-bin)
  - [Settings](#settings)
- [Services & Capabilities](#services--capabilities)
- [Technical Architecture](#technical-architecture)
- [Deployment](#deployment)

---

## Platform Overview

The S.N.A Al-Attal platform is a professional B2B web application designed for an industrial packaging and filling machinery manufacturer. It consists of two main parts:

| Component | URL | Purpose |
|-----------|-----|---------|
| **Public Website** | `https://www.snalattal.me` | Company showcase, product catalog, contact |
| **Admin Dashboard** | `https://www.snalattal.me/admin` | Content management, analytics, settings |

### Key Features

- **Multi-language Support** — Arabic (RTL), English (LTR), Turkish (LTR)
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **SEO Optimized** — Meta tags, Open Graph, structured data
- **Image Optimization** — Cloudinary CDN + Next.js Image optimization
- **Secure** — NextAuth authentication, CSRF protection, rate limiting
- **Real-time Content** — All content managed through the admin dashboard

---

## Public Website

### Homepage

**Route:** `/`

The homepage is the main entry point featuring 9 dynamic sections:

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero Carousel** | Full-screen slider with images/videos, auto-play (60s), navigation arrows & dots |
| 2 | **About** | Company overview, 30+ years badge, factory image, key stats |
| 3 | **Products** | Featured products showcase with category links |
| 4 | **Solutions** | Industry solutions with icons and descriptions |
| 5 | **Clients** | Client logo carousel with partner names |
| 6 | **Certificates** | Quality certifications and accreditation badges |
| 7 | **Exhibitions** | Upcoming/recent trade shows and events |
| 8 | **TV Interviews** | Media appearances and television features |
| 9 | **Contact** | Quick contact form with office info (Egypt & Turkey) |

**Hero Carousel Features:**
- Supports both **image slides** and **YouTube video** slides
- Managed entirely from Admin Dashboard (Slides section)
- Each slide includes: title, subtitle, description, CTA button link
- Fallback default hero if no slides are configured

---

### About Page

**Route:** `/about`

Presents the company story, mission, and values:

- **Company Story** — History narrative with factory image and 30+ years experience badge
- **Key Statistics** — 500+ projects, 300+ clients, 15+ countries
- **Vision & Mission** — Two-card layout with Eye/Target icons
- **Core Values** — 4 values: Quality, Team, Global Reach, Innovation
- **Company Timeline** — Interactive vertical timeline showing milestones from founding to present (managed from Settings)

---

### Products Page

**Route:** `/products` | **Detail:** `/products/[slug]`

**Listing Page Features:**
- Search bar — filter products by name
- Category tabs — filter by product category (All + dynamic categories)
- 3-column responsive grid
- Product cards with: image, name, description, featured badge, specifications tags
- "View Details" link on each card

**Product Detail Page Features:**
- **Image Gallery** — Multi-image viewer with thumbnail navigation and arrows
- **Product Info** — Name, category tag, full description
- **Feature Icons** — High Speed, Quality, Customizable, Certified
- **Tabs Section:**
  - Technical Specifications (key-value grid)
  - Key Features (checkmark list)
  - Applications / Suitable For (pill badges)
- **Related Products** — 4-column grid of similar items
- **CTA** — Request Quote button + Download Brochure

---

### Solutions Page

**Route:** `/solutions` | **Detail:** `/solutions/[slug]`

**Listing Page Features:**
- Alternating image-text layout for each solution
- Solution cards with: icon, title, description, features list, industry tags
- Gradient colored backgrounds (6 rotating colors)
- Statistics section: 30+ years, 500+ projects, 300+ clients, 15+ countries

**Solution Detail Page Features:**
- Breadcrumb navigation
- Full description with icon badge
- Key Features (numbered cards)
- Related Products section (3-column grid)
- Related Solutions section
- "Get Quote" CTA button

---

### Clients Page

**Route:** `/clients`

- **Statistics** — 4 cards: 300+ Clients, 500+ Projects, 15+ Countries, 30+ Experience
- **Client Logo Grid** — 6-column responsive grid
  - Logos with hover zoom and shadow effects
  - External website links (if available)
- **Trust Indicators** — Quality Assurance, Dedicated Support, Global Presence

---

### Certificates Page

**Route:** `/certificates`

- **Certificate Cards** — 2-column grid with gradient backgrounds
  - Certificate name, issuing body, description
  - Issue date and validity period
  - Download certificate button
- **Why It Matters** — Quality Assurance, Trust & Compliance, Global Recognition
- **Accreditation Partners** — Partner logo display

---

### Exhibitions Page

**Route:** `/exhibitions`

- **Upcoming / Ongoing** — Large featured cards with:
  - Exhibition image, name, description
  - Date range (formatted per locale)
  - Location and booth number
  - Status badges: "Coming Soon" / "Ongoing"
  - "Schedule Visit" button
- **Past Exhibitions** — 3-column grid with grayscale-to-color hover effect

---

### News Page

**Route:** `/news` | **Detail:** `/news/[slug]`

**Listing Page Features:**
- Search bar — filter articles by title
- Tag-based category filter (dynamic from article tags)
- **Featured Article** — Large 2-column card at top
- **Article Grid** — 3-column cards with: image, tag, date, read time, title, excerpt
- **Newsletter Section** — Email subscription form with toast notifications

**Article Detail Page Features:**
- Full-width hero image with gradient overlay
- Article metadata: category badge, date, read time
- Author section with avatar
- Full HTML article content
- Social share buttons (Facebook, Twitter, LinkedIn)
- Related articles (3-column grid)

---

### Team Page

**Route:** `/team`

- **Team Grid** — 4-column responsive layout
- **Member Cards:**
  - Profile image with grayscale-to-color hover transition
  - Name and position overlays
  - Social links on hover: LinkedIn, Email
  - Gold accent bar design

---

### Contact Page

**Route:** `/contact`

**Two-Column Layout:**

| Left Side | Right Side |
|-----------|------------|
| **Office Cards** (Egypt HQ + Turkey Branch) | **Contact Form** |
| Address, phone (clickable), email, hours | Name, Email, Phone, Company |
| WhatsApp quick contact button | Subject dropdown (5 options) |
| | Message textarea |
| | Submit with validation |

**Contact Form Subjects:**
1. Request a Quote
2. Technical Support
3. Sales Inquiry
4. Business Partnership
5. Other

**Additional:**
- Google Maps embed showing headquarters location
- Form validation with Zod schema
- Rate limiting protection (429 handling)
- Full RTL/LTR support

---

### Additional Pages

| Route | Page | Content |
|-------|------|---------|
| `/privacy` | Privacy Policy | 6 sections: Data Collection, Usage, Security, Sharing, Cookies, Contact |
| `/terms` | Terms of Service | 6 sections: Acceptance, Services, IP, Liability, Law, Changes |

---

## Admin Dashboard

**Access:** `https://www.snalattal.me/admin`
**Authentication:** NextAuth.js session-based login

### Navigation Sidebar

The admin dashboard features a collapsible sidebar with:
- **Smart hover** expand/collapse with configurable delays
- **Pin functionality** to lock sidebar open
- **Search** across all navigation items
- **Unread messages badge** counter
- **Mobile drawer** menu for responsive access

**Menu Structure:**

```
Dashboard (Home)
|
+-- Content Management
|   +-- Products
|   +-- Categories
|   +-- Solutions
|   +-- News
|   +-- Slides
|
+-- Company
|   +-- Team Members
|   +-- Clients / Partners
|   +-- Certificates
|
+-- Media & Events
|   +-- Exhibitions
|   +-- TV Interviews
|   +-- Catalogues
|
+-- Communication
|   +-- Messages
|   +-- Activity Log
|
+-- Trash
+-- Settings
```

---

### Dashboard Home

**Route:** `/admin`

The main dashboard provides an overview of the entire platform:

| Widget | Content |
|--------|---------|
| **Welcome Card** | Greeting with admin user name |
| **Stats Cards** | Total Products, Total Clients, Unread Messages, Catalogue Downloads |
| **Quick Actions** | Add Product, Add News, View Messages, Manage Clients |
| **Recent Activity** | Latest admin actions with timestamps |
| **Recent Messages** | Preview of contact form submissions |
| **System Status** | Platform health indicators |

---

### Products Management

**Route:** `/admin/products`

#### List View
- Searchable and sortable data table
- Columns: Image, Name (Ar/En), Category, Status, Featured, Order
- Quick actions: Toggle featured (star icon), toggle active status
- Action menu: Edit, Preview on site, Toggle status, Move to trash

#### Create / Edit Product

**Route:** `/admin/products/new` | `/admin/products/[id]`

**4-Tab Form Interface:**

| Tab | Fields |
|-----|--------|
| **Basic Info** | Names (Ar/En/Tr), Slug (auto-generated), Category, Active toggle, Featured toggle, Order |
| **Content** | Short descriptions (Ar/En/Tr, max 500 chars), Full descriptions (Ar/En/Tr) |
| **Media** | Image upload (drag & drop), Multiple images (up to 5), Gallery management |
| **SEO** | SEO titles (Ar/En/Tr), SEO descriptions (Ar/En/Tr), Keywords array |

**Features:**
- Auto-slug generation from Arabic product name
- Multi-language content in all 3 languages
- Drag-and-drop image upload to Cloudinary
- Featured product marking (appears first/highlighted on site)
- Order number for custom sorting

---

### Categories Management

**Route:** `/admin/categories`

Manages the product category hierarchy:

| Field | Description |
|-------|-------------|
| Names | Arabic, English, Turkish |
| Slug | URL-friendly identifier |
| Image | Category thumbnail |
| Parent Category | For subcategory support (hierarchical) |
| Active | Toggle visibility |
| Sort Order | Custom ordering |

**Stats displayed:** Total categories, Active, Main categories, Total products

---

### Solutions Management

**Route:** `/admin/solutions`

Manages business solutions/service offerings:

| Field | Description |
|-------|-------------|
| Titles | Arabic, English, Turkish |
| Slug | Auto-generated URL identifier |
| Image | Solution showcase image |
| Icon | Solution icon/symbol |
| Description | Multi-language content |
| Active / Featured | Visibility and prominence toggles |
| Order | Custom sort position |

**Stats:** Total solutions, Active, Featured, Related products count

---

### News Management

**Route:** `/admin/news`

#### List View
- Columns: Image, Title, Author, Publication Date, Featured, Status (Published/Draft)
- Stats: Total articles, Published, Featured, This month count

#### Create / Edit Article

**Route:** `/admin/news/new` | `/admin/news/[id]`

**Language-Tabbed Interface (Arabic | English | Turkish):**

| Field | Description |
|-------|-------------|
| Title | Article headline (required) |
| Excerpt | Summary text (optional) |
| Content | Full article body (required, min 50 chars) |

**Sidebar Settings:**

| Field | Description |
|-------|-------------|
| Slug | Auto-generated from English title |
| Author | Writer attribution |
| Publication Date | Date/time picker |
| Published | Draft/Published toggle |
| Featured | Highlight on homepage |
| Tags | Add/remove article tags for categorization |

---

### Slides / Hero Carousel

**Route:** `/admin/slides`

Manages the homepage hero section carousel:

| Field | Description |
|-------|-------------|
| Title | Slide heading (Ar/En) |
| Subtitle | Secondary text (Ar) |
| Image | Full-screen slide background |
| Button Link | CTA destination URL |
| Active | Toggle slide visibility |
| Order | Sequence position in carousel |

**Stats:** Total slides, Active, Inactive

> **Note:** Slides support both image and YouTube video backgrounds. The carousel auto-plays with 60-second intervals.

---

### Team Management

**Route:** `/admin/team`

Manages company staff profiles:

| Field | Description |
|-------|-------------|
| Names | Arabic, English |
| Position | Job title (Ar/En) |
| Profile Image | Team member photo |
| Email | Contact email address |
| LinkedIn | Professional profile URL |
| Active | Toggle visibility |
| Order | Display position |

**Stats:** Total members, Active members, Members with LinkedIn

---

### Clients Management

**Route:** `/admin/clients`

Manages business partner/client listings:

| Field | Description |
|-------|-------------|
| Names | Arabic, English |
| Logo | Client company logo |
| Website | External website URL |
| Active | Toggle visibility |
| Featured | Highlight as key partner |
| Order | Display position |

---

### Certificates Management

**Route:** `/admin/certificates`

Manages quality certifications:

| Field | Description |
|-------|-------------|
| Names | Arabic, English |
| Issuing Body | Certification authority (Ar/En) |
| Image | Certificate badge/image |
| Issue Date | When certificate was obtained |
| Expiry Date | Validity end date (shows red if expired) |
| Active | Toggle visibility |
| Order | Display position |

**Stats:** Total certificates, Active, Expired

---

### Exhibitions Management

**Route:** `/admin/exhibitions`

Manages trade show participation:

| Field | Description |
|-------|-------------|
| Titles | Arabic, English, Turkish |
| Description | Event details (Ar/En/Tr) |
| Location | Venue location (Ar/En) |
| Start / End Date | Event date range |
| Images | Exhibition gallery |
| Website URL | Registration/info link |
| Active / Featured | Visibility toggles |

---

### TV Interviews Management

**Route:** `/admin/tv-interviews`

Manages television and media appearances:

| Field | Description |
|-------|-------------|
| Titles | Arabic, English |
| Channel | Network/channel name (Ar/En) |
| Air Date | Broadcast date |
| Description | Interview summary |
| Media | Video/image content |
| URL | Video link |
| Active | Toggle visibility |

---

### Catalogues Management

**Route:** `/admin/catalogues`

Manages product catalogues and brochures:

| Field | Description |
|-------|-------------|
| Title | Catalogue name (Ar/En) |
| Description | Catalogue summary (Ar/En) |
| Cover Image | Catalogue thumbnail |
| PDF File | Uploadable document |
| Active | Toggle availability |
| Featured | Highlight as primary catalogue |

**Tracked Metrics:** Download count per catalogue

---

### Messages / Inbox

**Route:** `/admin/messages`

Manages contact form submissions:

| Column | Description |
|--------|-------------|
| Status Icon | Read/Unread indicator |
| Sender Name | Contact person |
| Email | Reply address |
| Subject | Categorized: Quote Request, Technical Support, Sales, Partnership, Other |
| Preview | Truncated message text |
| Date | Submission timestamp |

**Message Detail Dialog:**
- Full sender info: Name, Email, Phone, Company
- Subject category badge
- Complete message content
- Reply button (opens email client)
- Archive / Delete options

**Features:**
- Unread count badge on sidebar navigation
- Message archival system
- Direct email reply integration
- Subject-based categorization

---

### Activity Log

**Route:** `/admin/activity`

Complete audit trail of all admin actions:

| Column | Description |
|--------|-------------|
| Timestamp | Relative time (e.g., "2 hours ago") |
| User | Avatar, name, email |
| Action | Create (green), Edit (blue), Delete (red), Restore (purple) |
| Entity | Type with icon (Product, News, Team, etc.) |
| Entity ID | Record identifier |

- Paginated display (50 items/page)
- Search capability
- Color-coded action badges

---

### Trash / Recycle Bin

**Route:** `/admin/trash`

Recovery center for deleted items:

**Tabbed by Entity:**
- Products | Clients | News | Catalogues

**Per Item Actions:**
- **Restore** — Recovers the item back to active state
- **Permanent Delete** — Irreversible deletion (with confirmation dialog)
- **Empty Trash** — Bulk permanent delete all items (with warning)

> All deletions in the admin are "soft deletes" — items go to Trash first and can be restored. Only permanent delete from Trash is irreversible.

---

### Settings

**Route:** `/admin/settings`

Global platform configuration organized in tabs:

#### General Settings
| Field | Description |
|-------|-------------|
| Site Name | Platform title (Ar/En/Tr) |
| Site Description | Platform tagline (Ar/En/Tr) |
| Logo URL | Site logo image path |
| Favicon URL | Browser tab icon path |

#### Contact Settings
| Field | Description |
|-------|-------------|
| Email | Primary contact email |
| Phone | Main phone number |
| WhatsApp | WhatsApp number |
| Address | Office location (Ar/En/Tr) |
| Google Maps URL | Embedded map link |
| Working Hours | Business schedule (Ar/En/Tr) |

#### Social Media
| Platform | Field |
|----------|-------|
| Facebook | Page URL |
| Twitter/X | Profile URL |
| Instagram | Profile URL |
| LinkedIn | Company URL |
| YouTube | Channel URL |
| TikTok | Profile URL |

#### SEO Settings
| Field | Description |
|-------|-------------|
| SEO Title | Page title tag (Ar/En/Tr) |
| Meta Description | Search result description (Ar/En/Tr) |
| Keywords | Comma-separated keywords |
| Google Analytics ID | GA4 tracking code (G-XXXXXXXXXX) |
| Google Tag Manager ID | GTM container (GTM-XXXXXXX) |

---

## Services & Capabilities

### What the Platform Offers

#### For Visitors (Public Website)
| Service | Description |
|---------|-------------|
| **Product Catalog** | Browse all packaging & filling machines with full specs, images, and features |
| **Industry Solutions** | Discover solutions tailored to specific industries and needs |
| **Company Information** | Learn about the 30+ year history, team, values, and vision |
| **Client Portfolio** | View trusted partners and client logos |
| **Quality Certificates** | Verify ISO and quality certifications |
| **Exhibition Calendar** | Find upcoming trade shows and events |
| **Media Coverage** | Watch TV interviews and media appearances |
| **News & Updates** | Stay informed about company news and articles |
| **Direct Contact** | Submit inquiries via form, phone, email, or WhatsApp |
| **Product Catalogues** | Download product brochures and PDFs |
| **Newsletter** | Subscribe for updates |
| **Multi-language** | Full Arabic, English, and Turkish support |

#### For Administrators (Admin Dashboard)
| Capability | Description |
|------------|-------------|
| **Full CMS** | Create, edit, delete all website content without coding |
| **Media Management** | Upload and manage images via Cloudinary CDN |
| **Multi-language Editing** | Edit content in Arabic, English, and Turkish simultaneously |
| **SEO Control** | Custom meta titles, descriptions, and keywords per item |
| **Analytics Integration** | Google Analytics + Tag Manager configuration |
| **Contact Management** | View, reply to, and archive customer messages |
| **Audit Trail** | Track all admin actions with user attribution |
| **Soft Delete & Recovery** | Trash system with restore capability |
| **Role-based Access** | Authenticated admin sessions with NextAuth |
| **Social Media Links** | Centralized management of all social profiles |

---

## Technical Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom Design System |
| **Database** | MySQL (Prisma ORM) |
| **Authentication** | NextAuth.js |
| **Internationalization** | next-intl (Arabic, English, Turkish) |
| **Image CDN** | Cloudinary |
| **Animations** | Framer Motion |
| **Icons** | Lucide React (30+ icons) |
| **Forms** | React Hook Form + Zod validation |
| **Tables** | TanStack React Table |
| **Carousel** | Embla Carousel |
| **Notifications** | Sonner (toast) |
| **UI Components** | Custom Shadcn/UI-inspired library |

### Project Structure

```
src/
├── app/
│   ├── (main)/          # Public website pages
│   │   ├── about/
│   │   ├── products/
│   │   ├── solutions/
│   │   ├── clients/
│   │   ├── certificates/
│   │   ├── exhibitions/
│   │   ├── news/
│   │   ├── team/
│   │   ├── contact/
│   │   ├── privacy/
│   │   └── terms/
│   ├── (admin)/         # Admin dashboard
│   │   └── admin/
│   │       ├── products/
│   │       ├── categories/
│   │       ├── solutions/
│   │       ├── news/
│   │       ├── slides/
│   │       ├── team/
│   │       ├── clients/
│   │       ├── certificates/
│   │       ├── exhibitions/
│   │       ├── tv-interviews/
│   │       ├── catalogues/
│   │       ├── messages/
│   │       ├── activity/
│   │       ├── trash/
│   │       └── settings/
│   └── api/
│       ├── admin/       # Protected admin API routes
│       └── public/      # Public data API routes
├── components/
│   ├── sections/        # Homepage sections
│   ├── ui/              # Reusable UI components
│   └── admin/           # Admin-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, Prisma client, auth config
└── i18n/
    └── messages/        # Translation files (ar.json, en.json, tr.json)
```

### API Routes

**Public API** (`/api/public/`):
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/public/products` | GET | All active products |
| `/api/public/categories` | GET | Product categories |
| `/api/public/solutions` | GET | Active solutions |
| `/api/public/clients` | GET | Client logos |
| `/api/public/certificates` | GET | Certificates |
| `/api/public/exhibitions` | GET | Exhibitions |
| `/api/public/news` | GET | Published articles |
| `/api/public/news/[slug]` | GET | Single article |
| `/api/public/slides` | GET | Hero carousel slides |
| `/api/public/team` | GET | Team members |
| `/api/public/settings` | GET | Site settings |
| `/api/public/newsletter` | POST | Newsletter subscription |
| `/api/contact` | POST | Contact form submission |

**Admin API** (`/api/admin/`):
| Pattern | Methods | Description |
|---------|---------|-------------|
| `/api/admin/[entity]` | GET, POST | List all / Create new |
| `/api/admin/[entity]/[id]` | GET, PUT, PATCH, DELETE | Read / Update / Toggle / Delete |
| `/api/admin/dashboard` | GET | Dashboard statistics |
| `/api/admin/settings` | GET, PUT | Platform settings |
| `/api/admin/activity` | GET | Audit log (paginated) |
| `/api/admin/messages?count=true` | GET | Unread message count |

---

## Deployment

### Production Environment

| Property | Value |
|----------|-------|
| **Hosting** | Hostinger VPS |
| **Server IP** | 72.60.132.3 |
| **Domain** | www.snalattal.me |
| **Project Path** | /home/deploy/apps/sna-alattal |
| **Process Manager** | PM2 (process: sna-alattal) |
| **Node.js** | System install at /usr/bin/node |
| **CI/CD** | GitHub Actions on push to master |

### Deploy Commands (Manual SSH)

```bash
# SSH into server
ssh root@72.60.132.3

# Navigate to project
cd /home/deploy/apps/sna-alattal

# Pull latest changes
git pull origin master

# Install dependencies (if package.json changed)
npm ci

# Build the application
npm run build

# Restart the server
pm2 restart sna-alattal
```

### Important Notes
- Do NOT delete `.next/` directory before building (enables incremental builds)
- Do NOT pipe build output to `tail` or other commands (causes OOM kills)
- Run `npm ci` only when dependencies change (saves time)
- GitHub Actions auto-deploys on push to `master` branch

---

> **Document Version:** 1.0
> **Last Updated:** February 2026
> **Platform:** S.N.A Al-Attal Web Platform
