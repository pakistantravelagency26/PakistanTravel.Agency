async function check() {
  for (const r of ["/login", "/register", "/partner-hub/login"]) {
    const res = await fetch("https://www.pakistantravel.agency" + r);
    const html = await res.text();
    const robots = (html.match(/name="robots" content="([^"]+)"/) || [])[1];
    console.log(r, "x-robots-tag:", res.headers.get("x-robots-tag"), "| meta robots:", robots);
  }
}
check();
