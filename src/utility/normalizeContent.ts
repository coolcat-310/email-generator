import { MessageContent, MessageContentComplex } from "@langchain/core/messages"; 

export function normalizeContent(content: MessageContent): string {
  if (typeof content === "string") return content;

  return content
    .map((part: MessageContentComplex) => {
      if (part.type === "text") {
        return part.text;
      } else {
        // You can choose to skip or stringify other types
        return "";
      }
    })
    .join(" ");
}
