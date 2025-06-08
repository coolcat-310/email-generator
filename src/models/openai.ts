import { ChatOpenAI } from "@langchain/openai";

export function createOpenAIModel() {
  return new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7,
  });
}
