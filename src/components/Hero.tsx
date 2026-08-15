import React from 'react';
import { Play, Sparkles, ChevronRight, Activity, Heart, Camera, Layout } from 'lucide-react';
import { useBandImages, BandImageMap } from '../context/ImageContext';
import { useSongs } from '../context/SongContext';

interface HeroProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateSection }) => {
  const { images, openImageEditor } = useBandImages();
  const { isAdmin, playTrack, songs, bandInfo, albumInfo, members, openTemplateModal } = useSongs();

  const handlePlayTitleTrack = () => {
    if (songs.length === 0) return;
    const targetSongId = songs[0]?.id || 'song-1';
    playTrack(targetSongId);
    onNavigateSection('music');
  };

  const winMember = members.find(m => m.id === 'win') || members[0] || {
    nameThai: 'สมาชิก 1',
    nameEng: 'Member 1',
    role: 'Lead Vocal',
    quote: 'คำคมสมาชิก',
  };
  const monaMember = members.find(m => m.id === 'mona') || members[3] || {
    nameThai: 'สมาชิก 4',
    nameEng: 'Member 4',
    role: 'Guest / Guitar',
    quote: 'คำคมสมาชิก',
  };
  const tenMember = members.find(m => m.id === 'ten') || members[1] || {
    nameThai: 'สมาชิก 2',
    nameEng: 'Member 2',
    role: 'Bass',
    quote: 'คำคมสมาชิก',
  };
  const tigerMember = members.find(m => m.id === 'tiger') || members[2] || {
    nameThai: 'สมาชิก 3',
    nameEng: 'Member 3',
    role: 'Drums',
    quote: 'คำคมสมาชิก',
  };

