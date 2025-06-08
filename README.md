# ✉️ LangGraph Email Generator

This project is an AI-powered, multi-agent workflow built using [LangGraph](https://github.com/langchain-ai/langgraphjs). It generates polished welcome emails for new users of [Endpoint](https://www.endpoint.com/), verifies the tone and grammar of the content, and formats the final output as a styled HTML email.

## 🛠️ Tech Stack

- **LangGraph**: Framework for building multi-agent and multi-step stateful workflows.
- **LangChain + OpenAI**: Used to define agents powered by LLMs like `gpt-4o`.
- **LangSmith**: Observability and tracing platform for tracking runs and agent behavior.
- **Zod**: Runtime schema validation for graph state.
- **TypeScript**: Static typing and developer tooling.
- **ESLint**: Enforced code quality and standards.
- **dotenv**: Loads environment variables securely.

---

## 📦 Project Structure

```bash
src/
├── graph/
│   └── createGraph.ts          # Constructs and compiles the LangGraph
├── nodes/
│   ├── emailGenerator.ts       # Generates the welcome email
│   ├── textVerifier.ts         # Reviews and provides feedback
│   └── htmlRenderer.ts         # Renders final approved email into styled HTML
├── state/
│   └── schema.ts               # Zod schema defining the graph state
├── utility/
│   ├── loadApprovedEmails.ts   # Loads approved example emails for stylistic reference
│   ├── withMetadata.ts         # LangSmith metadata injection helper
│   └── withValidation.ts       # Optional input validation middleware for nodes
├── model/
│   └── chatModel.ts            # Encapsulates OpenAI model configuration
├── results/
│   └── email-output.html       # Final rendered email output
├── resources/
│   └── approved-messages.md    # Markdown of previously approved email examples
└── index.ts                    # Entry point: runs and invokes the graph
```

## ⚙️ Setup

1.Clone & Install

```bash
git clone https://github.com/your-username/email-generator.git
cd email-generator
yarn install
```

2. Configure Environment
   create a `.env` file:

```bash
OPENAI_API_KEY=your-openai-api-key
LANGCHAIN_API_KEY=your-langsmith-api-key
LANGCHAIN_PROJECT=email-generator
```

## 🚀 Running the Project

```bash
yarn start
```

The system will:

1. Generate a welcome email via the email-generator agent.

2. Send it to text-verifier for tone/grammar checks.

3. Loop until approved.

4. Once approved, forward it to html-renderer.

5. Save the HTML output to src/results/email-output.html.

## 🧠 Agents & Graph Flow
<img width="690" alt="Screenshot 2025-06-08 at 2 44 52 PM" src="https://github.com/user-attachments/assets/68528d08-5e09-4ae5-ae84-af8f5d3eb376" />


## 🔎 LangSmith Integration

LangSmith is used for tracing and debugging the workflow. Each run is automatically logged with:

- Agent input/output

- State transitions

- Feedback cycles

You can inspect each trace at smith.langchain.com (requires an API key and account).
