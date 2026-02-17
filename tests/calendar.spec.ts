import path from "path";

import { test, expect, Locator } from "@playwright/test";
import fs from "fs";

async function getCleanText(
  input: Locator | Locator[] | string | string[],
  capitalize = false,
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
    .map((s) => s.replace(/\n/g, " ").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");

  if (capitalize) {
    text = text
      .split(" ")
      .map((word) =>
        word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : "",
      )
      .join(" ");
  }

  return text;
}

function generateCalendarHTML({
  day,
  newDay,
  weekName,
  dayDescription,
  oldDay,
  readings,
}: {
  day: string;
  newDay: string;
  weekName: string;
  dayDescription: string;
  oldDay: string;
  readings: string;
}): string {
  return `<style>
  @font-face {
    font-family: "Roboto Slab";
    src: url("/public/RobotoSlab-VariableFont_wght.ttf") format("truetype");
    font-weight: 100 900;
    font-style: normal;
  }
  body,
  html {
    margin: 0;
    padding: 0;
    width: 2480px;
    height: 3508px;
    font-family: "Roboto Slab", serif;
    background: #fff;
    box-sizing: border-box;
    color: #000;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  .calendar {
    width: 2480px;
    height: 3508px;
    padding: 60px 80px;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .calendar-day {
    font-size: 80px;
    font-weight: 700;
    margin: 0 0 20px 0;
    border-bottom: 3px solid #000;
    padding-bottom: 10px;
    color: #000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .calendar-day .weekday {
    font-size: 80px;
    font-weight: 700;
    color: #000;
  }
  .calendar-day .date {
    font-size: 36px;
    font-weight: 600;
    color: #000;
  }
  .calendar-styles-readings-container {
    display: flex;
    gap: 40px;
  }
  .calendar-style {
    background: #dcdcdc;
    border-radius: 12px;
    padding: 25px 30px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.03);
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #000;
  }
  .calendar-style h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 40px;
    color: #000;
    border-bottom: 2px solid #999;
    padding-bottom: 8px;
  }
  .calendar-style.new {
    background-color: #f5f5f5;
  }
  .calendar-style.old {
    background-color: #f5f5f5;
  }
  .calendar-style p {
    font-size: 36px;
    color: #000;
  }
  .calendar-readings {
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 25px 30px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.03);
    flex: 1;
    color: #000;
  }
  .calendar-readings h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 40px;
    color: #000;
    border-bottom: 2px solid #999;
    padding-bottom: 8px;
  }
  .calendar-readings p {
    font-size: 36px;
    line-height: 1.5;
    color: #000;
    margin: 0;
    padding: 25px 0px;
  }
  table {
    width: 50%;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 12px 12px;
    font-size: 32px;
    color: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  caption {
    caption-side: top;
    font-weight: 700;
    font-size: 40px;
    padding-bottom: 15px;
    color: #000;
    text-align: center;
  }
  th {
    background-color: #e0e0e0;
    color: #000;
    padding: 18px 20px;
    text-align: left;
    font-weight: 600;
    border-radius: 8px 8px 0 0;
    user-select: none;
  }
  tbody tr {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 120px;
  }
  tbody tr td {
    padding: 18px 20px;
    font-weight: 400;
    vertical-align: middle;
    text-align: left;
    color: #000;
  }
</style>
<div class="calendar">
  <h2 class="calendar-day">
    <span class="weekday">${day}, ${newDay}</span>
  </h2>
  <h3 style="font-size: 48px">${dayDescription}</h3>

  <h3 style="font-size: 48px">${weekName}</h3>

  <div class="calendar-styles-readings-container">
    <div class="calendar-style new" style="flex: 1">
      <h3>Новый стиль</h3>
      <p>${newDay}</p>
    </div>

    <div class="calendar-style old" style="flex: 1">
      <h3>Старый стиль</h3>
      <p>${oldDay}</p>
    </div>

    <div
      class="calendar-readings"
      style="flex: 1; display: flex; flex-direction: column"
    >
      <h3>Чтения дня</h3>
      <p>${readings}</p>
    </div>
  </div>

  <div class="calendar-tables-container" style="display: flex; gap: 40px">
    <table>
      <caption>
        Список продуктов
      </caption>
      <tbody>
        <tr>
          <td style="padding: 0">
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <table>
      <caption>
        Меню дня
      </caption>
      <thead>
        <tr>
          <th style="text-align: center">Завтрак</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0">
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th style="text-align: center">Обед</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0">
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th style="text-align: center">Ужин</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 0">
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <table>
      <caption>
        Список дел
      </caption>
      <tbody>
        <tr>
          <td style="padding: 0">
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
            <div
              style="height: 80px; border-bottom: 1px solid #ccc; padding: 10px"
            >
              &nbsp;
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;
}

test("has title", async ({ page }) => {
  await page.goto("https://azbyka.ru/days/2026-02-23", {
    waitUntil: "networkidle",
  });

  const calendar = page.locator("#calendar_day");
  const day = calendar.locator(".days.mob-hide");
  const newDay = calendar.locator(".newstyle");
  const oldDay = calendar.locator(".oldstyle");
  const chtenia = page.locator("#chteniya");
  const readings = chtenia.locator(".readings-text").locator("a.bibref");

  await expect(day).toBeVisible();
  await expect(newDay).toBeVisible();
  await expect(oldDay).toBeVisible();
  // await expect(readings).toBeVisible();

  const Day = await getCleanText(day, true);
  let NewDay = await getCleanText(newDay, true);
  let OldDay = await getCleanText(oldDay, true);

  NewDay = NewDay.replace(/^Новый стиль\s*/i, "");
  OldDay = OldDay.replace(/^Старый стиль\s*/i, "");

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
  await calendarLocator.screenshot({
    path: "calendar.png",
    width: 2480,
    height: 3508,
  });

  await expect(day).toBeVisible();
  await expect(newDay).toBeVisible();
  await expect(oldDay).toBeVisible();

  console.log("День:", Day);
  console.log("Новый стиль:", NewDay);
  console.log("Старый стиль:", OldDay);
  console.log("Чтения дня:", Readings);

  // Expect a title "to contain" a substring.
});

test("Создать календарь на 7 дней", async ({ page }) => {
  await generateWeekCalendar(page, "2026-02-17");
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
  const outputDir = path.join(process.cwd(), "output_calendar");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let currentDate = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    // Format date as YYYY-MM-DD
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    await page.goto(`https://azbyka.ru/days/${dateStr}`, {
      waitUntil: "networkidle",
    });

    // dayinfo_color

    const calendar = page.locator("#calendar_day");
    const day = calendar.locator(".days.mob-hide");
    const weekName = page.locator(".day__post-wp.dayinfo_color");
    const dayDescription = page.locator(".text.day__text").locator("p");
    const newDay = calendar.locator(".newstyle");
    const oldDay = calendar.locator(".oldstyle");
    const chtenia = page.locator("#chteniya");
    const readings = chtenia.locator(".readings-text").locator("a.bibref");

    const Day = await getCleanText(day, true);
    let NewDay = await getCleanText(newDay, true);
    let OldDay = await getCleanText(oldDay, true);
    const weekNameText = await getCleanText(weekName, true);
    const dayDescriptionText = await getCleanText(dayDescription, true);

    NewDay = NewDay.replace(/^Новый стиль\s*/i, "");
    OldDay = OldDay.replace(/^Старый стиль\s*/i, "");

    const Readings = await getCleanText(readings, false);

    const html = generateCalendarHTML({
      day: Day,
      weekName: weekNameText,
      dayDescription: dayDescriptionText,
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
    await calendarLocator.screenshot({
      path: filePath,
      width: 2480,
      height: 3508,
    });

    // Следующий день
    currentDate.setDate(currentDate.getDate() + 1);
  }
}
