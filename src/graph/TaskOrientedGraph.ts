import { StateGraph, START, END } from "@langchain/langgraph";
import { createOllamaModel } from "../models/ollama";
import { createTaskGeneratorNode, createEmailHydrationNode, createBrandStyleNode } from "../nodes";
import { stateSchema } from "../state/schema";

export function buildTaskGraph() {
  const graph = new StateGraph(stateSchema);
  const ollamaModel = createOllamaModel();

  const taskNode = createTaskGeneratorNode(ollamaModel);
  graph.addNode(taskNode.id, taskNode.run, { ends: taskNode.ends });

  const brandStyleNode = createBrandStyleNode();
  graph.addNode(brandStyleNode.id, brandStyleNode.run, { ends: brandStyleNode.ends });


  const hydrationNode = createEmailHydrationNode();
  graph.addNode(hydrationNode.id, hydrationNode.run, { ends: hydrationNode.ends });

  // Routing
  // @ts-expect-error - dynamic node keys
  graph.addEdge(START, taskNode.id);
  // @ts-expect-error - dynamic node keys
  graph.addEdge(taskNode.id, brandStyleNode.id);

  // @ts-expect-error
 graph.addEdge(brandStyleNode.id, hydrationNode.id);

  // @ts-expect-error
  graph.addEdge(hydrationNode.id, END);
  return graph.compile();
}
