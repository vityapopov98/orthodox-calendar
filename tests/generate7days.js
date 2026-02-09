import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import { generateWeekCalendar } from "./calendar.spec.ts";

const startDate = process.argv[2];
if (!startDate) {
  console.log("Usage: npx ts-node tests/generate7days.ts YYYY-MM-DD");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await generateWeekCalendar(page, startDate);

  await browser.close();
  console.log("7 PNG файлов календаря сохранены в папке output_calendar.");
})();
