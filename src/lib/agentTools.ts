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
  | "create_reminder"
  | "navigate_to_view";

export const TOOL_ICONS: Record<ToolName, string> = {
  search_web: "🔍",
  get_weather: "🌤️",
  get_local_weather: "📍",
  get_exchange_rate: "💱",
  create_reminder: "📝",
  navigate_to_view: "🧭",
};

export const TOOL_LABELS: Record<ToolName, string> = {
  search_web: "Searching the web",
  get_weather: "Fetching live weather",
  get_local_weather: "Locating & fetching weather",
  get_exchange_rate: "Getting exchange rate",
  create_reminder: "Creating reminder",
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
