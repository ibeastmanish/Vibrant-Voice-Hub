import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl?: string;
}

const SERPER_KEY = "e87587541b1b8d66cb3a11f097ecafc8df7dfb80";

// Deterministic gradient fallback per card
const GRADIENTS = [
  "from-violet-900 via-purple-800 to-indigo-900",
  "from-blue-900 via-cyan-800 to-teal-900",
  "from-rose-900 via-pink-800 to-fuchsia-900",
  "from-orange-900 via-amber-800 to-yellow-900",
  "from-emerald-900 via-green-800 to-teal-900",
  "from-slate-800 via-blue-900 to-indigo-900",
];

const CATEGORY_ICONS: Record<string, string> = {
  Technology: "💻", Finance: "📈", Sports: "⚽", Science: "🔬",
  Health: "🏥", Politics: "🏛️", Business: "💼", Entertainment: "🎬",
  Gaming: "🎮", Travel: "✈️", Food: "🍕", Fashion: "👗",
};

// Extract concise search query from article title
const extractKeywords = (title: string): string => {
  const stop = new Set(["the", "a", "an", "in", "on", "at", "to", "for",
    "of", "and", "or", "but", "is", "are", "was", "were", "its", "it",
    "this", "that", "with", "has", "have", "over", "new", "says"]);
  return title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stop.has(w.toLowerCase()))
    .slice(0, 4)
    .join(" ");
};

// Fetch a single HD image from Google Images via Serper
const fetchHDImage = async (query: string): Promise<string | undefined> => {
  try {
    const res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 5 }),
    });
    if (!res.ok) return undefined;
    const data = await res.json();
    // Find first image that is large enough (min 600px wide)
    const image = data.images?.find(
      (img: any) =>
        img.imageUrl &&
        (img.imageWidth >= 600 || !img.imageWidth) &&
        !img.imageUrl.includes("gstatic") &&
        !img.imageUrl.includes("logo")
    );
    return image?.imageUrl ?? data.images?.[0]?.imageUrl;
  } catch {
    return undefined;
  }
};

// Smart image with HD → original → gradient fallback chain
const NewsImage = ({
  hdUrl,
  originalUrl,
  alt,
  index,
  link,
}: {
  hdUrl?: string;
  originalUrl?: string;
  alt: string;
  index: number;
  link: string;
}) => {
  const [src, setSrc] = useState<string | undefined>(hdUrl ?? originalUrl);
  const [failed, setFailed] = useState(!src);

  // Update src when hdUrl resolves
  useEffect(() => {
    if (hdUrl) { setSrc(hdUrl); setFailed(false); }
  }, [hdUrl]);

  if (failed || !src) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full h-52 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex items-center justify-center relative overflow-hidden block shrink-0`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-3 right-4 w-20 h-20 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-3 left-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
        <span className="text-6xl opacity-20">📰</span>
      </a>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-52 overflow-hidden bg-black/50 block relative shrink-0"
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="lazy"
        onError={() => {
          // Try original URL as second fallback
          if (src === hdUrl && originalUrl && originalUrl !== hdUrl) {
            setSrc(originalUrl);
          } else {
            setFailed(true);
          }
        }}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
      />
      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </a>
  );
};

export const NewsFeed = () => {
  const { selectedInterests } = useAppContext();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [hdImages, setHdImages] = useState<(string | undefined)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setHdImages([]);
      const query =
        selectedInterests.length > 0
          ? selectedInterests.join(" OR ")
          : "Technology AI startups news";

      let articles: NewsItem[] = [];

      // Step 1: Fetch news articles
      try {
        const res = await fetch("https://google.serper.dev/news", {
          method: "POST",
          headers: {
            "X-API-KEY": SERPER_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: query, num: 9 }),
        });
        if (!res.ok) throw new Error(`Serper ${res.status}`);
        const data = await res.json();
        if (data?.news?.length > 0) {
          articles = data.news.slice(0, 6);
        } else throw new Error("No news");
      } catch {
        try {
          const tv = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: "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",
              query,
              search_depth: "basic",
              include_images: true,
              topic: "news",
            }),
          });
          const tvData = await tv.json();
          if (tvData?.results) {
            articles = tvData.results.slice(0, 6).map((r: any, idx: number) => ({
              title: r.title,
              link: r.url,
              snippet: r.content?.slice(0, 200),
              date: r.published_date
                ? new Date(r.published_date).toLocaleDateString()
                : new Date().toLocaleDateString(),
              source: (() => { try { return new URL(r.url).hostname.replace("www.", ""); } catch { return "News"; } })(),
              imageUrl: tvData.images?.[idx],
            }));
          }
        } catch { /* both failed */ }
      }

      setNews(articles);
      setLoading(false);

      // Step 2: Fetch HD images in parallel for each article
      if (articles.length > 0) {
        const hdResults = await Promise.all(
          articles.map((item) =>
            fetchHDImage(extractKeywords(item.title))
          )
        );
        setHdImages(hdResults);
      }
    };

    fetchAll();
  }, [selectedInterests]);

  if (loading) {
    return (
      <div className="w-full mt-24 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
        <p className="text-white/40 text-sm">
          Curating live {selectedInterests[0] || "Technology"} news…
        </p>
      </div>
    );
  }

  if (news.length === 0) return null;

  const cat = selectedInterests[0] || "Technology";

  return (
    <div className="w-full mt-8 text-left">
      <div className="flex items-center gap-3 mb-6 px-1">
        <span className="text-2xl">{CATEGORY_ICONS[cat] ?? "📰"}</span>
        <h3 className="text-2xl font-semibold text-white/90">What's New</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/30">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.07,
              type: "spring",
              stiffness: 180,
              damping: 22,
            }}
            className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 flex flex-col group"
          >
            <NewsImage
              hdUrl={hdImages[index]}
              originalUrl={item.imageUrl}
              alt={item.title}
              index={index}
              link={item.link}
            />

            <div className="p-4 flex flex-col gap-2 flex-1">
              <p className="text-[10px] text-blue-400/80 font-semibold uppercase tracking-widest">
                {item.source} · {item.date}
              </p>

              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <h4 className="text-white/90 font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                  {item.title}
                </h4>
              </a>

              <p className="text-white/40 text-xs leading-relaxed line-clamp-2 flex-1">
                {item.snippet}
              </p>

              <button
                onClick={() => {
                  if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(
                      `${item.title}. ${item.snippet}`
                    );
                    u.rate = 1.05;
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-primary transition-colors w-fit mt-1"
              >
                <span>🔊</span>
                <span>Read aloud</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
