import React, { useState } from 'react';
import { Users, Music, Award, Camera } from 'lucide-react';
import { useBandImages, BandImageMap } from '../context/ImageContext';
import { useSongs } from '../context/SongContext';
import { handleImageLoadError } from '../utils/placeholderImages';

export const BandSection: React.FC = () => {
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const { images, openImageEditor } = useBandImages();
  const { isAdmin, members, bandInfo } = useSongs();
  
  const currentMembers = members.length > 0 ? members : [
    {
      id: 'win',
      nameThai: 'วิน - รุ่งโรจน์',
      nameEng: 'WIN RUNGROT',
      role: 'LEAD VOCAL / GUITAR',
      quote: 'เสียงเพลงคือความรู้สึกเดียวที่ไม่เคยหลอกเรา',
      bio: 'นักร้องนำผู้ถ่ายทอดอารมณ์เพลงร็อกอย่างลึกซึ้ง',
      keyTracks: ['หากวันนั้น...', 'เงาในใจ'],
      socials: { instagram: '@win_official' },
    }
  ];

  const safeIndex = Math.min(activeMemberIndex, currentMembers.length - 1);
  const activeMember = currentMembers[safeIndex] || currentMembers[0];
  const activeImageKey = (activeMember.id === 'win' || activeMember.id === 'ten' || activeMember.id === 'tiger' || activeMember.id === 'mona')
    ? (activeMember.id as keyof BandImageMap)
    : 'win';

  return (
    <section id="band" className="py-16 bg-neutral-950 text-neutral-100 relative overflow-hidden border-t border-neutral-800">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(185,28,28,0.08)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 relative z-10">
        
        {/* Section Header (Scaled Down "ย่อตัวหนังสือ") */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span>หน้า 2 : สมาชิกวง (THE MEMBERS)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
            เรื่องราววง <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-100 to-red-600">{bandInfo.name}</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-light">
            {bandInfo.taglineThai || `${currentMembers.length} สมาชิกผู้ถ่ายทอดบทเพลง`}
          </p>

          {isAdmin && (
            <div className="pt-1">
              <button
                onClick={() => openImageEditor(activeImageKey)}
                className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-red-500/50 text-red-400 font-semibold px-3.5 py-1.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>เปลี่ยน / อัปโหลดรูปภาพศิลปิน ({activeMember.nameThai})</span>
              </button>
            </div>
          )}
        </div>

        {/* Feature Spotlight Card */}
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/95 shadow-2xl group">
            
            {/* Member Image & Details Container */}
            <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden">
              <img
                src={images[activeImageKey]}
                alt={activeMember.nameEng}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageLoadError(e, activeImageKey)}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent"></div>

              {/* Top Bar: Role Badge & Edit Button */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-neutral-950/80 border border-neutral-700 text-neutral-200 text-xs font-mono font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  {activeMember.role}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => openImageEditor(activeImageKey)}
                    className="bg-neutral-950/80 border border-neutral-700 hover:border-red-500 text-neutral-200 hover:text-white text-xs font-mono px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1 transition-colors cursor-pointer shadow-lg"
                  >
                    <Camera className="w-3.5 h-3.5 text-red-400" />
                    <span>เปลี่ยนรูปนี้</span>
                  </button>
                )}
              </div>

              {/* Member Quotes & Information */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-2.5">
                <div>
                  <h3 className="text-2xl font-black text-white flex items-baseline gap-2">
                    <span>{activeMember.nameThai}</span>
                    <span className="text-xs font-normal text-neutral-400 font-mono">({activeMember.nameEng})</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-red-500 font-semibold mt-1">
                    "{activeMember.quote}"
                  </p>
                </div>

                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  {activeMember.bio}
                </p>

                {/* Key Tracks */}
                {activeMember.keyTracks && activeMember.keyTracks.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-neutral-400 font-mono text-[11px]">เพลงเด่น:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeMember.keyTracks.map((track, i) => (
                        <span key={i} className="text-[10px] bg-neutral-800/90 border border-neutral-700/80 text-neutral-200 px-2 py-0.5 rounded">
                          {track}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Member Selector Tabs */}
            <div className="grid grid-cols-4 border-t border-neutral-800 bg-neutral-950 p-1.5 gap-1">
              {currentMembers.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMemberIndex(idx)}
                  className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer ${
                    activeMemberIndex === idx
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-950'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{m.nameThai}</div>
                  <div className="text-[9px] opacity-80 font-mono truncate">{m.role}</div>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Member Cards Overview Grid (Compact layout) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
          {currentMembers.map((member, idx) => {
            const isSelected = activeMemberIndex === idx;
            const imgKey = (member.id === 'win' || member.id === 'ten' || member.id === 'tiger' || member.id === 'mona')
              ? (member.id as keyof BandImageMap)
              : 'win';

            return (
              <div
                key={member.id}
                onClick={() => setActiveMemberIndex(idx)}
                className={`bg-neutral-900/90 border rounded-2xl p-3 shadow-lg transition-all duration-300 cursor-pointer space-y-2.5 group relative ${
                  isSelected 
                    ? 'border-red-500 shadow-red-950/40 bg-neutral-900' 
                    : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-md">
                  <img
                    src={images[imgKey]}
                    alt={member.nameEng}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageLoadError(e, imgKey)}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
                  
                  <span className="absolute top-2 left-2 bg-neutral-950/80 border border-neutral-700 text-neutral-200 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                    {member.role}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageEditor(imgKey);
                    }}
                    className="absolute top-2 right-2 bg-neutral-950/80 border border-neutral-700 hover:border-red-500 text-neutral-200 text-[9px] px-2 py-0.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="เปลี่ยนรูปสมาชิกนี้"
                  >
                    📷 แก้ไข
                  </button>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-white flex items-center justify-between">
                    <span className="truncate">{member.nameThai}</span>
                    <span className="text-[10px] font-mono text-neutral-400 font-normal">{member.nameEng.split(' ')[0]}</span>
                  </h4>
                  <p className="text-[10px] text-red-400 font-medium line-clamp-1 italic">
                    "{member.quote}"
                  </p>
                </div>

                <div className="pt-1 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>{member.socials?.instagram || '@band'}</span>
                  <span className="text-red-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    เลือก →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};


