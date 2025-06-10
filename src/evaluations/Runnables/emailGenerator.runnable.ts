
import { RunnableLambda } from "@langchain/core/runnables";

import { createEmailGeneratorNode } from "../../nodes";
import { stateSchema } from "../../state/schema";
import { createOpenAIModel } from "../../models/openai";

const model = createOpenAIModel();
const node = createEmailGeneratorNode(model);

export const emailGeneratorRunnable = new RunnableLambda({
  func: async (input: unknown) => {
    if (typeof input !== "object" || input === null) {
      throw new Error("Invalid input received in RunnableLambda");
    }
    console.log("[Runnable] Received input:", input);

    const parsed = stateSchema.parse(input);
    const result = await node.run(parsed);
    const output = { emailContent: result.emailContent ?? "" };
    console.log("[Runnable] Returning output:", output);
    return output;
  },
});
