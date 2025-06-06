import "dotenv/config";
import { z } from "zod";
import { END, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// 1. Define shared state
const stateSchema = z.object({
  userInput: z.string().optional(),
  content: z.string().optional(),
  timestamp: z.string().optional(),
  sentiment: z.string().optional(),
  result: z.string().optional(),
});

// 2. Instantiate the stateful graph
const graph = new StateGraph(stateSchema);

// 3. LLM setup
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

// 4. Add nodes with state logging
graph.addNode(
  "hello",
  async (state: Record<string, any>) => {
    console.log("🟡 Node: hello, State:", state);
    const userInput = state.userInput ?? "Say Hello";
    const response = await model.invoke([{ role: "user", content: userInput }]);
    return {
      content: response.content,
      userInput,
      timestamp: new Date().toISOString(),
    };
  },
  {
    ends: ["positive", "negative"],
  }
);

graph.addNode("positive", async (state: Record<string, any>) => {
  console.log("🟡 Node: positive, State:", state);
  return {
    ...state,
    sentiment: "positive",
    result: "Glad to hear that!",
  };
});

graph.addNode("negative", async (state: Record<string, any>) => {
  console.log("🟡 Node: negative, State:", state);
  return {
    ...state,
    sentiment: "negative",
    result: "Sorry to hear that.",
  };
});

// 5. Add conditional edges and flows
graph.addConditionalEdges("hello", async (state) =>
  state.content?.toLowerCase().includes("good") ? "positive" : "negative"
);
graph.addEdge("positive", END);
graph.addEdge("negative", END);
graph.addEdge("__start__", "hello");

// 6. Compile the graph
const app = graph.compile();

// 7. Run with LangSmith tracing enabled by ENV
const result = await app.invoke({ userInput: "I'm feeling happy today!" });

console.log("🟢 LangGraph Output:", result?.result);
