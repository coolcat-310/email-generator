import { z } from "zod";
import { stateSchema } from "../state/schema";
import { withValidation } from "../utility/withValidation";
import { extractBrandName } from "../utility/extractBrandName";

export function createBrandStyleNode() {
  return {
    id: "brand-style",
    description: "Provides brand-specific email theming details.",
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
        const extracted = state.userInput ? extractBrandName(state.userInput) : "DefaultBrand";
        console.log(`🔎 Extracted brandName: ${extracted}`);

        // For now: hardcoded for Endpoint
        const brandName = "Endpoint";
        const logo = "https://cdn.prod.website-files.com/629dd25ce5542b0c7b8f8047/62bc58ec1f862550e79fed3d_Endpoint_Logo_Registered_Primary_200.svg";
        const emailSignature = "The Endpoint Team";
        const primaryColor = "#087EA8";
        const secondaryColor = "#f5f5f7";

        return {
          ...state,
          brandName: extracted ?? brandName,
          logo,
          emailSignature,
          primaryColor,
          secondaryColor,
        };
      }
    ),
    ends: ['email-hydration'],
  };
}
