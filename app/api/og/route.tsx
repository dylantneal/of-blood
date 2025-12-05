import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters for dynamic OG images
    const title = searchParams.get('title') || 'OF BLOOD';
    const subtitle = searchParams.get('subtitle') || 'BLACKENED DEATH METAL';
    const type = searchParams.get('type') || 'default';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0A',
            backgroundImage: [
              'radial-gradient(circle at 25px 25px, rgba(42, 42, 42, 0.4) 2%, transparent 0%)',
              'radial-gradient(circle at 75px 75px, rgba(42, 42, 42, 0.3) 2%, transparent 0%)',
            ].join(','),
            backgroundSize: '100px 100px',
            position: 'relative',
          }}
        >
          {/* Red glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(179, 10, 10, 0.3) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: type === 'product' ? 80 : 120,
                fontWeight: 900,
                color: '#F2F2F2',
                fontFamily: 'serif',
                letterSpacing: '0.05em',
                marginBottom: 20,
                textAlign: 'center',
                textShadow: '0 0 40px rgba(179, 10, 10, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                lineHeight: 1.1,
                maxWidth: '90%',
              }}
            >
              {title}
            </h1>

            {/* Subtitle/Type */}
            <p
              style={{
                fontSize: type === 'product' ? 32 : 42,
                color: '#B30A0A',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                fontWeight: 600,
                textShadow: '0 0 20px rgba(179, 10, 10, 0.8)',
              }}
            >
              {subtitle}
            </p>

            {/* Bottom bar with logo symbol */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                fontSize: 24,
                color: '#C9A227',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}
            >
              <span style={{ fontSize: 32 }}>✦</span>
              <span>OF-BLOOD.COM</span>
              <span style={{ fontSize: 32 }}>✦</span>
            </div>
          </div>

          {/* Corner ornaments */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              width: 60,
              height: 60,
              border: '2px solid #C9A227',
              borderRight: 'none',
              borderBottom: 'none',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 40,
              width: 60,
              height: 60,
              border: '2px solid #C9A227',
              borderLeft: 'none',
              borderBottom: 'none',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 40,
              width: 60,
              height: 60,
              border: '2px solid #C9A227',
              borderRight: 'none',
              borderTop: 'none',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 40,
              width: 60,
              height: 60,
              border: '2px solid #C9A227',
              borderLeft: 'none',
              borderTop: 'none',
              opacity: 0.4,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('Failed to generate OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}


