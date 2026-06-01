import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ExternalLink, Search, FileText } from 'lucide-react';

export const SearchCitations: React.FC = () => {
  const { citations } = useAppContext();

  if (!citations || citations.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
        <Search className="w-16 h-16 text-white/30 mb-4 animate-pulse" />
        <h2 className="text-2xl font-light text-white/70 tracking-wide">Awaiting Search Query</h2>
        <p className="text-white/40 mt-2 text-center max-w-md">
          Ask the Voice Assistant a question to retrieve verified real-time data from the web.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center space-x-3 mb-8 border-b border-white/10 pb-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Search className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Verified Live Intelligence</h2>
          <p className="text-sm text-emerald-400/80 mt-1">Real-time data retrieved from active network nodes</p>
        </div>
      </div>

      <div className="grid gap-4">
        {citations.map((citation, idx) => (
          <div 
            key={citation.id} 
            className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/[0.04] transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <FileText className="w-5 h-5 text-white/40 mt-1 flex-shrink-0 group-hover:text-emerald-400 transition-colors" />
                <div>
                  <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors line-clamp-1">
                    {citation.title}
                  </h3>
                  <div 
                    className="text-white/60 mt-2 text-sm leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: citation.snippet }}
                  />
                </div>
              </div>
              <a 
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-white/80 transition-colors flex-shrink-0"
              >
                <span>Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
