import { Example } from "langsmith/schemas";
import { v4 as uuidv4 } from 'uuid';

export const samples: Example[] = [
  {
    id: uuidv4(), 
    dataset_id: "d6a4ce04-dc5d-43ca-99df-24f47746fb57",
    inputs: {
      userInput: "Generate a welcome email for new Endpoint users.",
    },
    outputs: {
      emailContent: "",
    },
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
    runs: [],
  },
  {
    id: uuidv4(),
    dataset_id: "d6a4ce04-dc5d-43ca-99df-24f47746fb57",
    inputs: {
      userInput: "Welcome a user to the real estate platform.",
    },
    outputs: {
      emailContent: "",
    },
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
    runs: [],
  },
];
