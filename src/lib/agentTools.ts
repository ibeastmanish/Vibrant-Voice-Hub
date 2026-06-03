// OpenAI function-calling tool definitions
// These are the JSON schemas sent to the LLM so it knows what tools it can invoke.
// Actual execution happens in VoiceContext.tsx

export const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "search_web",
      description:
        "Search the web for real-time information, current events, news, facts, prices, or any question you cannot answer from training data. Always prefer this over guessing.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Precise search query to send to Google Search",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description:
        "Get live current weather conditions for any city in the world.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "Name of the city (e.g. 'Hyderabad', 'London')",
          },
        },
        required: ["city"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_local_weather",
      description:
        "Get live current weather conditions for the user's exact current physical location using GPS. Useful when the user asks 'what's the weather here' or 'fetch weather from my location'.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_exchange_rate",
      description:
        "Get live real-time currency exchange rates between two currencies.",
      parameters: {
        type: "object",
        properties: {
          from: {
            type: "string",
            description: "Source currency ISO code (e.g. 'USD', 'EUR')",
          },
          to: {
            type: "string",
            description: "Target currency ISO code (e.g. 'INR', 'GBP')",
          },
        },
        required: ["from", "to"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "issue_discount_code",
      description:
        "Issue a real personalised discount/coupon code to a customer as compensation or promotion. MUST be called when a customer is frustrated, reports a damaged/missing item, or asks for compensation.",
      parameters: {
        type: "object",
        properties: {
          percentage: {
            type: "number",
            description: "Discount percentage to offer (e.g. 20 for 20% off)",
          },
          reason: {
            type: "string",
            description: "Human-readable reason for the discount",
          },
        },
        required: ["percentage", "reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_reminder",
      description:
        "Create a task or reminder for the customer that will appear in their task list.",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The reminder or task text",
          },
          time: {
            type: "string",
            description: "When to remind, in plain English (e.g. 'tomorrow 9am')",
          },
        },
        required: ["text"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "track_order",
      description:
        "Look up and return live order tracking information for the customer's most recent or specified order.",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "Optional specific order ID to look up",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "process_refund",
      description:
        "Initiate a full or partial refund for a customer order. Returns a refund confirmation ID.",
      parameters: {
        type: "object",
        properties: {
          order_id: {
            type: "string",
            description: "The order ID to refund",
          },
          reason: {
            type: "string",
            description: "Reason for the refund",
          },
          amount: {
            type: "number",
            description: "Amount to refund in USD (omit for full refund)",
          },
        },
        required: ["reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate_to_view",
      description:
        "Navigate the app UI to a specific section when the user wants to go somewhere.",
      parameters: {
        type: "object",
        properties: {
          view: {
            type: "string",
            enum: ["Dashboard", "Chat", "Accessibility", "Profile"],
            description: "The view to navigate to",
          },
        },
        required: ["view"],
      },
    },
  },
] as const;

export type ToolName =
  | "search_web"
  | "get_weather"
  | "get_local_weather"
  | "get_exchange_rate"
  | "issue_discount_code"
  | "create_reminder"
  | "track_order"
  | "process_refund"
  | "navigate_to_view";

export const TOOL_ICONS: Record<ToolName, string> = {
  search_web: "🔍",
  get_weather: "🌤️",
  get_local_weather: "📍",
  get_exchange_rate: "💱",
  issue_discount_code: "🎟️",
  create_reminder: "📝",
  track_order: "📦",
  process_refund: "💸",
  navigate_to_view: "🧭",
};

export const TOOL_LABELS: Record<ToolName, string> = {
  search_web: "Searching the web",
  get_weather: "Fetching live weather",
  get_local_weather: "Locating & fetching weather",
  get_exchange_rate: "Getting exchange rate",
  issue_discount_code: "Issuing discount code",
  create_reminder: "Creating reminder",
  track_order: "Tracking order",
  process_refund: "Processing refund",
  navigate_to_view: "Navigating",
};

// Helper: WMO weather code → description
export const getWeatherCondition = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 9) return "Foggy";
  if (code <= 19) return "Drizzle";
  if (code <= 29) return "Rain";
  if (code <= 39) return "Snowfall";
  if (code <= 49) return "Sleet";
  if (code <= 59) return "Freezing drizzle";
  if (code <= 69) return "Heavy rain";
  if (code <= 79) return "Heavy snow";
  if (code <= 84) return "Rain showers";
  if (code <= 94) return "Thunderstorm";
  return "Severe thunderstorm";
};
