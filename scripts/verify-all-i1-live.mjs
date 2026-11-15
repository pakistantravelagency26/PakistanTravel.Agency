import fs from "fs";

const BASE_URL = "https://www.pakistantravel.agency";

async function verifyAll() {
  console.log("=================================================");
  console.log("VERIFYING PART I1 LIVE PRODUCTION DEPLOYMENT");
  console.log("=================================================\n");

  // --- I1.8: llms.txt ---
  console.log("--- I1.8: llms.txt Live Check ---");
  const llmsRes = await fetch(`${BASE_URL}/llms.txt`, { cache: "no-store" });
  console.log(`HTTP Status: ${llmsRes.status}`);
  console.log(`Content-Type: ${llmsRes.headers.get("content-type")}`);
  const llmsBody = await llmsRes.text();
  console.log("First 300 chars of body:");
  console.log(llmsBody.slice(0, 300));
  console.log("\n-------------------------------------------------\n");

  // --- I1.7: robots.txt and X-Robots-Tag ---
  console.log("--- I1.7: robots.txt & Auth Routes X-Robots-Tag ---");
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`, { cache: "no-store" });
  const robotsText = await robotsRes.text();
  console.log("robots.txt content:\n" + robotsText);

  for (const path of ["/login", "/register", "/partner-hub/login"]) {
    const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store", redirect: "manual" });
    console.log(`${path} => Status: ${res.status}, X-Robots-Tag: ${res.headers.get("x-robots-tag")}`);
  }
  console.log("\n-------------------------------------------------\n");

  // --- I1.1: Footer and generic anchors ---
  console.log("--- I1.1: Footer Anchor on Live Homepage ---");
  const homeRes = await fetch(`${BASE_URL}/`, { cache: "no-store" });
  const homeHtml = await homeRes.text();
  const footerLearnMore = homeHtml.match(/<a[^>]+href=["']\/partner-info["'][^>]*>([\s\S]*?)<\/a>/i);
  console.log("Footer partner-info link HTML:", footerLearnMore ? footerLearnMore[0] : "Not found");
  console.log("Contains 'Learn about our partner tour operators':", homeHtml.includes("Learn about our partner tour operators"));
  console.log("Contains generic 'Learn more':", homeHtml.includes(">Learn more<"));
  console.log("\n-------------------------------------------------\n");

  // --- I1.5: /destinations intro & /terms TOC ---
  console.log("--- I1.5: /destinations Rendered Head & Body Intro ---");
  const destRes = await fetch(`${BASE_URL}/destinations`, { cache: "no-store" });
  const destHtml = await destRes.text();
  const destHead = destHtml.split("</head>")[0] + "</head>";
  console.log("First 35 lines of <head> on /destinations:");
  console.log(destHead.split("\n").slice(0, 35).join("\n"));
  console.log("\nIntro text in body:");
  const destIntroMatch = destHtml.match(/Northern Pakistan encompasses some of the highest mountain ranges on earth[\s\S]*?<\/div>/);
  console.log(destIntroMatch ? destIntroMatch[0].slice(0, 400) + "..." : "Intro not found in HTML");

  console.log("\n--- I1.5: /terms Table of Contents & Headings ---");
  const termsRes = await fetch(`${BASE_URL}/terms`, { cache: "no-store" });
  const termsHtml = await termsRes.text();
  const termsHead = termsHtml.split("</head>")[0] + "</head>";
  console.log("First 35 lines of <head> on /terms:");
  console.log(termsHead.split("\n").slice(0, 35).join("\n"));
  console.log("\nTable of Contents card in body:");
  const tocMatch = termsHtml.match(/Table of Contents[\s\S]*?<\/div>\s*<\/div>/);
  console.log(tocMatch ? tocMatch[0] : "TOC not found in HTML");
  console.log("\n-------------------------------------------------\n");

  // --- I1.6: /tours?destination=hunza check ---
  console.log("--- I1.6: /tours?destination=hunza Noindex Check ---");
  const queryRes = await fetch(`${BASE_URL}/tours?destination=hunza`, { cache: "no-store" });
  console.log(`/tours?destination=hunza => Status: ${queryRes.status}, X-Robots-Tag: ${queryRes.headers.get("x-robots-tag")}`);
  const queryHtml = await queryRes.text();
  const queryRobotsMeta = queryHtml.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  console.log("Query robots meta tag:", queryRobotsMeta ? queryRobotsMeta[0] : "None");
}

verifyAll().catch(console.error);
