# Vyntra — Voice-First CX AI Agent 🎤

> **Agentic Premier League · Vibe Coding Hackathon**
>
> *Problem Statement: Create an application which is voice-first and/or meant for improving customer experience.*

---

## 🚀 Live Demo

**[https://vibrant-voice-hub.web.app](https://vibrant-voice-hub.web.app)**

---

## 🧠 What is Vyntra?

Vyntra is a **voice-first agentic CX (Customer Experience) platform** powered by a real multi-step AI agent loop. It doesn't just respond — it **thinks, calls real tools, and acts**.

Every time a customer speaks, the agent:
1. Analyses intent and sentiment in real-time
2. Decides which tools to call (web search, weather, exchange rates, discounts, order tracking…)
3. Executes them for real — against live APIs
4. Feeds results back into context
5. Loops until it has enough to give a complete, personalised spoken response

---

## ✨ Features

### 🎙️ Voice-First Core
- Click the mic orb (or press `Space`) to speak
- Live waveform visualisation that reacts to your voice
- AI responds with speech synthesis
- Real-time sentiment detection (Positive / Neutral / Frustrated)

### 🤖 Real Agentic Loop (Not Mocked)
| Tool | What it does |
|---|---|
| `search_web` | Live Google Search via Serper.dev |
| `get_weather` | Real weather via Open-Meteo (no key needed) |
| `get_exchange_rate` | Live forex rates via ExchangeRate-API |
| `issue_discount_code` | Generates a real `AURA-XXXXXX` code, shows gold banner |
| `create_reminder` | Adds to in-app task list |
| `track_order` | Live order state with tracking data |
| `process_refund` | Initiates refund with confirmation ID |
| `navigate_to_view` | Navigates the app by voice command |

### 📰 Personalised News Feed
- Interest-based onboarding (Technology, Finance, Sports, etc.)
- Real-time headlines via Serper.dev with images
- Automatic fallback to Tavily if Serper is unavailable

### ♿ Accessibility Hub
- 5-level text size slider (XS → XL)
- High contrast toggle
- Reduced motion toggle
- Focus mode (strips UI to just the mic orb)

### 👤 CX Profile
- Voice query count, chat history, loyalty tier
- Real-time sentiment badge
- Interest tags, full voice history timeline

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS + Vanilla CSS |
| Animation | Framer Motion |
| AI | OpenRouter (GPT-4o-mini) with function calling |
| Voice In | Web Speech API (`SpeechRecognition`) |
| Voice Out | Web Speech API (`SpeechSynthesis`) |
| Search | Serper.dev / Tavily fallback |
| Weather | Open-Meteo (free, no key) |
| Forex | ExchangeRate-API (free) |
| Hosting | Firebase Hosting |
| Build | Vite |

---

## 🏃 Running Locally

```bash
# 1. Clone
git clone https://github.com/ibeastmanish/Vibrant-Voice-Hub.git
cd Vibrant-Voice-Hub

# 2. Install
npm install

# 3. Set environment variables
cp .env.example .env
# Add your OpenRouter key to .env:
# VITE_OPENROUTER_API_KEY=your_key_here

# 4. Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

Get your key at [openrouter.ai](https://openrouter.ai) — free tier available.

---

## 🎬 Demo

Press **▶ Run Demo** on the Dashboard, or say:

> *"I ordered a high-end laptop but the box arrived completely empty! I'm furious."*

Watch the agent:
1. Detect frustration from voice
2. Call `issue_discount_code` → generate a real `AURA-XXXXXX` code
3. The gold discount banner appears on screen
4. Aura speaks the response apologising and confirming the code

---

## 📁 Project Structure

```
src/
├── context/
│   ├── AppContext.tsx          # Global app state
│   └── VoiceContext.tsx        # Agentic loop + tool execution
├── lib/
│   ├── agentTools.ts           # OpenAI function-calling tool schemas
│   └── utils.ts
├── components/
│   ├── voice/
│   │   ├── VoiceOrb.tsx        # Main mic UI
│   │   └── AgentThoughts.tsx   # Real-time tool execution display
│   ├── dashboard/
│   │   └── NewsFeed.tsx        # Personalised news with images
│   ├── profile/
│   │   └── ProfileScreen.tsx   # CX profile page
│   ├── accessibility/
│   │   └── AccessibilityScreen.tsx
│   ├── onboarding/
│   │   └── InterestsScreen.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── IntroScreen.tsx
│   │   └── LoginScreen.tsx
│   └── search/
│       └── ChatCanvas.tsx      # Text chat with AI
└── App.tsx
```

---

## 🏆 Built For

**Vibe Coding — Agentic Premier League**

Built entirely with AI-assisted development using Google Antigravity IDE.

---

## 📄 License

MIT
