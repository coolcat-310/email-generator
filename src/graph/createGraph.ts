import { StateGraph, START } from '@langchain/langgraph';
import { ChatOpenAI } from "@langchain/openai";
import { stateSchema } from '../state/schema';
import { createEmailGeneratorNode, createHtmlRendererNode, createTextVerifierNode } from '../nodes';


export function buildEmailGraph(model: ChatOpenAI) {
  const graph = new StateGraph(stateSchema);

  // Register Nodes
  const emailGeneratorNode = createEmailGeneratorNode(model);
  graph.addNode(emailGeneratorNode.id, emailGeneratorNode.run, { ends: emailGeneratorNode.ends });

  const textVerifierNode = createTextVerifierNode(model);
  graph.addNode(textVerifierNode.id, textVerifierNode.run, { ends: textVerifierNode.ends });

  const htmlRendererNode = createHtmlRendererNode(model);
  graph.addNode(htmlRendererNode.id, htmlRendererNode.run, { ends: htmlRendererNode.ends });

  // Routing
  // @ts-expect-error - LangGraph expects a fixed set of node keys, and dynamic keys cause a type conflict
  graph.addEdge(START, emailGeneratorNode.id);
  // @ts-expect-error - LangGraph expects a fixed set of node keys, and dynamic keys cause a type conflict
  graph.addEdge(emailGeneratorNode.id, textVerifierNode.id);
  // @ts-expect-error - LangGraph expects a fixed set of node keys, and dynamic keys cause a type conflict
  graph.addConditionalEdges(textVerifierNode.id, async (state) =>
    state.approved ? htmlRendererNode.id : emailGeneratorNode.id
  );

  return graph.compile();
}