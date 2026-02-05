import path from "path";

import { test, expect, Locator } from "@playwright/test";
import fs from "fs";

async function getCleanText(
  input: Locator | Locator[] | string | string[],
  capitalize = false
): Promise<string> {
  let arr: string[] = [];

  if (Array.isArray(input)) {
 
    for (const item of input) {
      if (typeof item === "string") arr.push(item);
      else arr.push((await item.allInnerTexts()).join(" "));
    }
  } else {

    if (typeof input === "string") arr = [input];
    else arr = [(await input.allInnerTexts()).join(" ")];
  }

  let text = arr
    .map(s => s.replace(/\n/g, " ").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");


  if (capitalize) {
    text = text
      .split(" ")
      .map(word => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""))
      .join(" ");
  }

  return text;
}

function generateCalendarHTML({
  day,
  newDay,
  oldDay,
  readings,
}: {
  day: string;
  newDay: string;
  oldDay: string;
  readings: string;
}): string {
  return `
    <style>
      @font-face {
        font-family: 'Roboto Slab';
        src: url('/public/RobotoSlab-VariableFont_wght.ttf') format('truetype');
        font-weight: 100 900;
        font-style: normal;
      }
      body, html {
        margin: 0;
        padding: 0;
        width: 2480px;
        height: 3508px;
        font-family: 'Roboto Slab', serif;
        background: #fafafa;
        box-sizing: border-box;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      .calendar {
        width: 2480px;
        height: 3508px;
        padding: 60px 80px;
        background-color: white;
        box-shadow: 0 0 15px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 40px;
      }
      .calendar-day {
        font-size: 48px;
        font-weight: 700;
        margin: 0 0 20px 0;
        border-bottom: 3px solid #333;
        padding-bottom: 10px;
        color: #222;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .calendar-day .weekday {
        font-size: 48px;
        font-weight: 700;
      }
      .calendar-day .date {
        font-size: 36px;
        font-weight: 600;
      }
      .calendar-styles-readings-container {
        display: flex;
        gap: 40px;
      }
      .calendar-style {
        background: #f5f5f7;
        border-radius: 12px;
        padding: 25px 30px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.03);
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .calendar-style h3 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 32px;
        color: #444;
        border-bottom: 2px solid #ccc;
        padding-bottom: 8px;
      }
      .calendar-style.new {
        background-color: #e8f0fe;
      }
      .calendar-style.old {
        background-color: #fff4e5;
      }
      .calendar-style p {
        font-size: 28px;
      }
      .calendar-readings {
        background: #fef9f4;
        border-radius: 12px;
        padding: 25px 30px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.03);
        flex: 1;
      }
      .calendar-readings h3 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 32px;
        color: #555;
        border-bottom: 2px solid #ddd;
        padding-bottom: 8px;
      }
      .calendar-readings p {
        font-size: 20px;
        line-height: 1.5;
        color: #333;
        margin: 0;
      }
      table {
        width: 50%;
        margin: 0 auto;
        border-collapse: separate;
        border-spacing: 12px 12px;
        font-size: 22px;
        color: #333;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      caption {
        caption-side: top;
        font-weight: 700;
        font-size: 28px;
        padding-bottom: 15px;
        color: #222;
        text-align: center;
      }
      th {
        background-color: #4c6ef5;
        color: white;
        padding: 18px 20px;
        text-align: left;
        font-weight: 600;
        border-radius: 8px 8px 0 0;
        user-select: none;
      }
      tbody tr {
        background-color: #f9fafb;
        border: 1px solid #ddd;
        border-radius: 8px;
        height: 120px;
      }
      tbody tr td {
        padding: 18px 20px;
        font-weight: 400;
        vertical-align: middle;
        text-align: left;
      }
    </style>
    <div class="calendar">
      <h2 class="calendar-day">
        <span class="weekday">${day}, ${newDay}</span>
      </h2>

      <div class="calendar-styles-readings-container">
        <div class="calendar-style new">
          <h3>Новый стиль</h3>
          <p>${newDay}
            <svg width="24" height="24" style="vertical-align: middle; margin-left: 8px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <g>
                <path d="M3 6.5C3 5.11929 4.11929 4 5.5 4H18.5C19.8807 4 21 5.11929 21 6.5V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V6.5Z" stroke="#4c6ef5" stroke-width="2" fill="#fff"/>
                <path d="M7 7V17" stroke="#4c6ef5" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M17 7V17" stroke="#4c6ef5" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7 7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7" stroke="#4c6ef5" stroke-width="1.5"/>
                <rect x="9" y="10" width="6" height="2" rx="1" fill="#e8f0fe"/>
                <rect x="9" y="13" width="6" height="2" rx="1" fill="#e8f0fe"/>
              </g>
            </svg>
          </p>
        </div>

        <div class="calendar-style old">
          <h3>Старый стиль</h3>
          <p>${oldDay}
            <svg width="24" height="24" style="vertical-align: middle; margin-left: 8px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-6-6h12" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </p>
        </div>

        <div class="calendar-readings">
          <h3>Чтения дня
            <svg width="24" height="24" style="vertical-align: middle; margin-left: 8px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-6-6h12" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </h3>
          <p>${readings}</p>
        </div>
      </div>

      <table>
        <caption>Меню дня</caption>
        <thead>
          <tr>
            <th>Завтрак</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="height: 100px; min-height: 100px;"><br><br><br></td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Обед</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="height: 100px; min-height: 100px;"><br><br><br></td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Ужин</th>
          </tr>
        </thead>
         <tbody>
          <tr>
            <td style="height: 100px; min-height: 100px;"><br><br><br></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

test("has title", async ({ page }) => {
  await page.goto("https://azbyka.ru/days/2026-02-23", { waitUntil: 'networkidle' });


  const calendar = page.locator("#calendar_day");
  const day = calendar.locator(".days.mob-hide");
  const newDay = calendar.locator(".newstyle");
  const oldDay = calendar.locator(".oldstyle");
  const chtenia = page.locator("#chteniya")
  const readings = chtenia.locator(".readings-text").locator("a.bibref")
  
  await expect(day).toBeVisible();
  await expect(newDay).toBeVisible();
  await expect(oldDay).toBeVisible();
  // await expect(readings).toBeVisible();

  const Day = await getCleanText(day, true);
  let NewDay = await getCleanText(newDay, true);
  let OldDay = await getCleanText(oldDay, true);

  NewDay = NewDay.replace(/^Новый стиль\s*/i, '');
  OldDay = OldDay.replace(/^Старый стиль\s*/i, '');

  const Readings = await getCleanText(readings, false);
  
  const html = generateCalendarHTML({
    day: Day,
    newDay: NewDay,
    oldDay: OldDay,
    readings: Readings,
  });

  console.log(html);

  await page.setContent(html);
  const calendarLocator = page.locator(".calendar");
  await calendarLocator.screenshot({ path: "calendar.png", width: 2480, height: 3508 });

  await expect(day).toBeVisible();
  await expect(newDay).toBeVisible();
  await expect(oldDay).toBeVisible();

  console.log("День:", Day);
  console.log("Новый стиль:", NewDay);
  console.log("Старый стиль:", OldDay);
  console.log("Чтения дня:", Readings);
 
  
  // Expect a title "to contain" a substring.
 
  
});

// npx playwright codegen --ignore-https-errors https://azbyka.ru/days/2026-02-23
// npx playwright test --ui

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" }),
//   ).toBeVisible();
// });

/**
 * Генерирует 7 PNG файлов календаря подряд начиная с указанной даты.
 * @param page Playwright Page
 * @param startDate строка даты в формате 'YYYY-MM-DD'
 */
export async function generateWeekCalendar(page, startDate: string) {
  // Ensure output directory exists
  const outputDir = path.join(__dirname, "output_calendar");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let currentDate = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    // Format date as YYYY-MM-DD
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    await page.goto(`https://azbyka.ru/days/${dateStr}`, { waitUntil: 'networkidle' });

    const calendar = page.locator("#calendar_day");
    const day = calendar.locator(".days.mob-hide");
    const newDay = calendar.locator(".newstyle");
    const oldDay = calendar.locator(".oldstyle");
    const chtenia = page.locator("#chteniya")
    const readings = chtenia.locator(".readings-text").locator("a.bibref")

    const Day = await getCleanText(day, true);
    let NewDay = await getCleanText(newDay, true);
    let OldDay = await getCleanText(oldDay, true);

    NewDay = NewDay.replace(/^Новый стиль\s*/i, '');
    OldDay = OldDay.replace(/^Старый стиль\s*/i, '');

    const Readings = await getCleanText(readings, false);

    const html = generateCalendarHTML({
      day: Day,
      newDay: NewDay,
      oldDay: OldDay,
      readings: Readings,
    });

    await page.setContent(html);
    const calendarLocator = page.locator(".calendar");
    await calendarLocator.waitFor({ state: "visible", timeout: 5000 });
    await page.waitForTimeout(200); // 200ms задержка для рендеринга
    const filePath = path.join(outputDir, `${dateStr}.png`);
    console.log(`Saving screenshot to: ${filePath}`);
    await calendarLocator.screenshot({ path: filePath, width: 2480, height: 3508 });

    // Следующий день
    currentDate.setDate(currentDate.getDate() + 1);
  }
}