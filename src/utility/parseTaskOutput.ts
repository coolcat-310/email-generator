export function parseTaskOutput(rawOutput: string): {
  taskName?: string;
  subject?: string;
  emailContent?: string;
} {
  const lines = rawOutput.split("\n").map(line => line.trim()).filter(Boolean);

  // First, check if we see any markdown table row
  const dataLine = lines.find(line => line.startsWith("|") && line.endsWith("|") && (line.match(/\|/g) ?? []).length >= 3);

  if (dataLine) {
    const columns = dataLine.split("|").map(col => col.trim());
    const taskName = columns[1] ?? "";
    const subject = columns[2] ?? "";
    const emailContentRaw = columns[3] ?? "";
    const emailContent = emailContentRaw.replace(/\\n/g, "\n").trim();
    return { taskName, subject, emailContent };
  }

  // If no markdown found, fallback: simple `Email Content` header parsing
  const emailContentIndex = lines.findIndex(line => line.toLowerCase().startsWith("email content"));

  if (emailContentIndex >= 0 && emailContentIndex + 1 < lines.length) {
    const emailContent = lines.slice(emailContentIndex + 1).join("\n").trim();
    return { emailContent };
  }

  // Fallback if we detect neither
  console.warn("⚠️ Unrecognized output format.");
  return {};
}
