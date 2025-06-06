import "dotenv/config";
import { z } from "zod";
import { StateGraph, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

// Define schema
const stateSchema = z.object({
  userInput: z.string().optional(),
  content: z.string().optional(),
  timestamp: z.string().optional(),
  sentiment: z.string().optional(),
  result: z.string().optional(),
});

// Create graph with schema
const graph = new StateGraph(stateSchema);

// LLM setup
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

// Add nodes
graph.addNode("hello", async (state) => {
  const userInput = state.userInput ?? "Say Hello";
  const response = await model.invoke([{ role: "user", content: userInput }]);
  return {
    content: response.content,
    userInput,
    timestamp: new Date().toISOString(),
  };
});

graph.addNode("positive", async (state) => ({
  ...state,
  sentiment: "positive",
  result: "Glad to hear that!",
}));

graph.addNode("negative", async (state) => ({
  ...state,
  sentiment: "negative",
  result: "Sorry to hear that.",
}));

// Add conditional edges
graph.addConditionalEdges("hello", async (state) => {
  return state.content?.toLowerCase().includes("good") ? "positive" : "negative";
});

graph.addEdge("positive", END);
graph.addEdge("negative", END);

// ✅ THIS is the correct API for StateGraph
const app = graph.setEntryPoint("hello").compile();

// Run
const result = await app.invoke({ userInput: "I'm feeling good today!" });

console.log("🟢 LangGraph Output:", result?.result);
