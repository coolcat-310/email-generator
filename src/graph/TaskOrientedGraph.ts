import { StateGraph } from "@langchain/langgraph";
import { createOllamaModel } from "../models/ollama";
import { createTaskGeneratorNode } from "../nodes/taskGenerator";
import { stateSchema } from "../state/schema";

export function buildTaskGraph() {
  const graph = new StateGraph(stateSchema);
  const ollamaModel = createOllamaModel();
  const taskNode = createTaskGeneratorNode(ollamaModel);
  graph.addNode(taskNode.id, taskNode.run, { ends: taskNode.ends });
  // Set as entry and exit
  // @ts-expect-error - dynamic node keys
  graph.addEdge("__start__", taskNode.id);
  // @ts-expect-error - dynamic node keys
  graph.addEdge(taskNode.id, "__end__");
  return graph.compile();
}
