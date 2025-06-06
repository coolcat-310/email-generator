import "dotenv/config";
import { z } from "zod";
import { END, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs/promises";

// 1. Define shared state
const stateSchema = z.object({
  userInput: z.string().optional(),
  emailContent: z.string().optional(),
  feedback: z.string().optional(),
  approved: z.boolean().optional(),
});

// 2. Instantiate the graph
const graph = new StateGraph(stateSchema);

// 3. Chat model setup
const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
});

// 4. Agent: email-generator
graph.addNode(
  "email-generator",
  async (state: z.infer<typeof stateSchema>) => {
    console.log("\u2709\ufe0f [email-generator] Current State:", JSON.stringify(state, null, 2));
    const prompt = state.feedback
      ? `Revise the welcome email for Endpoint based on this feedback: "${state.feedback}".`
      : `Write a welcome email from Endpoint (https://www.endpoint.com/) for a new user. 
         The email should thank them and highlight the benefits of using Endpoint. 
         Keep it professional and appropriate for a business environment.`;

    const response = await model.invoke([{ role: "user", content: prompt }]);

    return {
      ...state,
      emailContent: response.content,
    };
  },
  {
    ends: ["text-verifier"],
  }
);

// 5. Agent: text-verifier
graph.addNode(
  "text-verifier",
  async (state: z.infer<typeof stateSchema>) => {
    console.log("\ud83d\udd75\ufe0f [text-verifier] Reviewing State:", JSON.stringify(state, null, 2));
    const verifyPrompt = `Review the following email for grammatical correctness and business tone:
---
${state.emailContent}
---
If the text is suitable, reply with: "APPROVED".
If improvements are needed, suggest what to improve without rewriting the whole email.`;

    const response = await model.invoke([{ role: "user", content: verifyPrompt }]);
    let content: string;
    if (typeof response.content === "string") {
      content = response.content.trim();
    } else if (Array.isArray(response.content)) {
      content = response.content.map((c: any) => (typeof c === "string" ? c : c.text ?? "")).join(" ").trim();
    } else if (typeof response.content === "object" && response.content !== null && "text" in response.content) {
      content = (response.content as any).text.trim();
    } else {
      content = "";
    }
    const isApproved = content.toUpperCase().includes("APPROVED");

    if (isApproved) {
      console.log("\u2705 [text-verifier] Approved email content.");
      console.log("\ud83d\udcec Final Email:\n", state.emailContent);
      return { ...(state ?? {}), approved: true };
    }

    console.log("\ud83d\udcdd [text-verifier] Suggested Improvements:", content);
    return {
      ...state,
      approved: false,
      feedback: content,
    };
  },
  {
    ends: ["email-generator", END],
  }
);

// 6. Routing Logic
// @ts-ignore type checking for edges
graph.addEdge("__start__", "email-generator");
// @ts-ignore type checking for edges
graph.addEdge("email-generator", "text-verifier");
// @ts-ignore type checking for edges
graph.addConditionalEdges("text-verifier", async (state) =>
  (state as z.infer<typeof stateSchema>).approved ? END : "email-generator"
);

// 7. Compile the graph
const app = graph.compile({});

// 8. Run the graph
const result = await app.invoke(
  { userInput: "Generate a welcome email for new Endpoint users." },
  { runName: "welcome-email-generation-loop" }
);

console.log("\ud83c\udf81 LangGraph Completed with state:", JSON.stringify(result, null, 2));

// 9. Save final email content to file
if (result.approved && result.emailContent) {
  await fs.writeFile("src/results/email-content.txt", result.emailContent, "utf-8");
  console.log("\ud83d\udcc1 Email content saved to src/results/email-content.txt");
} else {
  console.warn("\u26a0\ufe0f Email not saved: content missing or not approved.");
}
