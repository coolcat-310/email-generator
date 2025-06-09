import { describe, it, expect } from 'vitest';
import { createEmailGeneratorNode } from './emailGenerator';

// Mock ChatOpenAI instance
class MockChatModel {
  async invoke(messages: { role: string; content: string }[]) {
    const prompt = messages[0].content;
    if (prompt.includes("Revise")) {
      return { content: "Revised email based on feedback." };
    }
    return { content: "Generated welcome email." };
  }
}

describe("email-generator node", () => {
  const model = new MockChatModel();
  const node = createEmailGeneratorNode(model as any);

  it("generates a welcome email without feedback", async () => {
    const state = { userInput: "Generate a welcome email" };
    const result = await node.run(state);
    expect(result.emailContent).toBe("Generated welcome email.");
  });

  it("generates a revised email with feedback", async () => {
    const state = {
      userInput: "Generate a welcome email",
      feedback: "Make it shorter and more casual.",
    };
    const result = await node.run(state);
    expect(result.emailContent).toBe("Revised email based on feedback.");
  });
});