/**
 * Structured Data (JSON-LD) Components for SEO
 * Helps search engines understand the content and improves rich snippets
 */

export function MusicGroupSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Of Blood",
    "alternateName": "Of Blood Band",
    "genre": ["Death Metal", "Black Metal", "Blackened Death Metal", "Extreme Metal"],
    "url": "https://of-blood.com",
    "image": "https://of-blood.com/images/OfBloodLogo.png",
    "logo": "https://of-blood.com/images/OfBloodLogo.png",
    "description": "Of Blood is a blackened death metal band exploring themes of cosmic horror, existential dread, and apocalyptic visions through crushing riffs and atmospheric darkness.",
    "foundingDate": "2024",
    "foundingLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    },
    "sameAs": [
      "https://www.instagram.com/ofbloodband/",
      "https://www.youtube.com/@OfBloodBand",
      "https://www.tiktok.com/@ofbloodband"
    ],
    "subjectOf": {
      "@type": "CreativeWork",
      "name": "Of Blood - Blackened Death Metal Band",
      "description": "Official website featuring music, tour dates, merchandise, and media for Of Blood"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Of Blood Official Website",
    "alternateName": "Of Blood Band",
    "url": "https://of-blood.com",
    "description": "Official website of Of Blood - Blackened death metal band. Listen to music, view tour dates, shop merch, and stay updated on the latest releases.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://of-blood.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Of Blood",
      "logo": {
        "@type": "ImageObject",
        "url": "https://of-blood.com/images/OfBloodLogo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://of-blood.com${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface MusicReleaseSchemaProps {
  title: string;
  type: 'Single' | 'EP' | 'Album';
  date: string;
  cover: string;
  description?: string;
  tracks?: Array<{ title: string; duration?: number }>;
}

export function MusicReleaseSchema({ title, type, date, cover, description, tracks }: MusicReleaseSchemaProps) {
  const releaseType = type === 'Single' ? 'MusicSingle' : type === 'Album' ? 'MusicAlbum' : 'MusicRelease';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": releaseType,
    "name": title,
    "byArtist": {
      "@type": "MusicGroup",
      "name": "Of Blood",
      "url": "https://of-blood.com"
    },
    "datePublished": date,
    "image": `https://of-blood.com${cover}`,
    "genre": ["Death Metal", "Black Metal", "Blackened Death Metal"],
    "description": description || `${type} by Of Blood - ${title}`,
    ...(tracks && tracks.length > 0 && {
      "numTracks": tracks.length,
      "track": tracks.map((track, index) => ({
        "@type": "MusicRecording",
        "name": track.title,
        "position": index + 1,
        "byArtist": {
          "@type": "MusicGroup",
          "name": "Of Blood"
        },
        ...(track.duration && { "duration": `PT${track.duration}S` })
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string[];
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
}

export function ProductSchema({ name, description, image, price, currency, availability, url }: ProductSchemaProps) {
  const availabilityMap = {
    'InStock': 'https://schema.org/InStock',
    'OutOfStock': 'https://schema.org/OutOfStock',
    'PreOrder': 'https://schema.org/PreOrder'
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": "Of Blood"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://of-blood.com${url}`,
      "priceCurrency": currency,
      "price": (price / 100).toFixed(2),
      "availability": availabilityMap[availability],
      "seller": {
        "@type": "Organization",
        "name": "Of Blood"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface EventSchemaProps {
  name: string;
  date: string;
  venue: string;
  city: string;
  state?: string;
  ticketUrl?: string;
}

export function EventSchema({ name, date, venue, city, state, ticketUrl }: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": name,
    "startDate": date,
    "performer": {
      "@type": "MusicGroup",
      "name": "Of Blood",
      "url": "https://of-blood.com"
    },
    "location": {
      "@type": "Place",
      "name": venue,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        ...(state && { "addressRegion": state }),
        "addressCountry": "US"
      }
    },
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    ...(ticketUrl && {
      "offers": {
        "@type": "Offer",
        "url": ticketUrl,
        "availability": "https://schema.org/InStock"
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Of Blood",
    "url": "https://of-blood.com",
    "logo": "https://of-blood.com/images/OfBloodLogo.png",
    "description": "Blackened death metal band exploring cosmic horror and existential dread",
    "email": "ofbloodband@gmail.com",
    "sameAs": [
      "https://www.instagram.com/ofbloodband/",
      "https://www.youtube.com/@OfBloodBand",
      "https://www.tiktok.com/@ofbloodband"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Booking",
      "email": "ofbloodband@gmail.com",
      "url": "https://of-blood.com/contact"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

