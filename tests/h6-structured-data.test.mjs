import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('.');

test('H6.1: Layout provides WebSite and Organization schema without phone, address, or license', () => {
  const layoutContent = fs.readFileSync(path.join(projectRoot, 'src/app/layout.tsx'), 'utf8');
  assert.ok(layoutContent.includes('"@type": "WebSite"'), 'Must include WebSite schema');
  assert.ok(layoutContent.includes('"@type": "Organization"'), 'Must include Organization schema');
  assert.ok(layoutContent.includes('potentialAction'), 'WebSite must have SearchAction');
  assert.ok(layoutContent.includes('/tours?q='), 'SearchAction must point to /tours?q=');
  
  // Organization must not contain phone, address, or license
  const orgMatch = layoutContent.match(/\{\s*"@type":\s*"Organization"[\s\S]*?\}/);
  assert.ok(orgMatch, 'Organization block must be present');
  const orgStr = orgMatch[0];
  assert.ok(!orgStr.includes('telephone') && !orgStr.includes('phone'), 'Organization must NOT contain phone');
  assert.ok(!orgStr.includes('address') && !orgStr.includes('PostalAddress'), 'Organization must NOT contain address');
  assert.ok(!orgStr.includes('license'), 'Organization must NOT contain license');
});

test('H6.2: All inner pages contain BreadcrumbList schema', () => {
  const innerPages = [
    'src/app/tours/page.tsx',
    'src/app/destinations/page.tsx',
    'src/app/destinations/[slug]/page.tsx',
    'src/app/tours/[intent]/page.tsx',
    'src/app/listing/[slug]/page.tsx',
    'src/app/blog/page.tsx',
    'src/app/blog/[slug]/page.tsx',
    'src/app/about/page.tsx',
    'src/app/about/editorial-policy/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/faq/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/partner-info/page.tsx',
    'src/app/list-your-tour/page.tsx',
    'src/app/how-booking-works/page.tsx',
    'src/app/safety-and-permits/page.tsx'
  ];

  for (const p of innerPages) {
    const content = fs.readFileSync(path.join(projectRoot, p), 'utf8');
    assert.ok(content.includes('BreadcrumbList'), `Page ${p} must contain BreadcrumbList schema`);
  }
});

test('H6.3: Destination pages contain TouristDestination and FAQPage schema', () => {
  const destContent = fs.readFileSync(path.join(projectRoot, 'src/app/destinations/[slug]/page.tsx'), 'utf8');
  assert.ok(destContent.includes('TouristDestination'), 'Destination page must include TouristDestination schema');
  assert.ok(destContent.includes('FAQPage'), 'Destination page must include FAQPage schema');
  assert.ok(destContent.includes('containedInPlace'), 'TouristDestination must include containedInPlace');
});

test('H6.4: Blog post pages contain BlogPosting/Article with datePublished, dateModified, and author', () => {
  const blogContent = fs.readFileSync(path.join(projectRoot, 'src/app/blog/[slug]/page.tsx'), 'utf8');
  assert.ok(blogContent.includes('BlogPosting') || blogContent.includes('Article'), 'Blog post must have Article/BlogPosting schema');
  assert.ok(blogContent.includes('datePublished'), 'Blog post must have datePublished');
  assert.ok(blogContent.includes('dateModified'), 'Blog post must have dateModified');
  assert.ok(blogContent.includes('author'), 'Blog post must have author');
  assert.ok(blogContent.includes('/about/editorial-policy'), 'Author must reference editorial policy');
});

test('H6.5: Tour listing pages contain TouristTrip with Offer and guarded AggregateRating', () => {
  const listingContent = fs.readFileSync(path.join(projectRoot, 'src/app/listing/[slug]/page.tsx'), 'utf8');
  assert.ok(listingContent.includes('"@type": "TouristTrip"'), 'Listing must have TouristTrip schema');
  assert.ok(listingContent.includes('"@type": "Offer"'), 'Listing must have Offer schema');
  assert.ok(listingContent.includes('priceCurrency'), 'Offer must include priceCurrency');
  assert.ok(listingContent.includes('PKR'), 'priceCurrency must be PKR');
  assert.ok(listingContent.includes('availability'), 'Offer must include availability');
  assert.ok(listingContent.includes('url'), 'Offer must include url');
  
  // AggregateRating must be strictly guarded by >= 10 reviews
  assert.ok(
    listingContent.includes('totalReviews >= 10'),
    'AggregateRating must be strictly guarded by 10 or more reviews'
  );
});

test('H6.6: FAQ page contains FAQPage schema', () => {
  const faqContent = fs.readFileSync(path.join(projectRoot, 'src/app/faq/page.tsx'), 'utf8');
  assert.ok(faqContent.includes('FAQPage'), 'FAQ page must include FAQPage schema');
  assert.ok(faqContent.includes('mainEntity'), 'FAQPage must include mainEntity');
});
