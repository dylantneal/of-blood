# Of Blood - Official Website

Blackened death metal band website built with Next.js 14, React, Tailwind CSS, and Framer Motion.

## Features

- 🎸 **Music** - Discography with streaming links and embedded players
- 🎫 **Tour Dates** - Upcoming shows with ticket links
- 🛍️ **Merch Store** - Integrated with Shopify Storefront API
- 📸 **Media Gallery** - Photos, videos, and press kit
- 📧 **Contact Form** - Booking and press inquiries
- 💌 **Newsletter** - Email subscription for updates
- 🎨 **Dark Theme** - Black/red/white/gold aesthetic with film grain texture

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React + Tailwind CSS + Framer Motion
- **Components**: shadcn/ui inspired primitives
- **Commerce**: Shopify Storefront API
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Shopify store (for merch integration)
- Resend account (for contact form)
- Mailing list provider account (Mailchimp, ConvertKit, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/of-blood.git
cd of-blood
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Add your environment variables to `.env.local`:
   - Shopify store domain and access token
   - Resend API key
   - Mailing list provider credentials

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /(site)
    /home, /merch, /music, /tour, /media, /about, /contact, /legal
  /api
    /contact, /newsletter
  layout.tsx, page.tsx
/components
  /ui - Reusable UI primitives (Button, Card, Input, etc.)
  /layout - Site structure (Header, Footer, Logo)
  /home - Home page sections
/lib
  types.ts - TypeScript type definitions
  utils.ts - Utility functions
  shopify.ts - Shopify API client
/data
  shows.json, releases.json - Sample data files
/public
  - Static assets (images, icons, etc.)
```

## Key Pages

- `/` - Home with hero, featured release, tour ticker, merch, newsletter
- `/music` - Discography with streaming links and tracklists
- `/tour` - Upcoming tour dates with ticket links
- `/merch` - Product grid powered by Shopify
- `/media` - Photo/video gallery and press kit
- `/about` - Band bio, philosophy, and lore
- `/contact` - Contact form for booking/press inquiries
- `/legal` - Privacy policy, terms, cookies

## Environment Variables

See `.env.local.example` for all required environment variables.

### Required:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `RESEND_API_KEY`

### Optional:
- Mailchimp or ConvertKit credentials (for newsletter)
- Analytics tracking IDs

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Customization

### Theme Colors

Edit CSS variables in `app/globals.css`:
```css
:root {
  --bg: #0A0A0A;        /* Background */
  --fg: #F2F2F2;        /* Foreground */
  --primary: #B30A0A;   /* Blood red */
  --gold: #C9A227;      /* Antique gold */
  --muted: #1A1A1A;     /* Muted background */
  --line: #2A2A2A;      /* Borders */
}
```

### Fonts

Current fonts (Google Fonts):
- **Body**: Inter
- **Display**: Cinzel

To change fonts, edit `app/layout.tsx` and update the font imports.

### Content

Replace sample data in `/data` with your actual content, or migrate to a CMS like Sanity or Contentful.

## API Routes

### `/api/contact`
Handles contact form submissions. Sends email via Resend.

### `/api/newsletter`
Handles newsletter subscriptions. Currently a placeholder—integrate with your mailing list provider.

## Future Enhancements

Phase 2:
- [ ] Sticky global audio player
- [ ] Lyrics pages (MDX)
- [ ] Press/EPK download page
- [ ] City-based tour notifications
- [ ] CMS integration (Sanity/Contentful)

Phase 3:
- [ ] "Drops" system for limited merch
- [ ] Gated fan club content
- [ ] Interactive WebGL hero
- [ ] Lore codex

Phase 4:
- [ ] Headless cart with on-site checkout
- [ ] Inventory dashboards
- [ ] Webhooks for sold-out badges

## Support

For questions or issues:
- Email: dev@ofblood.band
- GitHub Issues: [github.com/your-username/of-blood/issues](https://github.com/your-username/of-blood/issues)

## License

© 2025 Of Blood. All rights reserved.

