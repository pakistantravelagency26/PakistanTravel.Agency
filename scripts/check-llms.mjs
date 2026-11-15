async function checkLlms() {
  const res = await fetch("https://www.pakistantravel.agency/llms.txt");
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));
  console.log("Body preview:\n", text.slice(0, 300));
}
checkLlms();
