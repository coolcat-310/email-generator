import "dotenv/config";
import { buildEmailGraph } from "./graph/createGraph";
import { buildTaskGraph } from "./graph/TaskOrientedGraph";
import { createOpenAIModel } from "./models/openai";

let runEmailGraph: boolean = false;

if (runEmailGraph) {
// When running the buildEMailGraph
const model = createOpenAIModel();

const app = buildEmailGraph(model);
const result = await app.invoke(
  { userInput: "Generate a welcome email for new Endpoint users." },
  { runName: "welcome-email-html-generation" }
);

console.log("🏁 LangGraph Completed with state:", JSON.stringify(result, null, 2));
} else {

const taskApp = buildTaskGraph();

const taskResult = await taskApp.invoke(
  { userInput: "be creative and think outside the box." },
  { runName: "task-generation" }
);
console.log("🏁 Task Graph Completed with state:", JSON.stringify(taskResult, null, 2));
}
