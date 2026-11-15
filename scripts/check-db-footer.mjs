import { prisma } from "../src/lib/prisma.ts";

async function check() {
  const s = await prisma.siteSetting.findUnique({ where: { key: "FOOTER" } });
  console.log("DB FOOTER setting exists:", Boolean(s));
  if (s) {
    console.log("DB col1Links:", s.value?.col1Links?.length);
    console.log("DB col2Links:", s.value?.col2Links?.length);
  }
}
check().finally(() => prisma.$disconnect());
