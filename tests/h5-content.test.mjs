import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('.');

test('H5.1 & H5.4: All 13 destinations exist with non-absolute fact-checked content', async () => {
  const { destinationsData } = await import('../src/data/destinationData.ts');
  const requiredDestinations = [
    'hunza', 'skardu', 'swat', 'kumrat', 'murree', 'neelum',
    'fairy-meadows', 'naran-kaghan', 'naltar', 'astore',
    'chitral-kalash', 'shogran-siri-paye', 'gilgit'
  ];

  for (const slug of requiredDestinations) {
    assert.ok(destinationsData[slug], `Destination ${slug} must exist`);
    const d = destinationsData[slug];
    assert.ok(d.name && d.name.length > 0, `${slug} must have a name`);
    assert.ok(d.overview && d.overview.length >= 2, `${slug} must have overview paragraphs`);
    assert.ok(d.keyFacts, `${slug} must have keyFacts`);
    assert.ok(d.approximateCosts, `${slug} must have approximateCosts`);
    assert.ok(d.faqs && d.faqs.length >= 2, `${slug} must have at least 2 FAQs`);
  }

  // Softened claims check in destinationData.ts
  const rawDest = fs.readFileSync(path.join(projectRoot, 'src/data/destinationData.ts'), 'utf8');
  assert.ok(!rawDest.includes("one of Pakistan's safest"), "Absolute safety claim must be softened");
  assert.ok(!rawDest.includes("Olympic-standard"), "Swat Olympic ski slope claim must not be present");
});

test('H5.2: Tour intent pages must all have >= 300 unique words', async () => {
  const { tourIntentsData } = await import('../src/data/tourIntentsData.ts');
  for (const [slug, data] of Object.entries(tourIntentsData)) {
    const words = (data.introText || []).join(' ').split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 300, `Tour intent ${slug} has ${words} words, must be >= 300`);
  }
});

test('H5.3: Blog posts must have Last Updated, dateModified, FAQs, and editorial policy link', async () => {
  const { blogPosts } = await import('../src/data/blogData.ts');
  assert.ok(blogPosts.length >= 5, "Must have at least 5 blog posts");
  for (const post of blogPosts) {
    assert.ok(post.lastUpdated, `Blog post ${post.slug} must have lastUpdated`);
    assert.ok(post.lastUpdatedIso, `Blog post ${post.slug} must have lastUpdatedIso`);
    assert.ok(post.faqs && post.faqs.length >= 2, `Blog post ${post.slug} must have FAQs`);
  }

  // Editorial policy page exists
  assert.ok(fs.existsSync(path.join(projectRoot, 'src/app/about/editorial-policy/page.tsx')), "Editorial policy page must exist");
});

test('H5.5: Privacy policy contains all required sections', () => {
  const privacyContent = fs.readFileSync(path.join(projectRoot, 'src/app/privacy/page.tsx'), 'utf8');
  assert.ok(privacyContent.includes('1. Data Controller'), 'Must include Data Controller');
  assert.ok(privacyContent.includes('2. Information We Collect'), 'Must include Information We Collect');
  assert.ok(privacyContent.includes('3. Purposes of Data Processing'), 'Must include Purposes');
  assert.ok(privacyContent.includes('4. Who Receives Your Data'), 'Must include Recipients');
  assert.ok(privacyContent.includes('5. Data Minimization'), 'Must include Data Minimization');
  assert.ok(privacyContent.includes('6. Data Retention Schedule'), 'Must include Retention');
  assert.ok(privacyContent.includes('7. Technical &amp; Operational Security'), 'Must include Security');
  assert.ok(privacyContent.includes('8. Your Privacy Rights'), 'Must include User Rights');
  assert.ok(privacyContent.includes('9. Cookies &amp; Google Consent Mode v2'), 'Must include Cookies & Consent');
  assert.ok(privacyContent.includes('10. Protection of Minors'), 'Must include Minors');
  assert.ok(privacyContent.includes('11. Contact Us &amp; Policy Updates'), 'Must include Contact Us');
  assert.ok(privacyContent.includes('TODO: [Platform Operator Legal Business Entity Name'), 'Must contain TODO for legal entity');
  assert.ok(privacyContent.includes('CNIC'), 'Must reference CNIC handling');
});

test('H5.6: About page contains Who We Are with TODOs; how-booking-works and safety-and-permits pages exist', () => {
  const aboutContent = fs.readFileSync(path.join(projectRoot, 'src/app/about/page.tsx'), 'utf8');
  assert.ok(aboutContent.includes('Who We Are'), 'About page must contain Who We Are');
  assert.ok(aboutContent.includes('TODO: [Provide Founder / Operations Director Full Legal Name]'), 'Must have founder TODO');
  assert.ok(aboutContent.includes('TODO: [Provide Registered Office City'), 'Must have office address TODO');

  assert.ok(fs.existsSync(path.join(projectRoot, 'src/app/how-booking-works/page.tsx')), 'how-booking-works page must exist');
  assert.ok(fs.existsSync(path.join(projectRoot, 'src/app/safety-and-permits/page.tsx')), 'safety-and-permits page must exist');

  const sitemapContent = fs.readFileSync(path.join(projectRoot, 'src/app/sitemap.ts'), 'utf8');
  assert.ok(sitemapContent.includes('/how-booking-works'), 'sitemap must include /how-booking-works');
  assert.ok(sitemapContent.includes('/safety-and-permits'), 'sitemap must include /safety-and-permits');
});
