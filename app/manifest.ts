import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Of Blood - Cosmic Death Metal',
    short_name: 'Of Blood',
    description: 'Cosmic death metal exploring cosmic horror, existential dread, and apocalyptic themes. Tendrils of descending divinity wrapped in black, red, and gold.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#B30A0A',
    icons: [
      {
        src: '/images/OfBloodSymbol.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

