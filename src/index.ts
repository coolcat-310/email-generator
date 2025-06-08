import "dotenv/config";
import { StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { stateSchema } from "./state/schema";
import { createEmailGeneratorNode, createHtmlRendererNode, createTextVerifierNode } from "./nodes";


const graph = new StateGraph(stateSchema);

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
});

// Register Nodes
const emailGeneratorNode = createEmailGeneratorNode(model);
graph.addNode(emailGeneratorNode.id, emailGeneratorNode.run, { ends: emailGeneratorNode.ends });


const textVerifierNode = createTextVerifierNode(model);
graph.addNode(
  textVerifierNode.id,
  textVerifierNode.run,
  { ends: textVerifierNode.ends }
);

const htmlRendererNode = createHtmlRendererNode(model);
graph.addNode(
  htmlRendererNode.id,
  htmlRendererNode.run,
  { ends: htmlRendererNode.ends }
);

// Routing
// @ts-ignore
graph.addEdge("__start__", emailGeneratorNode.id);
// @ts-ignore
graph.addEdge(emailGeneratorNode.id, textVerifierNode.id);
// @ts-ignore
graph.addConditionalEdges(textVerifierNode.id, async (state) =>
  state.approved ? htmlRendererNode.id : emailGeneratorNode.id
);

const app = graph.compile();
const result = await app.invoke(
  { userInput: "Generate a welcome email for new Endpoint users." },
  { runName: "welcome-email-html-generation" }
);

console.log("🏁 LangGraph Completed with state:", JSON.stringify(result, null, 2));
