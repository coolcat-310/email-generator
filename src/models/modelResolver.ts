import { createOpenAIModel } from "./openai";
import { createOllamaModel } from "./ollama";

export function createModel(modelType: string) {
  switch (modelType.toLowerCase()) {
    case "openai":
      return createOpenAIModel();
    case "ollama":
      return createOllamaModel();
    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }
}
