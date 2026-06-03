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

export const NewsFeed = () => {
  const { selectedInterests } = useAppContext();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      // Hoist query so it's accessible in the catch fallback block
      const query = selectedInterests.length > 0
          ? selectedInterests.join(" OR ")
          : "Technology news";
      try {

        const response = await fetch('https://google.serper.dev/news', {
            method: 'POST',
            headers: {
                'X-API-KEY': 'e87587541b1b8d66cb3a11f097ecafc8df7dfb80', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: query })
        });

        if (!response.ok) {
            throw new Error(`Serper API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.news && data.news.length > 0) {
            setNews(data.news.slice(0, 6)); // limit to top 6 news
        } else {
            throw new Error("No news found in Serper response");
        }
      } catch (error) {
        console.warn("Serper API failed, falling back to Tavily...", error);
        
        try {
            const tavilyResponse = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    api_key: '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',
                    query: query,
                    search_depth: "basic",
                    include_images: true,
                    topic: "news"
                })
            });

            const tavilyData = await tavilyResponse.json();
            
            if (tavilyData && tavilyData.results) {
                const mappedNews: NewsItem[] = tavilyData.results.map((r: any, idx: number) => ({
                    title: r.title,
                    link: r.url,
                    snippet: r.content,
                    date: r.published_date ? new Date(r.published_date).toLocaleDateString() : new Date().toLocaleDateString(),
                    source: "Tavily Search",
                    // Use images array if available
                    imageUrl: (tavilyData.images && tavilyData.images[idx]) ? tavilyData.images[idx] : undefined
                }));
                setNews(mappedNews.slice(0, 6));
            }
        } catch (fallbackError) {
            console.error("Both Serper and Tavily APIs failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedInterests]);

  if (loading) {
      return (
          <div className="w-full mt-24 text-center text-white/50 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              <p>Curating real-time news for {selectedInterests.join(", ")}...</p>
          </div>
      );
  }

  if (news.length === 0) {
      return null;
  }

  return (
    <div className="w-full mt-24 text-left">
        <h3 className="text-2xl font-semibold text-white/90 mb-6 px-2">What's New</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
                <motion.a 
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors flex flex-col group cursor-pointer"
                >
                    {item.imageUrl && (
                        <div className="w-full h-40 overflow-hidden bg-black">
                            <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                        </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="text-xs text-blue-400 font-medium mb-2 uppercase tracking-wide">
                            {item.source} • {item.date}
                        </div>
                        <h4 className="text-white font-semibold line-clamp-2 mb-2 leading-tight">
                            {item.title}
                        </h4>
                        <p className="text-white/50 text-sm line-clamp-3">
                            {item.snippet}
                        </p>
                    </div>
                </motion.a>
            ))}
        </div>
    </div>
  );
};
