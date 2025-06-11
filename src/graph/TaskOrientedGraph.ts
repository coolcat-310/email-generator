import { StateGraph } from "@langchain/langgraph";
import { createOllamaModel } from "../models/ollama";
import { createTaskGeneratorNode, createEmailHydrationNode } from "../nodes";
import { stateSchema } from "../state/schema";

export function buildTaskGraph() {
  const graph = new StateGraph(stateSchema);
  const ollamaModel = createOllamaModel();

  const taskNode = createTaskGeneratorNode(ollamaModel);
  graph.addNode(taskNode.id, taskNode.run, { ends: taskNode.ends });

  const hydrationNode = createEmailHydrationNode();
  graph.addNode(hydrationNode.id, hydrationNode.run, { ends: hydrationNode.ends });

  // Set as entry and exit
  // @ts-expect-error - dynamic node keys
  graph.addEdge("__start__", taskNode.id);
  // @ts-expect-error
  graph.addEdge(taskNode.id, hydrationNode.id);
  // @ts-expect-error
  graph.addEdge(hydrationNode.id, "__end__");
  return graph.compile();
}
