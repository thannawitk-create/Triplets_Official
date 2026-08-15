import React, { useState } from 'react';
import { Image as ImageIcon, X, Maximize2, Sparkles } from 'lucide-react';
import { IMAGES } from '../data/images';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galleryList = IMAGES.gallery;

  const filteredGallery = galleryList.filter(item => 
    selectedCategory === 'ALL' || item.category === selectedCategory
  );

  return (
    <section id="gallery" className="py-20 bg-neutral-950 relative overflow-hidden border-t border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>STAGE & CONCERT HIGHLIGHTS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            ภาพบรรยากาศ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">GALLERY</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            ประมวลภาพโชว์สด เบื้องหลังการทำเพลง และโมเมนต์อบอุ่นในงานแฟนมีตติ้งของ TRIPLETS
          </p>
        </div>

        {/* Filter Category */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['ALL', 'Concert', 'Behind The Scenes', 'Studio', 'Fan Meeting'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'ภาพทั้งหมด' : cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="bg-neutral-900 border border-neutral-800/80 rounded-3xl overflow-hidden shadow-xl hover:border-red-800/60 transition-all duration-300 cursor-pointer group relative aspect-video"
            >
              <img
                src={item.url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

              <span className="absolute top-3 left-3 bg-neutral-950/80 border border-neutral-800 text-neutral-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full">
                {item.category}
              </span>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 font-light">
                    {item.caption}
                  </p>
                </div>
                <div className="p-2 bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden relative shadow-2xl space-y-4 p-4">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video rounded-2xl overflow-hidden border border-neutral-800">
              <img
                src={activeImage.url}
                alt={activeImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-2 space-y-1">
              <span className="text-xs font-mono text-red-400 font-bold uppercase">
                {activeImage.category}
              </span>
              <h3 className="text-xl font-bold text-white">
                {activeImage.title}
              </h3>
              <p className="text-xs text-neutral-300 font-light">
                {activeImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
