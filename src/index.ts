import "dotenv/config";
import { runEmailGraph } from "./entrypoints/runEmailGraph";
import { runTaskGraph } from "./entrypoints/runTaskGraph";

async function main() {
  const arg = process.argv[2]?.toLowerCase();

  switch (arg) {
    case "email":
      await runEmailGraph();
      break;
    case "task":
      await runTaskGraph();
      break;
    default:
      console.log("Usage: yarn start email | task");
      process.exit(1);
  }
}

main();
