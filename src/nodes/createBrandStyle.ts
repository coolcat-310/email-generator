import { z } from "zod";
import { stateSchema } from "../state/schema";
import { withValidation } from "../utility/withValidation";
import { extractBrandName } from "../utility/extractBrandName";

// Define all colors used in your hydrated HTML
const brandResources = {
  ENDPOINT: {
    logo: "https://cdn.prod.website-files.com/629dd25ce5542b0c7b8f8047/62bc58ec1f862550e79fed3d_Endpoint_Logo_Registered_Primary_200.svg",
    emailSignature: "The Endpoint Team",
    primaryColor: "#087EA8",     // links, buttons, headers
    secondaryColor: "#f5f5f7",   // page background
    textColor: "#222222",        // body text
    mutedTextColor: "#757575",   // footer text
    borderColor: "#e0e0e0",      // table borders
  },
  // 🎄 Christmas theme
  CHRISTMAS: {
    logo: "https://images.rawpixel.com/image_png_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjMxMS1uaW5nLTAzLWNocmlzdG1hc2JhZGdlc18xLnBuZw.png",  // update with your asset
    emailSignature: "Santa's Team 🎅",
    primaryColor: "#D62828",      // Christmas Red
    secondaryColor: "#F5F3F3",    // Soft snowy white
    textColor: "#222222",
    mutedTextColor: "#757575",
    borderColor: "#A4133C"
  },

  // 🎃 Halloween theme
  HALLOWEEN: {
    logo: "https://your-cdn.com/logos/halloween-logo.png",  // update with your asset
    emailSignature: "Spooky Support 👻",
    primaryColor: "#FF7518",      // Pumpkin orange
    secondaryColor: "#1B1B1B",    // Dark spooky background
    textColor: "#FFFFFF",
    mutedTextColor: "#CCCCCC",
    borderColor: "#FF7518"
  },
    // 🍀 St. Patrick's Day theme
  STPATRICK: {
    logo: "https://your-cdn.com/logos/stpatrick-logo.png",  // update with your asset
    emailSignature: "Lucky Support 🍀",
    primaryColor: "#1B5E20",      // Shamrock green
    secondaryColor: "#E8F5E9",    // Soft light green
    textColor: "#1B1B1B",
    mutedTextColor: "#4CAF50",
    borderColor: "#A5D6A7"
  },
  DEFAULT: {
    logo: "https://example.com/default-logo.png",
    emailSignature: "The Team",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    textColor: "#000000",
    mutedTextColor: "#666666",
    borderColor: "#cccccc",
  },
};

export function createBrandStyleNode() {
  return {
    id: "brand-style",
    description: "Provides brand-specific email theming details.",
    run: withValidation(
      stateSchema,
      async (state: z.infer<typeof stateSchema>) => {
        const extracted = state.userInput ? extractBrandName(state.userInput) : "DefaultBrand";
        console.log(`🔎 Extracted brandName: ${extracted}`);

        const normalizedKey = extracted.trim().toUpperCase();
        const resources = brandResources[normalizedKey as keyof typeof brandResources] ?? brandResources.DEFAULT;

        return {
          ...state,
          brandName: extracted,
          ...resources,
        };
      }
    ),
    ends: ["email-hydration"],
  };
}
