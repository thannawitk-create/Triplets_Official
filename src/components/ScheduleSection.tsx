import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Ticket, Search, Filter, Phone, ExternalLink, CheckCircle2, AlertCircle, Share2, Sparkles } from 'lucide-react';
import { LIVE_SHOWS } from '../data/bandData';
import { LiveShow } from '../types';

interface ScheduleSectionProps {
  onOpenTicketModal: (showId: string) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onOpenTicketModal }) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedCalendarId, setAddedCalendarId] = useState<string | null>(null);

  const filteredShows = LIVE_SHOWS.filter(show => {
    const matchesType = selectedType === 'ALL' || show.type === selectedType;
    const matchesSearch = 
      show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.province.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddToCalendar = (show: LiveShow) => {
    setAddedCalendarId(show.id);
    setTimeout(() => setAddedCalendarId(null), 2500);
  };

  return (
    <section id="schedule" className="py-20 bg-neutral-900/60 relative overflow-hidden border-t border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>LIVE TOUR & CONCERT CALENDAR</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
              ตารางแสดงสด <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">TRIPLETS TOUR 2026</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base font-light">
              อัปเดตตารางทัวร์คอนเสิร์ตและงานแสดงสดทั่วประเทศ เช็กสถานที่ เวลา และกดสำรองโต๊ะ/จองบัตรล่วงหน้าได้ที่นี่
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาจังหวัด, สถานที่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800/80 pb-4">
          {[
            { id: 'ALL', label: 'ทั้งหมด (All Shows)' },
            { id: 'Concert & Festival', label: 'คอนเสิร์ต & เฟสติวัล' },
            { id: 'Pub & Live House', label: 'ผับ & คลับแสดงสด' },
            { id: 'Fan Meeting', label: 'แฟนมีตติ้ง' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                  : 'bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Show Cards Grid */}
        <div className="space-y-4">
          {filteredShows.length === 0 ? (
            <div className="text-center py-12 bg-neutral-950/50 rounded-3xl border border-neutral-800 text-neutral-400 space-y-2">
              <p className="text-base font-bold">ไม่พบรายการแสดงตามเงื่อนไขที่ค้นหา</p>
              <p className="text-xs text-neutral-500">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่ใหม่อีกครั้ง</p>
            </div>
          ) : (
            filteredShows.map((show) => {
              const isSoldOut = show.status === 'Sold Out';
              const isFree = show.status === 'Free Entry';

              return (
                <div
                  key={show.id}
                  className="bg-neutral-950/90 border border-neutral-800/80 rounded-3xl p-5 sm:p-6 shadow-xl hover:border-red-800/50 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                >
                  
                  {/* Left: Date Badge & Details */}
                  <div className="flex items-start gap-5 min-w-0">
                    
                    {/* Date Badge */}
                    <div className="w-20 sm:w-24 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-3 text-center shrink-0 shadow-inner group-hover:border-red-500/40 transition-colors">
                      <span className="block text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                        {show.date.split(' ')[1]} {show.date.split(' ')[2]}
                      </span>
                      <span className="block text-2xl sm:text-3xl font-black text-white font-mono my-0.5">
                        {show.date.split(' ')[0]}
                      </span>
                      <span className="block text-[10px] font-mono text-neutral-400">
                        {show.time}
                      </span>
                    </div>

                    {/* Show Description */}
                    <div className="space-y-1.5 min-w-0">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          show.status === 'Selling Fast'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                            : show.status === 'Sold Out'
                            ? 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                            : show.status === 'Free Entry'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : 'bg-red-950 text-red-400 border border-red-800/60'
                        }`}>
                          {show.status === 'Selling Fast' && '🔥 '}
                          {show.status}
                        </span>

                        <span className="text-xs text-neutral-500 font-mono">
                          • {show.type}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                        {show.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="font-semibold text-white">{show.venue}</span>
                        <span className="text-neutral-400">({show.province})</span>
                      </p>

                      <p className="text-xs text-neutral-400 line-clamp-1 font-light pt-1">
                        {show.description}
                      </p>
                    </div>

                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                    
                    <div className="text-left md:text-right pr-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">ราคาบัตร / เงื่อนไข</span>
                      <span className="text-sm font-bold text-neutral-200">{show.ticketPrice}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={show.locationMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="ดูแผนที่ Google Maps"
                      >
                        <MapPin className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleAddToCalendar(show)}
                        className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer relative"
                        title="บันทึกปฏิทิน"
                      >
                        <Calendar className="w-4 h-4" />
                        {addedCalendarId === show.id && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow">
                            เพิ่มลงปฏิทินแล้ว!
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => onOpenTicketModal(show.id)}
                        disabled={isSoldOut}
                        className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                          isSoldOut
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950'
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>{isSoldOut ? 'บัตรหมดแล้ว' : isFree ? 'สำรองโต๊ะ/ที่นั่ง' : 'จองบัตรคอนเสิร์ต'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </section>
  );
};
