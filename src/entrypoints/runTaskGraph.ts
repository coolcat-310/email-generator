import { buildTaskGraph } from "../graph/TaskOrientedGraph";
import { createModel, ModelProvider } from "../models/modelResolver";

export async function runTaskGraph(modelArg: ModelProvider) {
  const model = createModel(modelArg);
  const taskApp = buildTaskGraph(model);

  const taskResult = await taskApp.invoke(
    { userInput: "Generate Email content for the brandName, Endpoint" },
    { runName: "task-generation" }
  );

  console.log("🏁 Task Graph Completed:", JSON.stringify(taskResult, null, 2));
}