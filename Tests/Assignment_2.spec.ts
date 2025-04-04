import { test, expect } from "@playwright/test";

test.describe("GitHub Issue Management", () => {
  const GITHUB_URL_LOGIN_PAGE = "https://github.com/login";
  const ISSUE_TITLE = "Test Issue";
  const ISSUE_BODY = "This is a test issue created by Playwright.";

  test("Create, Verify, and Close an Issue", async ({ page }) => {
    // Step 1: I navigate to Github and authenticate myself
    await page.goto(GITHUB_URL_LOGIN_PAGE);
    await page.fill("#login_field", "ionutvatau93"); // These are my real data, I will delete my password
    await page.fill("#password", "Telecom@nd@93");
    await page.click("input[value='Sign in']");

    // Step 2: I will navigate to the repository then to the assigned issue page
    await page.click("text=Test_Repo");
    await page.waitForTimeout(5000);
    await page.click("#issues-tab");
    await page.waitForTimeout(5000);

    // Step 3:I will create a new issue

    await page.locator("a.prc-Button-ButtonBase-c50BI").nth(2).click();
    await page.click("input[type=text][aria-required=true]");
    await page.fill("input[type=text][aria-required=true]", ISSUE_TITLE);
    await page.fill("textarea[aria-required=false]", ISSUE_BODY);
    await page.click(`button[data-testid="create-issue-button"]`);

    // Step 4: I am checking if the issue is visible after creation
    const createdIssue = await page.locator(`text=${ISSUE_TITLE}`);
    await expect(createdIssue).toBeVisible();

    // Step 5: I am closing the issue
    await createdIssue.click();
    await page.click("text=Close issue");
  });
});
