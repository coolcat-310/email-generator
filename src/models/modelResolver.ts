import { createOpenAIModel } from "./openai";
import { createOllamaModel } from "./ollama";

export type ModelProvider = "openai" | "ollama";

export function createModel(modelType: ModelProvider) {
  switch (modelType) {
    case "openai":
      return createOpenAIModel();
    case "ollama":
      return createOllamaModel();
    default:
      throw new Error(`Unknown model type: ${modelType}`);
  }
}
