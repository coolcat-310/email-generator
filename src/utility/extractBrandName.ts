export function extractBrandName(userInput: string): string {
  const match = userInput.match(/brandName[, ]+(\w+)/i);
  return match?.[1] ?? "DefaultBrand";
}
