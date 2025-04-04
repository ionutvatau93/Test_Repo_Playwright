import { test, expect } from "@playwright/test";

const GITHUB_TOKEN = "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"; //Here I used my own token but I deleted it, and I can provide it if needed
const REPO_OWNER = "microsoft";
const REPO_NAME = "vscode";
const BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
};
//I used serial to run in order
test.describe.serial("GitHub API Tests", () => {
  let createdIssueNumber: number;

  test("Retrieve a list of issues", async ({ request }) => {
    const response = await request.get(BASE_URL, { headers });
    expect(response.status()).toBe(200);

    const issues = await response.json();
    console.log(`Found ${issues.length} issues.`);
    expect(Array.isArray(issues)).toBeTruthy();
  });

  test("Create a new issue", async ({ request }) => {
    const issueData = {
      title: "Test Issue from Playwright",
      body: "This is a test issue created using Playwright.",
    };

    const response = await request.post(BASE_URL, {
      headers,
      data: issueData,
    });

    expect(response.status()).toBe(201);

    const issue = await response.json();
    console.log(`Created issue with ID: ${issue.id}`);
    createdIssueNumber = issue.number;

    // I am checking if the title and body are the correct ones
    expect(issue.title).toBe(issueData.title);
    expect(issue.body).toBe(issueData.body);
  });

  test("Retrieve the created issue and verify details", async ({ request }) => {
    const url = `${BASE_URL}/${createdIssueNumber}`;
    const response = await request.get(url, { headers });
    expect(response.status()).toBe(200);

    const issue = await response.json();
    console.log(`Retrieved issue #${issue.number}`);

    // I am checking if the title and body are the correct ones
    expect(issue.title).toBe("Test Issue from Playwright");
    expect(issue.body).toBe("This is a test issue created using Playwright.");
  });

  test("Close the created issue", async ({ request }) => {
    const url = `${BASE_URL}/${createdIssueNumber}`;
    const response = await request.patch(url, {
      headers,
      data: { state: "closed" },
    });

    expect(response.status()).toBe(200);

    const issue = await response.json();
    console.log(`Closed issue #${issue.number}`);

    // I check if it's closed
    expect(issue.state).toBe("closed");
  });

  test("Handle edge case: Missing fields when creating an issue", async ({
    request,
  }) => {
    const response = await request.post(BASE_URL, {
      headers,
      data: {},
    });

    // GitHub should return a 422 code (Unprocessable Entity)
    expect(response.status()).toBe(422);

    const errorResponse = await response.json();
    console.log(`Error message: ${errorResponse.message}`);
  });
});
