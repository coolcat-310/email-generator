import "dotenv/config";
import { runEmailGraph } from "./entrypoints/runEmailGraph";
import { runTaskGraph } from "./entrypoints/runTaskGraph";
import { ModelProvider } from "./models/modelResolver";

async function main() {
  const arg = process.argv[2]?.toLowerCase();
  const modelArg = (process.argv[3]?.toLowerCase() || "openai") as ModelProvider;

  switch (arg) {
    case "email":
      await runEmailGraph();
      break;
    case "task":
      if (!modelArg) {
        console.error("Please provide a model argument for task graph.");
      }
      await runTaskGraph(modelArg);
      break;
    default:
      console.log("Usage: yarn start email | task");
      process.exit(1);
  }
}

main();
