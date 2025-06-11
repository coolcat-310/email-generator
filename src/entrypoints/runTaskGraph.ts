import { buildTaskGraph } from "../graph/TaskOrientedGraph";

export async function runTaskGraph() {
  const taskApp = buildTaskGraph();

  const taskResult = await taskApp.invoke(
    { userInput: "be creative and think outside the box." },
    { runName: "task-generation" }
  );

  console.log("🏁 Task Graph Completed:", JSON.stringify(taskResult, null, 2));
}