  return (
    <section id="hero" className="relative min-h-screen bg-neutral-950 pt-20 pb-12 flex flex-col justify-between overflow-hidden">
      
      {/* Dark Stage Background with Vignette & Metallic Mesh Overlay */}
      <div className="absolute inset-0 z-0 group">
        <img
          src={images.heroBanner}
          alt={`${bandInfo.name} Stage`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125 scale-105 cursor-pointer"
          onClick={() => {
            if (isAdmin) openImageEditor('heroBanner');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-neutral-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,10,10,0.4)_0%,rgba(10,10,10,0.95)_80%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

        {/* Quick Edit Stage Banner */}
        {isAdmin && (
          <button
            onClick={() => openImageEditor('heroBanner')}
            className="absolute top-24 right-6 z-20 opacity-80 hover:opacity-100 bg-neutral-900/90 border border-neutral-700/80 hover:border-red-500 text-white text-[11px] font-mono px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-red-400" />
            <span>เปลี่ยนรูปพื้นหลังเวที</span>
          </button>
        )}
      </div>

      {/* Hero Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-8 w-full space-y-6">
        
        {/* Top Header Badge & Text */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-red-500/30 rounded-full px-3.5 py-1 backdrop-blur-md text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-red-400 font-bold uppercase tracking-wider">OFFICIAL RELEASE</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-300 font-medium">อัลบั้ม "{albumInfo.titleThai}" ({albumInfo.releaseYear})</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-100 to-red-600">
              {bandInfo.name}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 font-light tracking-wide max-w-xl mx-auto">
            {bandInfo.taglineThai || 'วงดนตรีอารมณ์ร็อกลึกซึ้ง'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {songs.length > 0 ? (
              <button
                onClick={handlePlayTitleTrack}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-red-950/60 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>ฟังเพลง "{songs[0]?.titleThai || 'เพลงแรก'}"</span>
              </button>
            ) : (
              <button
                onClick={openTemplateModal}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-red-950/60 transition-all cursor-pointer"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>เพิ่มเพลง / โหลดเทมเพลต</span>
              </button>
            )}

            <button
              onClick={() => onNavigateSection('band')}
              className="flex items-center gap-1.5 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-200 font-medium px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <span>รายละเอียดสมาชิกวง</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {isAdmin && (
              <button
                onClick={openTemplateModal}
                className="flex items-center gap-1.5 bg-neutral-900/90 hover:bg-neutral-800 border border-red-500/40 text-red-300 font-medium px-3.5 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Layout className="w-3.5 h-3.5 text-red-400" />
                <span>จัดการเทมเพลต (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Full Band Poster Composite Frame */}
        <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-3 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-4">
          
          {/* Top Logo & Emblem Header */}
          <div className="text-center pt-2 pb-2 border-b border-neutral-800/80 space-y-2 relative group/logo">
            <div className="relative max-w-xs sm:max-w-md mx-auto flex flex-col items-center justify-center">
              <img
                src={images.bandLogo}
                alt={`${bandInfo.name} Official Logo`}
                onClick={() => {
                  if (isAdmin) openImageEditor('bandLogo');
                }}
                className="h-20 sm:h-28 max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(220,38,38,0.3)] transition-transform duration-300 group-hover/logo:scale-105 cursor-pointer"
              />
              {isAdmin && (
                <button
                  onClick={() => openImageEditor('bandLogo')}
                  className="absolute top-0 right-0 opacity-0 group-hover/logo:opacity-100 bg-neutral-950/90 border border-neutral-700 hover:border-red-500 text-neutral-200 text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer shadow-lg"
                >
                  <Camera className="w-3 h-3 text-red-400" />
                  <span>เปลี่ยนโลโก้วง</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Member Collage Grid (WIN, Mona, Ten, Tiger) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            
            {/* 1. WIN (Lead Vocal) */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 group shadow-lg aspect-[3/4] flex flex-col justify-end p-3">
              <img
                src={images.win}
                alt={winMember.nameEng}
                referrerPolicy="no-referrer"
                onClick={() => {
                  if (isAdmin) openImageEditor('win');
                }}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none"></div>
              
              {/* Change Image Button on Hover */}
              {isAdmin && (
                <button
                  onClick={() => openImageEditor('win')}
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-neutral-950/90 border border-neutral-700 hover:border-red-500 text-neutral-200 text-[10px] px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Camera className="w-3 h-3 text-red-400" />
                  <span>เปลี่ยนรูป</span>
                </button>
              )}

              <div className="relative z-10 space-y-0.5 pointer-events-none">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm sm:text-base font-black text-white">{winMember.nameThai}</h3>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">({winMember.nameEng.split(' ')[0]})</span>
                </div>
                <div className="text-[9px] font-mono text-red-400 font-bold uppercase">{winMember.role}</div>
                <p className="text-[10px] text-neutral-300 font-light line-clamp-2 italic pt-1 border-t border-neutral-800/60">
                  "{winMember.quote}"
                </p>
              </div>
            </div>

            {/* 2. Mona (Guest Vocal) */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 group shadow-lg aspect-[3/4] flex flex-col justify-end p-3">
              <img
                src={images.mona}
                alt={monaMember.nameEng}
                referrerPolicy="no-referrer"
                onClick={() => {
                  if (isAdmin) openImageEditor('mona');
                }}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none"></div>
              
              {isAdmin && (
                <button
                  onClick={() => openImageEditor('mona')}
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-neutral-950/90 border border-neutral-700 hover:border-red-500 text-neutral-200 text-[10px] px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Camera className="w-3 h-3 text-red-400" />
                  <span>เปลี่ยนรูป</span>
                </button>
              )}

              <div className="relative z-10 space-y-0.5 pointer-events-none">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm sm:text-base font-black text-white">{monaMember.nameThai}</h3>
                  <span className="text-[9px] font-mono text-red-400 font-bold uppercase italic">
                    {monaMember.nameEng.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-neutral-400 uppercase">{monaMember.role}</div>
                <p className="text-[10px] text-neutral-300 font-light line-clamp-2 italic pt-1 border-t border-neutral-800/60">
                  "{monaMember.quote}"
                </p>
              </div>
            </div>

            {/* 3. Ten (Bass) */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 group shadow-lg aspect-[3/4] flex flex-col justify-end p-3">
              <img
                src={images.ten}
                alt={tenMember.nameEng}
                referrerPolicy="no-referrer"
                onClick={() => {
                  if (isAdmin) openImageEditor('ten');
                }}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none"></div>
              
              {isAdmin && (
                <button
                  onClick={() => openImageEditor('ten')}
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-neutral-950/90 border border-neutral-700 hover:border-red-500 text-neutral-200 text-[10px] px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Camera className="w-3 h-3 text-red-400" />
                  <span>เปลี่ยนรูป</span>
                </button>
              )}

              <div className="relative z-10 space-y-0.5 pointer-events-none">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm sm:text-base font-black text-white">{tenMember.nameThai}</h3>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">({tenMember.nameEng.split(' ')[0]})</span>
                </div>
                <div className="text-[9px] font-mono text-red-400 font-bold uppercase">{tenMember.role}</div>
                <p className="text-[10px] text-neutral-300 font-light line-clamp-2 italic pt-1 border-t border-neutral-800/60">
                  "{tenMember.quote}"
                </p>
              </div>
            </div>

            {/* 4. Tiger (Drums) */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-950 group shadow-lg aspect-[3/4] flex flex-col justify-end p-3">
              <img
                src={images.tiger}
                alt={tigerMember.nameEng}
                referrerPolicy="no-referrer"
                onClick={() => {
                  if (isAdmin) openImageEditor('tiger');
                }}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none"></div>
              
              {isAdmin && (
                <button
                  onClick={() => openImageEditor('tiger')}
                  className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 bg-neutral-950/90 border border-neutral-700 hover:border-red-500 text-neutral-200 text-[10px] px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer shadow-md"
                >
                  <Camera className="w-3 h-3 text-red-400" />
                  <span>เปลี่ยนรูป</span>
                </button>
              )}

              <div className="relative z-10 space-y-0.5 pointer-events-none">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm sm:text-base font-black text-white">{tigerMember.nameThai}</h3>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">({tigerMember.nameEng.split(' ')[0]})</span>
                </div>
                <div className="text-[9px] font-mono text-red-400 font-bold uppercase">{tigerMember.role}</div>
                <p className="text-[10px] text-neutral-300 font-light line-clamp-2 italic pt-1 border-t border-neutral-800/60">
                  "{tigerMember.quote}"
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Album & Story Banner Strip */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 grid sm:grid-cols-12 gap-3 items-center">
            
            {/* Left Album Info */}
            <div className="sm:col-span-7 flex items-center gap-3 group relative">
              <div className="relative group/album">
                <img
                  src={images.albumCover}
                  alt="Album Cover"
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    if (isAdmin) openImageEditor('albumCover');
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-neutral-800 flex-shrink-0 shadow-md cursor-pointer"
                />
                {isAdmin && (
                  <button
                    onClick={() => openImageEditor('albumCover')}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/album:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-[9px] font-mono p-1 text-center cursor-pointer"
                  >
                    เปลี่ยนปก
                  </button>
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-950/80 border border-red-800/60 px-1.5 py-0.5 rounded">
                  ALBUM
                </span>
                <h4 className="text-sm sm:text-base font-black text-white tracking-wide">
                  {albumInfo.titleThai}
                </h4>
                <p className="text-[11px] text-neutral-300 italic font-light">
                  “{albumInfo.conceptQuote}”
                </p>
              </div>
            </div>

            {/* Right Bullet Points & Band Silhouette */}
            <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-neutral-800 sm:pl-3">
              <div className="space-y-1 text-[10px] text-neutral-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-red-500" />
                  <span>{members.length} สมาชิก {bandInfo.genre}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-red-400" />
                  <span>{songs.length} แทร็กในอัลบั้ม</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>สร้างสรรค์เพื่อผู้ฟังทุกคน</span>
                </div>
              </div>

              <div className="relative group/sil">
                <img
                  src={images.bandSilhouette}
                  alt="Band Silhouette"
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    if (isAdmin) openImageEditor('bandSilhouette');
                  }}
                  className="w-20 h-12 rounded-lg object-cover border border-neutral-800 opacity-80 filter contrast-125 hidden sm:block cursor-pointer"
                />
                {isAdmin && (
                  <button
                    onClick={() => openImageEditor('bandSilhouette')}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover/sil:opacity-100 transition-opacity rounded-lg hidden sm:flex items-center justify-center text-white text-[9px] font-mono p-1 text-center cursor-pointer"
                  >
                    เปลี่ยนรูปเงา
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};


