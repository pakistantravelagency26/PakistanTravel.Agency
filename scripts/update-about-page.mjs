import fs from 'fs';

const filePath = 'src/app/about/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace import
content = content.replace(
  'import { Compass, ShieldCheck, Heart, Award, Target, Eye, BookOpen } from "lucide-react";',
  'import { Compass, ShieldCheck, Heart, Award, Target, Eye, BookOpen, Users } from "lucide-react";\nimport { siteConfig } from "@/config/site";'
);

// Add Who We Are section
const targetStory = `{about.story}\n          </p>\n        </div>`;
const targetStoryCRLF = `{about.story}\r\n          </p>\r\n        </div>`;

const whoWeAreBlock = `

        {/* Who We Are */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Who We Are</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            PakistanTravel is an independent digital tourism marketplace dedicated to travel across northern Pakistan. We operate strictly as an intermediary platform connecting travelers directly with independent local tour operators who organize and guide each departure. We do not operate our own tour buses, hotels, or private guide services.
          </p>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <p><strong>Platform Ownership:</strong> PakistanTravel Intermediary Platform</p>
            <p><strong>Founder &amp; Principal Operations Lead:</strong> TODO: [Provide Founder / Operations Director Full Legal Name]</p>
            <p><strong>Registered Physical Office / Domicile:</strong> TODO: [Provide Registered Office City, Address &amp; SECP Registration Details]</p>
            <p><strong>Official Support Desk:</strong> <a href={\`mailto:\${siteConfig.contact.supportEmail}\`} className="text-sky-700 underline font-medium">{siteConfig.contact.supportEmail}</a></p>
            <p><strong>Operating Support Hours:</strong> {siteConfig.contact.supportHours.humanEmail}</p>
          </div>
        </div>`;

if (content.includes(targetStoryCRLF)) {
  content = content.replace(targetStoryCRLF, targetStoryCRLF + whoWeAreBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated src/app/about/page.tsx (CRLF)!');
} else if (content.includes(targetStory)) {
  content = content.replace(targetStory, targetStory + whoWeAreBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated src/app/about/page.tsx (LF)!');
} else {
  console.error('Target story block not found in src/app/about/page.tsx');
}
