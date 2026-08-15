import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc, Music, FileText, Share2, Heart, Sparkles, ExternalLink, Repeat, Repeat1, Shuffle, Plus, Edit3, Trash2, Lock, ShieldCheck, RefreshCw, KeyRound, Camera, Images, ChevronLeft, ChevronRight, Layout, UploadCloud } from 'lucide-react';
import { Song } from '../types';
import { useSongs } from '../context/SongContext';
import { useBandImages, BandImageMap } from '../context/ImageContext';

interface MusicPlayerSectionProps {
  // Optional props retained for backwards compatibility
  currentTrackId?: string;
  onSelectTrack?: (songId: string) => void;
}

export const MusicPlayerSection: React.FC<MusicPlayerSectionProps> = () => {
  const {
    songs,
    isAdmin,
    openAdminModal,
    logoutAdmin,
    openSongEditor,
    openTemplateModal,
    deleteSong,
    resetSongs,
    bandInfo,
    albumInfo,
    currentTrackId,
    setCurrentTrackId,
    isPlaying,
    isUsingRealAudio,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffle,
    frequencies,
    playTrack,
    togglePlayPause,
    playNext,
    playPrev,
    toggleRepeatMode,
    toggleShuffle,
    seek,
    setVolume,
  } = useSongs();

  const { images, openImageEditor, slideshowList, deleteSlide } = useBandImages();

  const [activeTab, setActiveTab] = useState<'lyrics' | 'story' | 'chords'>('lyrics');
  const [copiedLink, setCopiedLink] = useState(false);

  // Band Image Slideshow states
  const [isSlideshowMode, setIsSlideshowMode] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto transition slideshow every 4.5 seconds when active
  useEffect(() => {
    if (!isSlideshowMode || slideshowList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideshowList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isSlideshowMode, slideshowList.length]);

  const activeSlide = slideshowList[currentSlideIndex] || slideshowList[0] || {
    id: 'default',
    title: albumInfo.titleThai,
    subtitle: `${bandInfo.name} Official`,
    url: images.albumCover,
  };

  const handleDeleteCurrentSlide = () => {
    if (slideshowList.length <= 1) {
      alert('จำเป็นต้องมีรูปภาพเหลือในสไลด์โชว์อย่างน้อย 1 รูป');
      return;
    }
    if (confirm(`คุณต้องการลบรูปสไลด์ "${activeSlide.title}" ออกใช่หรือไม่?`)) {
      deleteSlide(activeSlide.id);
      setCurrentSlideIndex((prev) => (prev >= slideshowList.length - 1 ? 0 : prev));
    }
  };

  // Fallback to first song if currentTrackId isn't found
  const activeSong: Song = (songs.length > 0 ? (songs.find(s => s.id === currentTrackId) || songs[0]) : null) || {
    id: 'empty-slot',
    trackNumber: 1,
    titleThai: 'โหมดโครงร่างเปล่า (ยังไม่มีเพลง)',
    titleEng: 'Blank Design Mode (No Tracks)',
    duration: '0:00',
    durationSeconds: 0,
    story: 'ขณะนี้อยู่ในโหมดออกแบบโครงร่างเปล่า คุณสามารถกดปุ่ม "เพิ่มเพลงใหม่" หรือ "จัดการเทมเพลต" เพื่อเพิ่มเพลง นำเข้าไฟล์ หรือบันทึกเป็นเทมเพลตได้ทันที',
    lyrics: [
      '[โหมดออกแบบโครงร่างว่างเปล่า]',
      'คุณสามารถกด "เพิ่มเพลงใหม่" เพื่อกรอกชื่อเพลง เนื้อเพลง และคอร์ดได้',
      'หรือเลือกโหลดเทมเพลตจากระบบ Template Manager'
    ],
    chords: 'C  G  Am  F',
    audioParams: { bpm: 120, key: 'C', style: 'melancholic_rock' as const, rootNote: 60 }
  };

  const handleTogglePlay = (song: Song) => {
    if (!song) return;
    togglePlayPause(song.id);
  };

  const handleDelete = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (window.confirm(`คุณต้องการลบเพลง "${song.titleThai}" และเนื้อเพลงนี้ใช่หรือไม่?`)) {
      deleteSong(song.id);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="music" className="py-20 bg-neutral-950 text-neutral-100 relative overflow-hidden border-t border-neutral-800/80">
      
      {/* Background Decorative Gradient Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-950/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/40 border border-red-800/40 px-3 py-1 rounded-full">
            <Disc className="w-3.5 h-3.5" />
            <span>MUSIC & OFFICIAL ALBUM</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            ฟังเพลงอัลบั้ม <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-100 to-red-600">"{albumInfo.titleThai}"</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            "{albumInfo.conceptQuote}" - รวมบทเพลงร็อกอารมณ์เข้มข้น ฟังออนไลน์ได้ทันทีพร้อมเนื้อเพลงและคอร์ดกีตาร์
          </p>
        </div>

        {/* Main Music Player Card Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Album Player Main Visual */}
          <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6">
            
            {/* Album Cover Art & Band Image Slideshow */}
            <div className="relative aspect-square rounded-2xl overflow-hidden group shadow-2xl border border-neutral-800 bg-neutral-950">
              <img
                src={activeSlide.url}
                alt={activeSlide.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40 opacity-90"></div>

              {/* Top Bar Controls Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
                {/* Left controls: Edit & Delete buttons (Visible only in Admin mode) */}
                {isAdmin ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openImageEditor(activeSlide.key)}
                      className="flex items-center gap-1.5 bg-neutral-950/85 hover:bg-red-600 border border-neutral-700/80 hover:border-red-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-xl backdrop-blur-md transition-all cursor-pointer group"
                      title={`แก้ไขภาพ ${activeSlide.title}`}
                    >
                      <Camera className="w-3.5 h-3.5 text-red-500 group-hover:text-white transition-colors" />
                      <span>แก้ไขรูป</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteCurrentSlide}
                      className="flex items-center justify-center p-1.5 bg-neutral-950/85 hover:bg-red-950 border border-neutral-700/80 hover:border-red-600 text-neutral-300 hover:text-red-400 rounded-xl shadow-xl backdrop-blur-md transition-all cursor-pointer"
                      title={`ลบรูป "${activeSlide.title}" ออกจากสไลด์โชว์`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div></div>
                )}

                {/* Right controls: Add slide, Slideshow Toggle & Vinyl Disc Indicator */}
                <div className="flex items-center gap-1.5">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => openImageEditor()}
                      className="flex items-center gap-1 bg-neutral-950/85 hover:bg-emerald-900 border border-neutral-700/80 hover:border-emerald-600 text-emerald-400 hover:text-white text-[11px] font-bold px-2 py-1.5 rounded-xl shadow-xl backdrop-blur-md transition-all cursor-pointer"
                      title="เพิ่มรูปสไลด์โชว์ใหม่ (แนะนำสัดส่วน 1:1 ขนาด 1000x1000 px)"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">เพิ่มรูป</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsSlideshowMode(!isSlideshowMode)}
                    className={`flex items-center gap-1.5 text-[11px] font-mono font-bold px-2 py-1.5 rounded-xl shadow-lg backdrop-blur-md transition-all cursor-pointer border ${
                      isSlideshowMode
                        ? 'bg-red-950/90 border-red-600/80 text-red-300'
                        : 'bg-neutral-950/80 border-neutral-700 text-neutral-300 hover:text-white'
                    }`}
                    title="สลับโหมดสไลด์โชว์รูปภาพวงอัตโนมัติ"
                  >
                    <Images className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">{isSlideshowMode ? 'สไลด์ ON' : 'สไลด์ OFF'}</span>
                  </button>

                  <div className={`w-7 h-7 rounded-full border border-neutral-700/80 bg-neutral-950/90 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-spin' : ''}`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-600 border border-neutral-900"></div>
                  </div>
                </div>
              </div>

              {/* Manual Nav Arrows (On Hover) */}
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slideshowList.length) % slideshowList.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-700/80 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                title="รูปก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slideshowList.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-700/80 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                title="รูปถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Album Title & Slide Info Overlay Tag */}
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold bg-neutral-950/90 border border-neutral-800 px-2.5 py-0.5 rounded shadow">
                    ALBUM TRACK #{activeSong.trackNumber}
                  </span>

                  <span className="text-[10px] font-mono text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                    🖼️ {activeSlide.title}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white truncate drop-shadow-md">
                  {activeSong.titleThai}
                </h3>
                <p className="text-xs text-neutral-300 font-mono drop-shadow">
                  {activeSong.titleEng} {activeSong.featuredArtist && <span className="text-red-400 font-bold">({activeSong.featuredArtist})</span>}
                </p>

                {/* Slideshow Dot Indicators */}
                <div className="flex items-center justify-center gap-1.5 pt-2.5">
                  {slideshowList.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCurrentSlideIndex(idx);
                        setIsSlideshowMode(false);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIndex
                          ? 'w-6 bg-red-500'
                          : 'w-1.5 bg-neutral-600 hover:bg-neutral-400'
                      }`}
                      title={item.title}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Audio Equalizer Visualizer Bars */}
            <div className="bg-neutral-950/90 border border-neutral-800 rounded-2xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono gap-2 text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-red-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    AUDIO SPECTRUM
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-sans font-semibold ${
                    isUsingRealAudio
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                  }`}>
                    {isUsingRealAudio ? '🔊 ไฟล์เสียง MP3 จริง' : '🎸 Demo Rock Synth'}
                  </span>
                </div>
                <span>BPM: {activeSong.audioParams.bpm} | Key: {activeSong.audioParams.key}</span>
              </div>

              <div className="flex items-end justify-between h-12 gap-1 pt-2">
                {frequencies.map((val, idx) => (
                  <div key={idx} className="flex-1 bg-neutral-800 rounded-t overflow-hidden h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-red-800 via-red-500 to-neutral-200 transition-all duration-75 rounded-t"
                      style={{ height: `${val}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Track Timeline Seek Bar */}
            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max={duration || activeSong.durationSeconds || 1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600 hover:accent-red-500"
              />
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration) || activeSong.duration}</span>
              </div>
            </div>

            {/* Audio Controls (Shuffle, Repeat, Next, Prev, Play/Pause, Volume) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                
                {/* Left: Shuffle & Repeat Mode Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleShuffle}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isShuffle
                        ? 'bg-red-950/90 border-red-600 text-red-300 shadow-lg shadow-red-950/60'
                        : 'bg-neutral-800/80 border-neutral-700/80 text-neutral-400 hover:text-white hover:bg-neutral-700'
                    }`}
                    title={isShuffle ? 'สุ่มเพลง: เปิดอยู่ (คลิกเพื่อปิด)' : 'สุ่มเพลง: ปิดอยู่ (คลิกเพื่อเปิด)'}
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleRepeatMode}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                      repeatMode !== 'off'
                        ? 'bg-red-950/90 border-red-600 text-red-300 shadow-lg shadow-red-950/60'
                        : 'bg-neutral-800/80 border-neutral-700/80 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700'
                    }`}
                    title={
                      repeatMode === 'all'
                        ? 'โหมดเล่นวน: วนทั้งอัลบั้ม (คลิกเพื่อเปลี่ยนเป็น วนเพลงเดียว)'
                        : repeatMode === 'one'
                        ? 'โหมดเล่นวน: วนซ้ำเพลงเดียว (คลิกเพื่อปิดโหมดวน)'
                        : 'โหมดเล่นวน: ปิดอยู่ (คลิกเพื่อเปิดเล่นวนทั้งอัลบั้ม)'
                    }
                  >
                    {repeatMode === 'one' ? <Repeat1 className="w-4 h-4 text-red-400" /> : <Repeat className="w-4 h-4" />}
                    {repeatMode === 'one' && <span className="text-[10px] font-bold font-mono">1</span>}
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/80 text-neutral-300 hover:text-white transition-colors cursor-pointer relative"
                    title="แชร์บทเพลง"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedLink && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow">
                        คัดลอกลิงก์แล้ว!
                      </span>
                    )}
                  </button>
                </div>

                {/* Center: Prev, Play/Pause, Next */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={playPrev}
                    className="p-2.5 sm:p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Previous Track"
                    title="เพลงก่อนหน้า"
                  >
                    <SkipBack className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => handleTogglePlay(activeSong)}
                    className="p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-950/80 transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Play or Pause"
                  >
                    {isPlaying && currentTrackId === activeSong.id ? (
                      <Pause className="w-5 sm:w-6 h-5 sm:h-6 fill-current" />
                    ) : (
                      <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={playNext}
                    className="p-2.5 sm:p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Next Track"
                    title="เพลงถัดไป"
                  >
                    <SkipForward className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                  </button>
                </div>

                {/* Right: Volume Slider */}
                <div className="flex items-center gap-1.5">
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-neutral-300" />}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                    title={`ระดับเสียง: ${Math.round(volume * 100)}%`}
                  />
                </div>
              </div>

              {/* Playback Mode Status Badge */}
              <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-400">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`}></span>
                  <span className="text-neutral-300 font-medium truncate">
                    {repeatMode === 'all' && '🔁 เล่นต่อเนื่อง (วนทั้งอัลบั้ม)'}
                    {repeatMode === 'one' && '🔂 เล่นวนซ้ำ (เพลงปัจจุบัน)'}
                    {repeatMode === 'off' && '➡️ เล่นต่อเนื่องตามลำดับ (Sequential)'}
                  </span>
                </div>
                {isShuffle && (
                  <span className="text-red-400 font-bold bg-red-950/90 border border-red-800/80 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                    🔀 สุ่มเพลง ON
                  </span>
                )}
              </div>
            </div>

            {/* External Streaming Platform Buttons */}
            <div className="pt-4 border-t border-neutral-800 text-center space-y-2">
              <p className="text-xs text-neutral-400 font-mono uppercase">ฟังบนมิวสิกสตรีมมิงมินิเพลตฟอร์ม</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5">
                  Spotify <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="text-xs bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:bg-rose-900 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5">
                  Apple Music <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-xs bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5">
                  YouTube Music <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Right: Album Tracklist & Interactive Lyrics / Story Viewer */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Admin Control Bar for Songs & Lyrics */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                {isAdmin ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin Mode Active</span>
                  </div>
                ) : (
                  <button
                    onClick={openAdminModal}
                    className="flex items-center gap-2 text-xs font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:text-white"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-red-500" />
                    <span>เข้าสู่ระบบ Admin เพื่อ เพิ่ม/ลบ/แก้ไข เพลง & เนื้อเพลง</span>
                  </button>
                )}
              </div>

              {isAdmin ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={openTemplateModal}
                    className="bg-neutral-800 hover:bg-neutral-700 border border-red-500/50 text-red-300 hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    title="จัดการเทมเพลต / ทำเป็นค่าว่าง / นำเข้าไฟล์ (Admin Only)"
                  >
                    <Layout className="w-3.5 h-3.5 text-red-400" />
                    <span>จัดการเทมเพลต</span>
                  </button>
                  <button
                    onClick={() => openSongEditor()}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มเพลงใหม่</span>
                  </button>
                  <button
                    onClick={resetSongs}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs p-1.5 rounded-xl transition-colors cursor-pointer"
                    title="คืนค่าเป็นเพลงเริ่มต้น"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={logoutAdmin}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-400 text-xs px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAdminModal}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500/60 text-neutral-300 hover:text-white text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5"
                  title="เข้าสู่ระบบ Admin เพื่อจัดการเพลงและเทมเพลต"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>เข้าสู่ระบบ Admin</span>
                </button>
              )}
            </div>

            {/* Tracklist Table */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>รายชื่อเพลงในอัลบั้ม ({songs.length} เพลง)</span>
                  {isAdmin && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full">
                      โหมด Admin
                    </span>
                  )}
                </h3>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openTemplateModal}
                      className="text-xs bg-neutral-800 hover:bg-neutral-700 text-red-400 border border-neutral-700 px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="จัดการเทมเพลต (Admin Only)"
                    >
                      <Layout className="w-3.5 h-3.5" />
                      <span>เทมเพลต</span>
                    </button>
                    <button
                      onClick={() => openSongEditor()}
                      className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มเพลง</span>
                    </button>
                  </div>
                )}
              </div>

              {songs.length === 0 ? (
                <div className="text-center py-10 px-4 border border-dashed border-neutral-800 rounded-2xl space-y-3 bg-neutral-950/50">
                  <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
                    <Music className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">ไม่มีเพลงในอัลบั้ม</h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      {isAdmin 
                        ? 'ขณะนี้อยู่ในโหมดออกแบบโครงร่างว่าง คุณสามารถเริ่มใส่เพลงใหม่ หรือเลือกใช้เทมเพลตสำเร็จรูป / นำเข้าไฟล์ JSON'
                        : 'กำลังอยู่ระหว่างการจัดเตรียมเพลงและอัลบั้ม กรุณาเข้าสู่ระบบ Admin เพื่อจัดการเพลง'}
                    </p>
                  </div>
                  {isAdmin ? (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => openSongEditor()}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มเพลงแรก</span>
                      </button>
                      <button
                        onClick={openTemplateModal}
                        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layout className="w-4 h-4 text-red-400" />
                        <span>จัดการเทมเพลต & นำเข้า</span>
                      </button>
                      <button
                        onClick={resetSongs}
                        className="bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>โหลดเพลงเริ่มต้น</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        onClick={openAdminModal}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>เข้าสู่ระบบ Admin เพื่อจัดการ</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/80">
                  {songs.map((song) => {
                    const isCurrent = song.id === activeSong.id;
                    const isSongPlaying = isCurrent && isPlaying;

                    return (
                      <div
                        key={song.id}
                        onClick={() => handleTogglePlay(song)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer group ${
                          isCurrent 
                            ? 'bg-red-950/40 border border-red-800/50 text-white' 
                            : 'hover:bg-neutral-800/50 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                            isCurrent ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-white'
                          }`}>
                            {isSongPlaying ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                            ) : (
                              song.trackNumber
                            )}
                          </div>

                          <div>
                            <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                              <span>{song.titleThai}</span>
                              {song.featuredArtist && (
                                <span className="text-xs bg-red-950 text-red-400 border border-red-800/60 px-2 py-0.5 rounded font-mono">
                                  {song.featuredArtist}
                                </span>
                              )}
                              {song.audioUrl && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                                  AUDIO
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 font-mono">
                              {song.titleEng} • {song.audioParams?.style ? song.audioParams.style.replace('_', ' ') : 'Rock'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-neutral-400">{song.duration}</span>

                          {/* Admin Track Action Buttons (Edit, Delete) */}
                          {isAdmin && (
                            <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-700/60">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openSongEditor(song);
                                }}
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="แก้ไขเพลงและเนื้อเพลง"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, song)}
                                className="p-1.5 bg-neutral-800 hover:bg-red-900/80 text-neutral-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                                title="ลบเพลงนี้"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <button
                            className={`p-2 rounded-full transition-all ${
                              isSongPlaying ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 group-hover:bg-red-600 group-hover:text-white'
                            }`}
                          >
                            {isSongPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lyrics / Story / Chords Tab Switcher */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('lyrics')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'lyrics'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    เนื้อเพลง (Lyrics)
                  </button>
                  <button
                    onClick={() => setActiveTab('story')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'story'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    เรื่องราวเพลง (Story)
                  </button>
                  {activeSong.chords && (
                    <button
                      onClick={() => setActiveTab('chords')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'chords'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      คอร์ดกีตาร์ (Chords)
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => openSongEditor(activeSong)}
                      className="text-[11px] bg-red-600/30 hover:bg-red-600 border border-red-500/50 text-red-300 hover:text-white px-2.5 py-1 rounded-lg transition-all font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>แก้ไขเนื้อเพลงนี้</span>
                    </button>
                  )}
                  <span className="text-xs font-mono text-neutral-400 hidden sm:block">
                    แทร็กปัจจุบัน: {activeSong.titleThai}
                  </span>
                </div>
              </div>

              {/* Tab Content Display */}
              <div className="pt-2">
                {activeTab === 'lyrics' && (
                  <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-6 max-h-80 overflow-y-auto space-y-2 text-center text-sm sm:text-base leading-relaxed text-neutral-300 font-sans tracking-wide">
                    {activeSong.lyrics.map((line, idx) => (
                      <p
                        key={idx}
                        className={`transition-all ${
                          line.startsWith('(Chorus')
                            ? 'text-red-400 font-bold py-1 text-base'
                            : line === ''
                            ? 'py-1'
                            : 'hover:text-white'
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                )}

                {activeTab === 'story' && (
                  <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-6 space-y-3 text-sm text-neutral-300 font-light leading-relaxed">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      แรงบันดาลใจในการแต่งเพลง "{activeSong.titleThai}"
                    </h4>
                    <p>{activeSong.story}</p>
                    <div className="pt-3 border-t border-neutral-800 text-xs font-mono text-neutral-400 grid grid-cols-2 gap-2">
                      <div>จังหวะเพลง: {activeSong.audioParams.bpm} BPM</div>
                      <div>คีย์ดนตรี: {activeSong.audioParams.key}</div>
                    </div>
                  </div>
                )}

                {activeTab === 'chords' && activeSong.chords && (
                  <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-6 font-mono text-xs text-red-400 whitespace-pre-wrap leading-relaxed">
                    {activeSong.chords}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
