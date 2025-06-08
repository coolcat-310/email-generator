import "dotenv/config";
import { buildEmailGraph } from "./graph/createGraph";
import { createOpenAIModel } from "./models/openai";

const model = createOpenAIModel();

const app = buildEmailGraph(model);
const result = await app.invoke(
  { userInput: "Generate a welcome email for new Endpoint users." },
  { runName: "welcome-email-html-generation" }
);

console.log("🏁 LangGraph Completed with state:", JSON.stringify(result, null, 2));
