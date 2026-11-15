import fs from 'fs';

let content = fs.readFileSync('src/app/destinations/[slug]/page.tsx', 'utf8');

const target = `<p className="text-sm sm:text-base text-slate-200 max-w-2xl font-normal leading-relaxed">
            {dest.tagline}
          </p>
        </div>`;

const replacement = `<p className="text-sm sm:text-base text-slate-200 max-w-2xl font-normal leading-relaxed">
            {dest.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
            <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Last updated: November 2026 · PakistanTravel Editorial Desk</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Rates and travel durations are seasonal estimates</span>
            </span>
          </div>
        </div>`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  const updated = normContent.replace(normTarget, replacement);
  fs.writeFileSync('src/app/destinations/[slug]/page.tsx', updated);
  console.log('Successfully updated destinations/[slug]/page.tsx with visible Last updated!');
} else {
  console.error('Target not found in destinations/[slug]/page.tsx');
}
