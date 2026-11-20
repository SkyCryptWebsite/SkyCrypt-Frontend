import { chromium } from "playwright";

const DEFAULT_PATHS = ["/", "/stats/tiltedhoney", "/stats/tiltedhoney/Kiwi/card", "/about", "/api-policy", "/newsroom"];

const [base = "http://localhost:5173", ...args] = process.argv.slice(2);
const paths = args.length > 0 ? args : DEFAULT_PATHS;
const origin = new URL(base).origin;
// Umami analytics rejects localhost by CORS in dev, which would fail every page.
const IGNORED = /\/api\/send\b|\/api\/websites\/[^/]+\/recorder|^Failed to load resource: net::ERR_FAILED$/;

const browser = await chromium.launch();
const context = await browser.newContext();

let failures = 0;

for (const path of paths) {
  const url = new URL(path, origin).href;
  const page = await context.newPage();
  const problems = [];

  page.on("console", (message) => {
    const text = message.text().split("\n")[0];
    if (message.type() === "error" && !IGNORED.test(text)) problems.push(`console: ${text}`);
  });
  page.on("pageerror", (error) => problems.push(`uncaught: ${error.message}`));
  page.on("requestfailed", (request) => {
    if (request.url().startsWith(origin)) {
      problems.push(`request failed: ${request.url()} (${request.failure()?.errorText})`);
    }
  });
  page.on("response", (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400) {
      problems.push(`${response.status()}: ${response.url()}`);
    }
  });

  try {
    const response = await page.goto(url, { waitUntil: "load", timeout: 30_000 });
    if (!response?.ok()) problems.push(`document ${response?.status() ?? "no response"}`);
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  } catch (error) {
    problems.push(`navigation: ${error.message.split("\n")[0]}`);
  }

  if (problems.length > 0) failures++;
  console.info(`${problems.length === 0 ? "ok  " : "FAIL"} ${url}`);
  for (const problem of [...new Set(problems)]) console.info(`     ${problem}`);
  await page.close();
}

await browser.close();
process.exit(failures > 0 ? 1 : 0);
