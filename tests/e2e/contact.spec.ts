import { test, expect } from "@playwright/test";

/**
 * Smoke test: hero copy is visible, the contact form submits, and the
 * success state appears.
 */
test("hero renders and the contact form submits", async ({ page }) => {
  await page.goto("/");

  // Hero copy is present.
  await expect(
    page.getByRole("heading", { name: /Steadiness\. Depth\. Character\./i }),
  ).toBeVisible();

  // Jump to the contact section.
  await page.locator("#contact").scrollIntoViewIfNeeded();

  await page.fill("#fullName", "Jane Founder");
  await page.fill("#company", "Acme Inc.");
  await page.fill("#role", "Co-founder & CEO");
  await page.fill("#website", "https://acme.com");
  await page.fill("#email", "jane@acme.com");
  // Cognitive check — the SVG asks 2 + 3.
  await page.getByLabel("What is two plus three?").fill("5");

  await page.getByRole("button", { name: /begin a conversation/i }).click();

  // Success state crossfades in.
  await expect(
    page.getByRole("heading", { name: /We've received your note/i }),
  ).toBeVisible({ timeout: 10_000 });
});

test("the contact form blocks an invalid submission", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();

  await page.fill("#fullName", "J");
  await page.fill("#email", "nope");
  await page.getByRole("button", { name: /begin a conversation/i }).click();

  await expect(page.getByText(/enter your full name/i)).toBeVisible();
});
