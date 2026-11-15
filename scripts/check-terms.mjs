async function checkTerms() {
  const res = await fetch("https://www.pakistantravel.agency/terms", { cache: "no-store" });
  const html = await res.text();
  console.log("Terms has id='section-1':", html.includes('id="section-1"'));
  console.log("Terms has Table of Contents:", html.includes("Table of Contents"));
  console.log("Terms has {COMMISSION_PERCENT}:", html.includes("A flat 10% platform commission is deducted"));
}
checkTerms();
