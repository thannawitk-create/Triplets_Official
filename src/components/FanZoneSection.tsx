import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageSquare, CheckCircle, Sparkles, UserCheck } from 'lucide-react';
import { INITIAL_FAN_MESSAGES, SONGS } from '../data/bandData';
import { FanMessage } from '../types';

export const FanZoneSection: React.FC = () => {
  const [messages, setMessages] = useState<FanMessage[]>(() => {
    const saved = localStorage.getItem('triplets_fan_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_FAN_MESSAGES;
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WIN' | 'Ten' | 'Tiger' | 'Mona'>('ALL');
  const [fanName, setFanName] = useState('');
  const [memberTag, setMemberTag] = useState<'ALL' | 'WIN' | 'Ten' | 'Tiger' | 'Mona'>('ALL');
  const [favoriteSong, setFavoriteSong] = useState(SONGS[0].titleThai);
  const [message, setMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('triplets_fan_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fanName.trim() || !message.trim()) return;

    const newMessage: FanMessage = {
      id: `fan-${Date.now()}`,
      fanName: fanName.trim(),
      memberTag: memberTag,
      favoriteSong: favoriteSong,
      message: message.trim(),
      timestamp: 'เมื่อสักครู่นี้',
      likes: 1,
      verifiedFan: true
    };

    setMessages([newMessage, ...messages]);
    setMessage('');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleLikeMessage = (id: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, likes: m.likes + 1 };
      }
      return m;
    }));
  };

  const filteredMessages = messages.filter(m => 
    activeFilter === 'ALL' || m.memberTag === activeFilter || m.memberTag === 'ALL'
  );

  return (
    <section id="fanzone" className="py-20 bg-neutral-900/60 relative overflow-hidden border-t border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-red-500" />
            <span>FAN CLUB COMMUNITY & GUESTBOOK</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            มุมส่งกำลังใจ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">FAN ZONE</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            กระดานข้อความของแฟนคลับวง TRIPLETS ร่วมส่งกำลังใจและแชร์ความรู้สึกถึง วิน, เท็น, ไทเกอร์ และโมนา
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Post Message */}
          <div className="lg:col-span-5 bg-neutral-950/90 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-red-500" />
                ส่งข้อความถึงวง TRIPLETS
              </h3>
              <p className="text-xs text-neutral-400">
                เขียนความรู้สึก ส่งกำลังใจ หรือความประทับใจที่คุณมีต่อบทเพลงของพวกเรา
              </p>
            </div>

            {showSuccessAlert && (
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs p-3 rounded-2xl flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ส่งข้อความสำเร็จแล้ว! ขอบคุณสำหรับกำลังใจนะคะ ❤️</span>
              </div>
            )}

            <form onSubmit={handleSubmitMessage} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">ชื่อของคุณ / ชื่อแฟนคลับ</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น น้องมินท์ Triplets FC"
                  value={fanName}
                  onChange={(e) => setFanName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">ส่งถึงสมาชิกคนไหน?</label>
                  <select
                    value={memberTag}
                    onChange={(e) => setMemberTag(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">ทุกคนในวง (ALL)</option>
                    <option value="WIN">พี่วิน (Lead Vocal)</option>
                    <option value="Ten">พี่เท็น (Bass)</option>
                    <option value="Tiger">พี่ไทเกอร์ (Drums)</option>
                    <option value="Mona">พี่โมนา (Guest Vocal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">เพลงโปรดของคุณ</label>
                  <select
                    value={favoriteSong}
                    onChange={(e) => setFavoriteSong(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {SONGS.map(s => (
                      <option key={s.id} value={s.titleThai}>{s.titleThai}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">ข้อความของคุณ</label>
                <textarea
                  required
                  rows={4}
                  placeholder="พิมพ์ข้อความส่งกำลังใจที่นี่..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-red-950 transition-all cursor-pointer"
              >
                โพสต์ข้อความลงกระดานแฟนคลับ
              </button>

            </form>
          </div>

          {/* Right Feed: Message Wall */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950/80 border border-neutral-800 p-3 rounded-2xl">
              <span className="text-xs font-mono text-neutral-400 font-bold uppercase">กรองข้อความ:</span>
              <div className="flex flex-wrap gap-1">
                {['ALL', 'WIN', 'Ten', 'Tiger', 'Mona'].map(m => (
                  <button
                    key={m}
                    onClick={() => setActiveFilter(m as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeFilter === m
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {m === 'ALL' ? 'ทั้งหมด' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Cards List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-neutral-950/90 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-neutral-800 flex items-center justify-center font-bold text-xs text-white">
                        {msg.fanName.charAt(0)}
                      </div>

                      <div>
                        <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          <span>{msg.fanName}</span>
                          {msg.verifiedFan && (
                            <UserCheck className="w-3.5 h-3.5 text-red-400" title="Verified Fan" />
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">{msg.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded">
                        ถึง: {msg.memberTag}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
                    "{msg.message}"
                  </p>

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span className="text-[11px] text-neutral-500">
                      🎵 เพลงโปรด: <span className="text-neutral-300 font-semibold">{msg.favoriteSong}</span>
                    </span>

                    <button
                      onClick={() => handleLikeMessage(msg.id)}
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/30" />
                      <span>{msg.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
