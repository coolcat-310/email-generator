import "dotenv/config";
import { z } from "zod";
import { END, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { promises as fs } from "fs";
import { loadApprovedEmails } from "./utility/loadApprovedEmails";

// Shared state definition
const stateSchema = z.object({
  userInput: z.string().optional(),
  emailContent: z.string().optional(),
  feedback: z.string().optional(),
  approved: z.boolean().optional(),
  htmlEmail: z.string().optional(),
});

const graph = new StateGraph(stateSchema);

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
});

graph.addNode("email-generator", async (state) => {
  console.log("✉️ [email-generator] Current State:", JSON.stringify(state, null, 2));
  const prompt = state.feedback
    ? `Revise the welcome email for Endpoint based on this feedback: "${state.feedback}".`
    : `Write a welcome email from Endpoint (https://www.endpoint.com/) for a new user. 
       Thank them and highlight Endpoint’s benefits. Keep it professional and appropriate for a business environment.`;

  const response = await model.invoke([{ role: "user", content: prompt }]);

  return { ...state, emailContent: response.content };
}, { ends: ["text-verifier"] });

graph.addNode("text-verifier", async (state) => {
  console.log("🕵️ [text-verifier] Reviewing State:", JSON.stringify(state, null, 2));

  const examples = loadApprovedEmails();

  const approvedEmailExamples = examples.map(
    (ex) => `Subject: ${ex.subject}\n\n${ex.email}`
  ).join("\n\n---\n\n");

  const verifyPrompt = `You are a business communications expert.

First, review the following set of previously approved welcome emails. These represent the desired writing style, tone, structure, and professionalism expected in all outgoing communications from Endpoint:

${approvedEmailExamples}

---

Now, evaluate the email below. Determine whether it aligns with the tone, clarity, grammar, and professional standards demonstrated above:

${state.emailContent}

---

If the email meets the expected standards, reply only with: "APPROVED".

If it does not, provide specific and constructive feedback for improvement. Your suggestions should include concrete examples of what to change and why, but do not rewrite the entire email. Focus only on clarity, tone, grammar, and stylistic alignment.`;


  const response = await model.invoke([{ role: "user", content: verifyPrompt }]);
  const content = typeof response.content === "string"
    ? response.content.trim()
    : "";

  const isApproved = content.toUpperCase().includes("APPROVED");

  if (isApproved) {
    console.log("✅ [text-verifier] Approved email content.");
    console.log("📬 Final Email:\n", state.emailContent);
    return { ...state, approved: true };
  }

  console.log("📝 [text-verifier] Suggested Improvements:", content);
  return { ...state, approved: false, feedback: content };
}, { ends: ["email-generator", "html-renderer"] });

graph.addNode(
  "html-renderer",
  async (state: z.infer<typeof stateSchema>) => {
    console.log("🎨 [html-renderer] Converting to HTML...");

    const renderPrompt = `Convert the following welcome email into a responsive HTML email using the branding from https://www.endpoint.com.
Use their brand colors (navy blue, white, light gray), and use real logo/icon URLs from their site when appropriate.
DO NOT include markdown code fences or explanatory text — only output the raw HTML.
Replace [User's Name], [support email], etc. with generic placeholders like user@example.com. Furthermore, ensure the footer includes the current year ${new Date().getFullYear()}.
---
${state.emailContent}`;

    const response = await model.invoke([{ role: "user", content: renderPrompt }]);

    let html = typeof response.content === "string" ? response.content : "";

    // 🧹 Cleanup: Remove backticks or triple backticks if any
    html = html.replace(/```html|```/g, "").trim();

    // 💾 Write to file
    const outputPath = "src/results/email-content.html";
    await fs.mkdir("src/results", { recursive: true });
    await fs.writeFile(outputPath, html, "utf8");

    console.log(`📄 HTML email saved to: ${outputPath}`);
    return { ...state, html };
  },
  {
    ends: [END],
  }
);

// Routing
// @ts-ignore
graph.addEdge("__start__", "email-generator");
// @ts-ignore
graph.addEdge("email-generator", "text-verifier");
// @ts-ignore
graph.addConditionalEdges("text-verifier", async (state) =>
  state.approved ? "html-renderer" : "email-generator"
);

const app = graph.compile();
const result = await app.invoke(
  { userInput: "Generate a welcome email for new Endpoint users." },
  { runName: "welcome-email-html-generation" }
);

console.log("🏁 LangGraph Completed with state:", JSON.stringify(result, null, 2));
