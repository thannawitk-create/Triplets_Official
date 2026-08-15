import React, { useState } from 'react';
import { Newspaper, Calendar, Heart, MessageSquare, Share2, ArrowRight, X, Sparkles } from 'lucide-react';
import { NEWS_LIST } from '../data/bandData';
import { NewsItem } from '../types';

export const NewsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsState, setNewsState] = useState(NEWS_LIST);

  const filteredNews = newsState.filter(news => 
    selectedCategory === 'ALL' || news.category === selectedCategory
  );

  const handleLike = (e: React.MouseEvent, newsId: string) => {
    e.stopPropagation();
    setNewsState(prev => prev.map(item => {
      if (item.id === newsId) {
        return { ...item, likesCount: item.likesCount + 1 };
      }
      return item;
    }));
  };

  return (
    <section id="news" className="py-20 bg-neutral-900/60 relative overflow-hidden border-t border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full">
            <Newspaper className="w-3.5 h-3.5" />
            <span>NEWS & OFFICIAL UPDATES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            ข่าวสารและประกาศ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">TRIPLETS</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            ติดตามข่าวสารอัปเดตล่าสุด กิจกรรมพิเศษ สินค้าวง และความเคลื่อนไหวจากสมาชิกวง TRIPLETS
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['ALL', 'อัลบั้มใหม่', 'ตารางแสดง', 'สินค้าวง'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'ทั้งหมด (All News)' : cat}
            </button>
          ))}
        </div>

        {/* News Feed Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="bg-neutral-950/90 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-red-800/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* News Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>
                  
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                    {news.category}
                  </span>
                </div>

                {/* News Header & Summary */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 block">
                    {news.date}
                  </span>

                  <h3 className="font-bold text-white text-base sm:text-lg line-clamp-2 group-hover:text-red-400 transition-colors">
                    {news.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 font-light leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              </div>

              {/* News Footer Interactions */}
              <div className="px-5 pb-5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(e, news.id)}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
                    <span>{news.likesCount}</span>
                  </button>

                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{news.commentsCount}</span>
                  </span>
                </div>

                <span className="text-red-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  อ่านต่อ <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full News Article Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 shadow-2xl my-8">
            
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-1 rounded-full uppercase">
                {selectedNews.category} • {selectedNews.date}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white pt-2">
                {selectedNews.title}
              </h3>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden border border-neutral-800">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-sm text-neutral-300 font-light leading-relaxed">
              {selectedNews.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <button
                onClick={(e) => handleLike(e, selectedNews.id)}
                className="flex items-center gap-2 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-2 rounded-xl hover:bg-red-900 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>กดถูกใจข่าวนี้ ({selectedNews.likesCount})</span>
              </button>

              <button
                onClick={() => setSelectedNews(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
