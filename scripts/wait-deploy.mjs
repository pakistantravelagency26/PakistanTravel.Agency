import https from 'https';

async function checkDeploy() {
  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 6000));
    try {
      const res = await fetch('https://www.pakistantravel.agency/destinations', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      if (html.includes('/og?title=')) {
        console.log(`[DEPLOY SUCCESS] New deployment bccd70a is LIVE! (/og found on /destinations)`);
        return true;
      } else {
        console.log(`[WAITING] Attempt ${i+1}: old deployment still serving...`);
      }
    } catch(e) {
      console.log(`[RETRY] ${e.message}`);
    }
  }
  return false;
}

await checkDeploy();
