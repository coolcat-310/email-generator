import { Ollama } from '@langchain/ollama';

export function createOllamaModel() {
  return new Ollama({
    model: 'llama3.2',
    baseUrl: 'http://localhost:11434',
    temperature: 0.7,
  });
}