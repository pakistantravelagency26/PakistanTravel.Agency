import fs from 'fs';

const filePath = 'src/app/listing/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `      seller: {
        "@type": "TravelAgency",
        name: "PakistanTravel.Agency",
        url: siteUrl,
      },
    },
  };`;

const targetCRLF = `      seller: {\r\n        "@type": "TravelAgency",\r\n        name: "PakistanTravel.Agency",\r\n        url: siteUrl,\r\n      },\r\n    },\r\n  };`;

const replacement = `      seller: {
        "@type": "Organization",
        name: listing.vendor?.businessName || "Independent Local Tour Operator",
        url: \`\${siteUrl}/listing/\${listing.slug}\`,
      },
    },
    provider: {
      "@type": "Organization",
      name: "PakistanTravel",
      url: siteUrl,
    },
  };

  // AggregateRating only with 10 or more real reviews
  if (listing.totalReviews && listing.totalReviews >= 10 && listing.averageRating) {
    mainJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: listing.averageRating,
      reviewCount: listing.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }`;

const replacementCRLF = `      seller: {\r\n        "@type": "Organization",\r\n        name: listing.vendor?.businessName || "Independent Local Tour Operator",\r\n        url: \`\${siteUrl}/listing/\${listing.slug}\`,\r\n      },\r\n    },\r\n    provider: {\r\n      "@type": "Organization",\r\n      name: "PakistanTravel",\r\n      url: siteUrl,\r\n    },\r\n  };\r\n\r\n  // AggregateRating only with 10 or more real reviews\r\n  if (listing.totalReviews && listing.totalReviews >= 10 && listing.averageRating) {\r\n    mainJsonLd.aggregateRating = {\r\n      "@type": "AggregateRating",\r\n      ratingValue: listing.averageRating,\r\n      reviewCount: listing.totalReviews,\r\n      bestRating: 5,\r\n      worstRating: 1,\r\n    };\r\n  }`;

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, replacementCRLF);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated listing/[slug]/page.tsx (CRLF)!');
} else if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated listing/[slug]/page.tsx (LF)!');
} else {
  console.error('Target not found in listing/[slug]/page.tsx');
}
