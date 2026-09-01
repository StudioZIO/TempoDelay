import React, { useEffect } from 'react';

export const SEO: React.FC = () => {
  useEffect(() => {
    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://studiozio.vercel.app/#organization",
          "name": "StudioZIO",
          "url": "https://studiozio.vercel.app",
          "description": "Independent audio software company specializing in native Audio Unit (AUv2), VST3, and Standalone audio plugins."
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://www.tempodelay.tech/#software",
          "name": "StudioZIO Tempo Delay",
          "operatingSystem": "macOS 11+ (Apple Silicon arm64)",
          "applicationCategory": "MultimediaApplication / Audio Plugin",
          "downloadUrl": "https://github.com/StudioZIO/StudioZIO-Releases/releases/tag/tempo-delay-v4.0.1-RC1",
          "softwareVersion": "4.0.1",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "author": {
            "@id": "https://studiozio.vercel.app/#organization"
          },
          "description": "StudioZIO Tempo Delay is a modern stereo delay featuring independent left/right timing, three character modes (Digital, Tape, Analog), advanced routing, modulation, ducking, diffusion, freeze and reverse processing."
        }
      ]
    };

    let scriptTag = document.getElementById('studiozio-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'studiozio-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData, null, 2);

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, []);

  return null;
};
