async function checkHost(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    console.log(`URL: ${url}`);
    console.log(`  Status: ${res.status}`);
    console.log(`  Location: ${res.headers.get("location")}`);
  } catch (e) {
    console.log(`URL: ${url} Error: ${e.message}`);
  }
}

async function run() {
  await checkHost("https://pakistantravel.agency/");
  await checkHost("http://www.pakistantravel.agency/");
  await checkHost("http://pakistantravel.agency/");
  await checkHost("https://www.pakistantravel.agency");
  await checkHost("https://www.pakistantravel.agency/");
}

run();
