export function parseTaskOutput(rawOutput: string): {
  taskName?: string;
  subject?: string;
  emailContent?: string;
} {
  const lines = rawOutput.split("\n").map(line => line.trim()).filter(Boolean);

  const dataLine = lines.find(line => line.startsWith("|") && !line.includes("Task Name"));  
  if (!dataLine) {
    console.warn("No data row found in model output.");
    return {};
  }

  // Split markdown table row on pipe
  const columns = dataLine.split("|").map(col => col.trim());

  const taskName = columns[1] ?? "";
  const subject = columns[2] ?? "";
  const emailContentRaw = columns.slice(3).join("|").trim();

  // Clean up email content
  const emailContent = emailContentRaw.replace(/\\n/g, "\n").trim();

  return {
    taskName,
    subject,
    emailContent,
  };
}
