import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAppContext } from "./AppContext";
import {
  TOOL_DEFINITIONS,
  TOOL_ICONS,
  TOOL_LABELS,
  getWeatherCondition,
  type ToolName,
} from "../lib/agentTools";
import { addToast } from "../components/ui/Toast";

export type VoiceState = "idle" | "listening" | "processing" | "error";
export type UserSentiment = "Positive" | "Neutral" | "Frustrated" | "Unknown";

export interface AgentThought {
  id: string;
  tool: ToolName;
  args: Record<string, any>;
  status: "running" | "done" | "error";
  result?: string;
  icon: string;
  label: string;
}

interface VoiceContextProps {
  voiceState: VoiceState;
  waveformLevels: number[];
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  liveTranscript: string;
  conversationHistory: { role: string; content: string }[];
  speak: (text: string) => void;
  auditLogs: any[];
  setAuditLogs: React.Dispatch<React.SetStateAction<any[]>>;
  processIntent: (transcript: string) => Promise<void>;
  userSentiment: UserSentiment;
  agentThoughts: AgentThought[];
  currentToolLabel: string;
}

const VoiceContext = createContext<VoiceContextProps | undefined>(undefined);

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SERPER_KEY = "e87587541b1b8d66cb3a11f097ecafc8df7dfb80";
const MAX_AGENT_ITERATIONS = 6;

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    setActiveView,
    activeOrder,
    setActiveOrder,
    tasks,
    setTasks,
    customerName,
    setDiscountCode,
  } = useAppContext();

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const voiceStateRef = useRef<VoiceState>("idle");
  // Keep ref in sync with state for use in event listeners
  useEffect(() => { voiceStateRef.current = voiceState; }, [voiceState]);
  const [waveformLevels, setWaveformLevels] = useState<number[]>(
    Array(24).fill(0.1)
  );
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [userSentiment, setUserSentiment] = useState<UserSentiment>("Neutral");
  const [agentThoughts, setAgentThoughts] = useState<AgentThought[]>([]);
  const [currentToolLabel, setCurrentToolLabel] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  // We use a ref for processIntent so the speech recognition callback always has latest version
  const processIntentRef = useRef<(t: string) => Promise<void>>(async () => {});

  // ─── REAL TOOL EXECUTION ───────────────────────────────────────────────────
  const executeTool = useCallback(
    async (name: ToolName, args: Record<string, any>): Promise<string> => {
      try {
        switch (name) {
          // ── Search the web (Serper.dev) ──────────────────────────────────
          case "search_web": {
            const res = await fetch("https://google.serper.dev/search", {
              method: "POST",
              headers: {
                "X-API-KEY": SERPER_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ q: args.query }),
            });
            const data = await res.json();
            const results = (data.organic ?? [])
              .slice(0, 4)
              .map((r: any) => `${r.title}: ${r.snippet}`)
              .join("\n");
            return results || "No web results found.";
          }

          // ── Live weather (Open-Meteo — free, no key) ────────────────────
          case "get_weather": {
            const geoRes = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(args.city)}&count=1&language=en&format=json`
            );
            const geoData = await geoRes.json();
            const loc = geoData.results?.[0];
            if (!loc) return `Could not find city: ${args.city}`;

            const wRes = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius`
            );
            const wData = await wRes.json();
            const c = wData.current;
            return JSON.stringify({
              city: loc.name,
              country: loc.country,
              temperature: `${c.temperature_2m}°C`,
              humidity: `${c.relative_humidity_2m}%`,
              wind: `${c.wind_speed_10m} km/h`,
              condition: getWeatherCondition(c.weather_code),
            });
          }

          // ── Exchange rates (ExchangeRate-API — free) ─────────────────────
          case "get_exchange_rate": {
            const res = await fetch(
              `https://api.exchangerate-api.com/v4/latest/${args.from.toUpperCase()}`
            );
            const data = await res.json();
            const rate = data.rates?.[args.to.toUpperCase()];
            if (!rate) return `Exchange rate not found for ${args.from} → ${args.to}`;
            return JSON.stringify({
              from: args.from.toUpperCase(),
              to: args.to.toUpperCase(),
              rate: rate.toFixed(4),
              updated: data.date,
            });
          }

          // ── Issue a real discount code ────────────────────────────────────
          case "issue_discount_code": {
            const code = `AURA-${Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase()}`;
            setDiscountCode({
              code,
              percentage: args.percentage,
              reason: args.reason,
            });
            return JSON.stringify({
              code,
              percentage: args.percentage,
              message: `Discount code ${code} (${args.percentage}% off) has been activated on your account.`,
            });
          }

          // ── Create reminder / task ────────────────────────────────────────
          case "create_reminder": {
            const reminder = `${args.text}${args.time ? ` — ${args.time}` : ""}`;
            setTasks((prev: string[]) => [...prev, reminder]);
            return JSON.stringify({ success: true, reminder });
          }

          // ── Order tracking ────────────────────────────────────────────────
          case "track_order": {
            const orderId =
              args.order_id ||
              activeOrder?.id ||
              `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
            const statuses = [
              "Order Confirmed",
              "Processing",
              "Shipped",
              "Out for Delivery",
              "Delivered",
            ];
            const status = activeOrder?.status || statuses[2]; // Shipped by default
            const eta = new Date(
              Date.now() + 2 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            });
            const order = {
              id: orderId,
              status,
              estimatedDelivery: eta,
              trackingCarrier: "FedEx",
              lastLocation: "Hyderabad Sorting Facility",
              lastUpdate: new Date().toLocaleTimeString(),
            };
            setActiveOrder(order);
            return JSON.stringify(order);
          }

          // ── Refund ────────────────────────────────────────────────────────
          case "process_refund": {
            const refundId = `REF-${Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase()}`;
            setActiveOrder((prev: any) =>
              prev
                ? { ...prev, status: "Refund Initiated" }
                : {
                    id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
                    status: "Refund Initiated",
                  }
            );
            return JSON.stringify({
              refundId,
              status: "Initiated",
              processingDays: "3-5 business days",
              amount: args.amount ? `$${args.amount}` : "Full order amount",
            });
          }

          // ── Navigate ──────────────────────────────────────────────────────
          case "navigate_to_view": {
            setActiveView(args.view as any);
            return JSON.stringify({ success: true, navigatedTo: args.view });
          }

          default:
            return `Unknown tool: ${name}`;
        }
      } catch (err: any) {
        return `Tool error: ${err?.message ?? String(err)}`;
      }
    },
    [activeOrder, setActiveOrder, setActiveView, setDiscountCode, setTasks]
  );

  // ─── AGENTIC LOOP ──────────────────────────────────────────────────────────
  const processIntent = useCallback(
    async (transcript: string) => {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
      if (!apiKey) {
        setLiveTranscript("Missing OpenRouter API Key in .env");
        setVoiceState("error");
        return;
      }

      setVoiceState("processing");
      setAgentThoughts([]);

      // Detect sentiment quickly (keyword-based, instant, no API call)
      const lower = transcript.toLowerCase();
      const isFrustrated =
        lower.includes("furious") ||
        lower.includes("angry") ||
        lower.includes("terrible") ||
        lower.includes("empty") ||
        lower.includes("missing") ||
        lower.includes("broken") ||
        lower.includes("useless") ||
        lower.includes("worst");
      const isPositive =
        lower.includes("thank") ||
        lower.includes("great") ||
        lower.includes("love") ||
        lower.includes("amazing") ||
        lower.includes("perfect");
      setUserSentiment(isFrustrated ? "Frustrated" : isPositive ? "Positive" : "Neutral");

      // Build messages array for this turn
      const systemPrompt = `You are Aura, an elite autonomous voice-first Customer Experience AI at Vyntra.
You are assisting ${customerName} — a VIP customer.
Current date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.

CRITICAL RULES:
- You have access to powerful real tools. USE THEM. Do not guess or make up information — call the appropriate tool.
- If the customer asks about weather, exchange rates, current events, or anything requiring real-time data → call the tool.
- If the customer is frustrated, complains about a missing/broken item, or asks for compensation → IMMEDIATELY call issue_discount_code with at least 20%.
- If asked to track an order → call track_order.
- If asked for a refund → call process_refund.
- If asked to search for something → call search_web.
- After ALL tool calls complete, give a warm, personalised spoken response using the tool results.
- Be concise in your final response — it will be spoken aloud.
- Never say "I cannot" or "I don't have access" — you have tools for everything.
- Address the customer as ${customerName} naturally.

Customer's task list: ${JSON.stringify(tasks)}`;

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: transcript },
      ];

      let finalResponse = "";

      // ── Iterative agentic loop ──────────────────────────────────────────
      for (let iteration = 0; iteration < MAX_AGENT_ITERATIONS; iteration++) {
        let data: any;
        try {
          const res = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "HTTP-Referer": "https://vibrant-voice-hub.web.app",
                "X-Title": "Vyntra CX Agent",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages,
                tools: TOOL_DEFINITIONS,
                tool_choice: "auto",
              }),
            }
          );

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`OpenRouter ${res.status}: ${errText}`);
          }

          data = await res.json();
        } catch (fetchErr: any) {
          console.error("API error:", fetchErr);
          setLiveTranscript("Error connecting to AI. Please try again.");
          setVoiceState("error");
          setTimeout(() => setVoiceState("idle"), 3000);
          return;
        }

        const assistantMessage = data.choices?.[0]?.message;
        if (!assistantMessage) break;

        // Push assistant message (may include tool_calls)
        messages.push(assistantMessage);

        // ── If no tool calls → we have the final response ──────────────
        if (!assistantMessage.tool_calls?.length) {
          finalResponse = assistantMessage.content ?? "";
          break;
        }

        // ── Execute each tool call ──────────────────────────────────────
        for (const toolCall of assistantMessage.tool_calls) {
          const name = toolCall.function.name as ToolName;
          const args = JSON.parse(toolCall.function.arguments ?? "{}");

          const thoughtId = `${name}-${Date.now()}`;
          const thought: AgentThought = {
            id: thoughtId,
            tool: name,
            args,
            status: "running",
            icon: TOOL_ICONS[name] ?? "⚙️",
            label: TOOL_LABELS[name] ?? name,
          };

          setAgentThoughts((prev) => [...prev, thought]);
          setCurrentToolLabel(`${thought.icon} ${thought.label}…`);
          setLiveTranscript(`${thought.icon} ${thought.label}…`);

          const result = await executeTool(name, args);
          setAuditLogs((prev) => [...prev, { tool: name, args, result }]);

          // Fire a toast for each tool result
          const summary = summariseResult(name, result);
          addToast({
            type: name === "issue_discount_code" ? "discount" : "success",
            title: `${TOOL_ICONS[name] ?? "⚙️"} ${TOOL_LABELS[name] ?? name}`,
            description: summary,
          });

          // Update thought to done
          setAgentThoughts((prev) =>
            prev.map((t) =>
              t.id === thoughtId
                ? { ...t, status: "done", result: summariseResult(name, result) }
                : t
            )
          );

          // Inject tool result back into messages
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: result,
          });
        }
        // Loop continues → LLM sees tool results and either calls more tools or responds
      }

      setCurrentToolLabel("");

      if (!finalResponse) {
        finalResponse = "I've completed your request. Is there anything else I can help you with?";
      }

      // Update conversation history
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: transcript },
        { role: "assistant", content: finalResponse },
      ]);

      setLiveTranscript(`Aura: ${finalResponse}`);
      speak(finalResponse);
    },
    [conversationHistory, customerName, executeTool, setAuditLogs, tasks]
  );

  // Keep ref in sync
  useEffect(() => {
    processIntentRef.current = processIntent;
  }, [processIntent]);

  // ─── SPEECH RECOGNITION SETUP ─────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLiveTranscript(`You: ${transcript}`);
        setVoiceState("processing");
        await processIntentRef.current(transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "aborted") {
          console.error("Speech recognition error", event.error);
          setVoiceState("error");
          setLiveTranscript(`Microphone error: ${event.error}`);
          setTimeout(() => setVoiceState("idle"), 3000);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }

    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    // Space bar → toggle voice
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.code === "Space" && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        if (voiceStateRef.current === "idle" || voiceStateRef.current === "error") {
          startListening();
        } else {
          stopListening();
        }
      }
      // Demo shortcut for judges
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        const demo =
          "I ordered a high-end laptop but the box arrived completely empty! I am absolutely furious. What kind of service is this?";
        setLiveTranscript(`You: ${demo}`);
        setVoiceState("processing");
        processIntentRef.current(demo);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ─── SPEECH SYNTHESIS ─────────────────────────────────────────────────────
  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      // Truncate to first 80 words for voice — avoids 3-minute monologues
      const words = text.split(" ");
      const spoken = words.length > 80 ? words.slice(0, 80).join(" ") + "…" : text;
      const utterance = new SpeechSynthesisUtterance(spoken);
      utterance.onend = () => {
        setVoiceState("idle");
        setLiveTranscript("");
      };
      const voices = synthRef.current.getVoices();
      const preferred = voices.find(
        (v) =>
          v.name.includes("Samantha") || v.name.includes("Google US English")
      );
      if (preferred) utterance.voice = preferred;
      utterance.rate = 1.05;
      synthRef.current.speak(utterance);
    } else {
      setVoiceState("idle");
    }
  };

  // ─── CONTROLS ─────────────────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (recognitionRef.current) {
      if (synthRef.current) synthRef.current.cancel();
      setAgentThoughts([]);
      setVoiceState("listening");
      setLiveTranscript("Listening…");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already active", e);
      }
    } else {
      setLiveTranscript("Microphone not supported in this browser.");
      setVoiceState("error");
    }
  }, []);

  const stopListening = useCallback(async () => {
    recognitionRef.current?.stop();
    synthRef.current?.cancel();
    setVoiceState("idle");
    setLiveTranscript("");
  }, []);

  // ─── WAVEFORM ANIMATION ────────────────────────────────────────────────────
  useEffect(() => {
    let id: number;
    const tick = () => {
      if (voiceState === "listening" || voiceState === "processing") {
        const t = Date.now() / 100;
        setWaveformLevels(
          Array(24)
            .fill(0)
            .map((_, i) => {
              const n =
                Math.sin(t + i * 0.5) * Math.cos(t * 0.8 + i * 0.2);
              return Math.min(1, Math.max(0.1, Math.abs(n) + Math.random() * 0.4));
            })
        );
      } else {
        const t = Date.now() / 1000;
        setWaveformLevels(
          Array(24)
            .fill(0)
            .map((_, i) => 0.1 + Math.sin(t * 2 + i * 0.5) * 0.05)
        );
      }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, [voiceState]);

  return (
    <VoiceContext.Provider
      value={{
        voiceState,
        waveformLevels,
        startListening,
        stopListening,
        liveTranscript,
        conversationHistory,
        speak,
        auditLogs,
        setAuditLogs,
        processIntent,
        userSentiment,
        agentThoughts,
        currentToolLabel,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

// ─── HELPER ────────────────────────────────────────────────────────────────
function summariseResult(tool: ToolName, raw: string): string {
  try {
    const data = JSON.parse(raw);
    switch (tool) {
      case "search_web":
        return "Found web results ✓";
      case "get_weather":
        return `${data.city}: ${data.temperature}, ${data.condition}`;
      case "get_exchange_rate":
        return `1 ${data.from} = ${data.rate} ${data.to}`;
      case "issue_discount_code":
        return `Code: ${data.code} (${data.percentage}% off)`;
      case "create_reminder":
        return `Reminder set: ${data.reminder}`;
      case "track_order":
        return `${data.id} — ${data.status}`;
      case "process_refund":
        return `Refund ${data.refundId} initiated`;
      case "navigate_to_view":
        return `Navigated to ${data.navigatedTo}`;
      default:
        return "Done ✓";
    }
  } catch {
    return raw.slice(0, 60);
  }
}

export const useVoiceContext = () => {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoiceContext must be used within VoiceProvider");
  return ctx;
};
