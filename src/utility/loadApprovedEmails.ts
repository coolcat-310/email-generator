import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Utility to load previously approved email examples from markdown file.
 * The markdown file should contain three sections per record:
 * Task Name, Subject, and Email.
 */
export function loadApprovedEmails(): {
  taskName: string;
  subject: string;
  email: string;
}[] {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const markdownPath = path.join(__dirname, "../resources/approved-messages.md");
  const content = fs.readFileSync(markdownPath, "utf-8");

  const blocks = content
    .trim()
    .split(/^##+\s+/gm)
    .filter((block) => block.trim().length > 0);

  const examples = blocks.map((block) => {
    const lines = block.trim().split("\n").filter(Boolean);
    const cleanLines = lines.map((line) => line.trim());

    const taskLine = cleanLines.find((line) => line.startsWith("Task Name:"));
    const subjectLine = cleanLines.find((line) => line.startsWith("Subject:"));
    const emailLineIndex = cleanLines.findIndex((line) => line.startsWith("Email:"));

    const taskName = taskLine?.replace("Task Name:", "").trim() ?? "Unknown";
    const subject = subjectLine?.replace("Subject:", "").trim() ?? "No subject";
    const email = cleanLines.slice(emailLineIndex + 1).join("\n").trim();

    return { taskName, subject, email };
  });

  return examples;
}


