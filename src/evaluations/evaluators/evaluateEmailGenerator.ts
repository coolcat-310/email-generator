import "dotenv/config";
import { evaluate } from "langsmith/evaluation";
import { ChatOpenAI } from "@langchain/openai";
import { emailGeneratorRunnable } from "../Runnables/emailGenerator.runnable";
import { samples } from "../samples/emailGenerator.sample";

const model = new ChatOpenAI({ temperature: 0 });

const results = await evaluate(emailGeneratorRunnable, {
  data: samples,
  evaluators: [
    {
      name: "clarity-tone",
      type: "criteria",
      criteria: ["clarity", "conciseness", "tone"],
      llm: model,
    },
  ],
  projectName: "email-generator-eval",
  log: true,
});


console.dir(results, { depth: null });

