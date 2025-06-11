export function extractEmailSection(rawOutput: string): string {
  const emailSplit = rawOutput.split("Email:");
  if (emailSplit.length < 2) {
    console.warn("⚠️ 'Email:' not found in LLM output.");
    return rawOutput.trim();
  }

  const emailSection = emailSplit[1].trim();

  // Optionally, clean up trailing markdown tables or signatures (heuristic)
  const cutoffIndex = emailSection.lastIndexOf("The Endpoint Team");
  if (cutoffIndex !== -1) {
    return emailSection.substring(0, cutoffIndex).trim();
  }

  return emailSection;
}
