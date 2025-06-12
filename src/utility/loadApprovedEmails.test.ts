import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import fs from "fs";

import { loadApprovedEmails } from "../utility/loadApprovedEmails";

vi.mock("fs");

function normalize(str: string) {
  return str.trim().replace(/\r?\n/g, "\n");
}

describe("loadApprovedEmails", () => {
  const mockMarkdownContent = `
## Example 1
Task Name: WelcomeEmail
Subject: Welcome to Endpoint!
Email:
Hello John,

Welcome to Endpoint. We're thrilled to have you.

---

## Example 2
Task Name: ReminderEmail
Subject: Complete your profile
Email:
Hi Sarah,

Please complete your profile before closing day.
`;

  beforeEach(() => {
    (fs.readFileSync as unknown as Mock).mockReturnValue(mockMarkdownContent);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("parses multiple email examples correctly", () => {
  const results = loadApprovedEmails();

  expect(results).toHaveLength(2);

  expect(results[0]).toEqual({
    taskName: "WelcomeEmail",
    subject: "Welcome to Endpoint!",
    email: [
      "Hello John,",
      "Welcome to Endpoint. We're thrilled to have you.",
      "---"
    ].join("\n")
  });

  expect(normalize(results[1].email)).toEqual(
  [
    "Hi Sarah,",
    "Please complete your profile before closing day."
  ].join("\n")
);

});


  it("handles missing sections gracefully", () => {
    const partialMarkdown = `
      ## Example 3
      Task Name: MissingSubject
      Email:
      No subject provided here.
      `;

    (fs.readFileSync as unknown as Mock).mockReturnValue(partialMarkdown);
    const results = loadApprovedEmails();

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      taskName: "MissingSubject",
      subject: "No subject",
      email: "No subject provided here."
    });
  });
});
