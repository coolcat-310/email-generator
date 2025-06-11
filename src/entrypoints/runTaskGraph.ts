import { buildTaskGraph } from "../graph/TaskOrientedGraph";

export async function runTaskGraph() {
  const taskApp = buildTaskGraph();

  const taskResult = await taskApp.invoke(
    { userInput: "Generate Email content" },
    { runName: "task-generation" }
  );

  console.log("🏁 Task Graph Completed:", JSON.stringify(taskResult, null, 2));
}