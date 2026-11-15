async function checkPrivacy() {
  const res = await fetch("https://www.pakistantravel.agency/privacy");
  const html = await res.text();
  const aRegex = /<a\s+[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  let count = 0;
  let emptyCount = 0;
  while ((match = aRegex.exec(html)) !== null) {
    count++;
    const [full, inner] = match;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const hrefMatch = full.match(/href=["']([^"']*)["']/);
    const href = hrefMatch ? hrefMatch[1] : "";
    const ariaMatch = full.match(/aria-label=["']([^"']*)["']/);
    const aria = ariaMatch ? ariaMatch[1] : "";
    
    // Check if inner contains an img with alt
    const imgAltMatch = inner.match(/<img[^>]*alt=["']([^"']+)["']/);
    const imgAlt = imgAltMatch ? imgAltMatch[1] : "";

    if (!text && !aria && !imgAlt) {
      emptyCount++;
      console.log(`EMPTY ANCHOR #${emptyCount}:`, full);
    } else {
      console.log(`Link #${count}: href="${href}" | text="${text}" | aria="${aria}" | imgAlt="${imgAlt}"`);
    }
  }
}
checkPrivacy();
