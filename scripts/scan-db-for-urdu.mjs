import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('=== CHECKING DATABASE CONTENT FOR URDU & ROMAN URDU ===');

  // 1. Listings
  const listings = await prisma.listing.findMany({
    select: { id: true, title: true, description: true, city: true, slug: true, amenities: true }
  });
  console.log(`Checking ${listings.length} listings...`);
  for (const l of listings) {
    const text = `${l.title} ${l.description} ${l.city} ${l.slug} ${l.amenities}`;
    if (/[\u0600-\u06FF]/.test(text)) {
      console.log(`[URDU SCRIPT IN LISTING ${l.id} (${l.title})]`);
    }
    if (/\b(apka|aapka|karein|karwana|hoga|hogi|hotay|shukriya|rabta|tasdeeq|adaigi|wasool|bheje|intizar|zaroorat|chahiye|foran|k sath|ke sath|yeh|woh|nahi|nahin)\b/i.test(text)) {
      console.log(`[ROMAN URDU IN LISTING ${l.id} (${l.title})]`);
    }
  }

  // 2. SiteSetting
  const settings = await prisma.siteSetting.findMany();
  console.log(`Checking ${settings.length} site settings...`);
  for (const s of settings) {
    const text = JSON.stringify(s.value);
    if (/[\u0600-\u06FF]/.test(text)) {
      console.log(`[URDU SCRIPT IN SITE SETTING ${s.key}]`);
    }
    if (/\b(apka|aapka|karein|karwana|hoga|hogi|hotay|shukriya|rabta|tasdeeq|adaigi|wasool|bheje|intizar|zaroorat|chahiye|foran|k sath|ke sath|yeh|woh|nahi|nahin)\b/i.test(text)) {
      console.log(`[ROMAN URDU IN SITE SETTING ${s.key}]`);
    }
  }

  // 3. Email Outbox & Templates
  const emails = await prisma.emailOutbox.findMany({ take: 50 });
  console.log(`Checking ${emails.length} emails in outbox...`);
  for (const e of emails) {
    const text = `${e.subject} ${e.textBody}`;
    if (/[\u0600-\u06FF]/.test(text)) {
      console.log(`[URDU SCRIPT IN EMAIL ${e.id}]`);
    }
    if (/\b(apka|aapka|karein|karwana|hoga|hogi|hotay|shukriya|rabta|tasdeeq|adaigi|wasool|bheje|intizar|zaroorat|chahiye|foran|k sath|ke sath|yeh|woh|nahi|nahin)\b/i.test(text)) {
      console.log(`[ROMAN URDU IN EMAIL ${e.id}]`);
    }
  }

  // 4. Vendors
  const vendors = await prisma.vendor.findMany();
  console.log(`Checking ${vendors.length} vendors...`);
  for (const v of vendors) {
    const text = `${v.businessName} ${v.bio || ''} ${v.city || ''}`;
    if (/[\u0600-\u06FF]/.test(text)) {
      console.log(`[URDU SCRIPT IN VENDOR ${v.id}]`);
    }
    if (/\b(apka|aapka|karein|karwana|hoga|hogi|hotay|shukriya|rabta|tasdeeq|adaigi|wasool|bheje|intizar|zaroorat|chahiye|foran|k sath|ke sath|yeh|woh|nahi|nahin)\b/i.test(text)) {
      console.log(`[ROMAN URDU IN VENDOR ${v.id}]`);
    }
  }

  // 5. Reviews
  const reviews = await prisma.review.findMany();
  console.log(`Checking ${reviews.length} reviews...`);
  for (const r of reviews) {
    const text = `${r.comment || ''}`;
    if (/[\u0600-\u06FF]/.test(text)) {
      console.log(`[URDU SCRIPT IN REVIEW ${r.id}]`);
    }
    if (/\b(apka|aapka|karein|karwana|hoga|hogi|hotay|shukriya|rabta|tasdeeq|adaigi|wasool|bheje|intizar|zaroorat|chahiye|foran|k sath|ke sath|yeh|woh|nahi|nahin)\b/i.test(text)) {
      console.log(`[ROMAN URDU IN REVIEW ${r.id}]`);
    }
  }

  console.log('Database scan complete!');
}

checkDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
