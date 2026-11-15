import fs from 'fs';

const edits = [
  {
    file: 'src/app/(auth)/register/layout.tsx',
    search: 'Create an account to book verified guided tour packages across northern Pakistan.',
    replace: 'Create an account to book guided tour packages across northern Pakistan.'
  },
  {
    file: 'src/app/how-booking-works/page.tsx',
    search: 'verified operator contact phone numbers',
    replace: 'direct operator contact phone numbers'
  },
  {
    file: 'src/app/how-booking-works/page.tsx',
    search: 'Standard Platform Cancellation Guarantee',
    replace: 'Standard Platform Cancellation Policy'
  },
  {
    file: 'src/components/listing/ListingDetailClient.tsx',
    search: '<span className="font-semibold text-slate-800 block mb-1">Cancellation Guarantee</span>',
    replace: '<span className="font-semibold text-slate-800 block mb-1">Cancellation Policy</span>'
  },
  {
    file: 'src/components/listing/ListingDetailClient.tsx',
    search: 'Guaranteed seat reservation &amp; official tour voucher',
    replace: 'Confirmed seat reservation &amp; official tour voucher'
  },
  {
    file: 'src/app/confirmation/[id]/page.tsx',
    search: '? "Booking Confirmed & Guaranteed"',
    replace: '? "Booking Confirmed & Voucher Issued"'
  },
  {
    file: 'src/app/terms/page.tsx',
    search: 'dispute resolution guarantees offered by',
    replace: 'dispute resolution protections offered by'
  },
  {
    file: 'src/data/tourIntentsData.ts',
    search: 'verified operator contact information',
    replace: 'direct operator contact information'
  },
  {
    file: 'src/data/tourIntentsData.ts',
    search: 'verified hotel rooms',
    replace: 'reserved hotel rooms'
  },
  {
    file: 'src/app/tours/[intent]/page.tsx',
    search: 'directly from verified operators.',
    replace: 'directly from licensed local operators.'
  },
  {
    file: 'src/lib/chatProvider.ts',
    search: 'list verified tour packages on our platform',
    replace: 'list guided tour packages on our platform'
  },
  {
    file: 'src/lib/chatProvider.ts',
    search: 'independent local verified operators',
    replace: 'independent local operators'
  },
  {
    file: 'src/lib/chatProvider.ts',
    search: 'operating in verified information mode',
    replace: 'operating in factual information mode'
  },
  {
    file: 'src/lib/chatProvider.ts',
    search: 'explore verified tour packages',
    replace: 'explore guided tour packages'
  },
  {
    file: 'src/services/emailTemplates.service.ts',
    search: 'Local Verified Partner',
    replace: 'Local Tour Operator'
  },
  {
    file: 'src/services/emailTemplates.service.ts',
    search: 'Booking Confirmed & Guaranteed',
    replace: 'Booking Confirmed'
  },
  {
    file: 'src/lib/notifications.ts',
    search: 'Booking Confirmed & Guaranteed',
    replace: 'Booking Confirmed'
  }
];

for (const edit of edits) {
  if (fs.existsSync(edit.file)) {
    let content = fs.readFileSync(edit.file, 'utf8');
    if (content.includes(edit.search)) {
      content = content.replaceAll(edit.search, edit.replace);
      fs.writeFileSync(edit.file, content);
      console.log(`[UPDATED] ${edit.file}: replaced "${edit.search.slice(0, 30)}..."`);
    } else {
      console.warn(`[SKIPPED] ${edit.file}: search text not found: "${edit.search.slice(0, 30)}..."`);
    }
  } else {
    console.error(`[NOT FOUND] File ${edit.file} does not exist`);
  }
}
