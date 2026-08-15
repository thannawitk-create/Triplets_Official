import React, { useState, useEffect, useRef } from 'react';
import { X, Music, Save, Plus, FileText, Sparkles, Check, AlignLeft, Upload, Volume2, Link as LinkIcon, Trash2, Loader2, Play, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useSongs } from '../context/SongContext';
import { Song } from '../types';
import { storeAudioBlob, removeAudioBlob, getAudioBlobUrl } from '../utils/audioStorage';

const AUDIO_PRESETS = [
  {
    name: '🎸 Rock Riff Sample 1',
    url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_rock_concert.ogg',
  },
  {
    name: '🥁 Heavy Drums Loop Sample',
    url: 'https://actions.google.com/sounds/v1/sports/skateboarding_loop.ogg',
  },
  {
    name: '🎵 Melancholic Piano & Guitar Sample',
    url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  },
];

export const SongEditorModal: React.FC = () => {
  const { isSongEditorOpen, closeSongEditor, editingSong, addSong, editSong, isAdmin, loginAdmin } = useSongs();

  const [titleThai, setTitleThai] = useState('');
  const [titleEng, setTitleEng] = useState('');
  const [duration, setDuration] = useState('4:15');
  const [featuredArtist, setFeaturedArtist] = useState('');
  const [story, setStory] = useState('');
  const [lyricsText, setLyricsText] = useState('');
  const [chords, setChords] = useState('');
  const [bpm, setBpm] = useState(116);
  const [musicKey, setMusicKey] = useState('A Minor');
  const [audioStyle, setAudioStyle] = useState<'melancholic_rock' | 'heavy_groove' | 'ballad' | 'energetic_alt'>('melancholic_rock');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [pendingAudioBlob, setPendingAudioBlob] = useState<Blob | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(adminPinInput)) {
      setAdminPinError(null);
      setAdminPinInput('');
    } else {
      setAdminPinError('รหัสผ่านไม่ถูกต้อง (กรุณากรอกรหัสผ่าน Admin)');
    }
  };

  useEffect(() => {
    // Stop preview audio when modal closes or song changes
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
      setPreviewPlaying(false);
    }
  }, [isSongEditorOpen, editingSong]);

  const togglePreviewAudio = async () => {
    if (previewPlaying && previewAudioRef.current) {
      previewAudioRef.current.pause();
      setPreviewPlaying(false);
      return;
    }

    let src = '';
    if (pendingAudioBlob) {
      src = URL.createObjectURL(pendingAudioBlob);
    } else if (audioUrl.startsWith('idb://')) {
      const idbKey = audioUrl.replace('idb://', '');
      const blobUrl = await getAudioBlobUrl(idbKey);
      if (blobUrl) src = blobUrl;
    } else if (audioUrl.trim()) {
      src = audioUrl.trim();
    }

    if (!src) {
      alert('ยังไม่มีไฟล์เสียงสำหรับทดลองฟัง กรุณาเลือกไฟล์หรือระบุ URL');
      return;
    }

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }

    const audio = new Audio(src);
    audio.onended = () => setPreviewPlaying(false);
    audio.onerror = () => {
      alert('ไม่สามารถเล่นไฟล์เสียงนี้ได้ กรุณาตรวจสอบไฟล์หรือลิงก์');
      setPreviewPlaying(false);
    };

    previewAudioRef.current = audio;
    try {
      await audio.play();
      setPreviewPlaying(true);
    } catch {
      setPreviewPlaying(false);
    }
  };

  useEffect(() => {
    if (editingSong) {
      setTitleThai(editingSong.titleThai || '');
      setTitleEng(editingSong.titleEng || '');
      setDuration(editingSong.duration || '4:15');
      setFeaturedArtist(editingSong.featuredArtist || '');
      setStory(editingSong.story || '');
      setLyricsText(Array.isArray(editingSong.lyrics) ? editingSong.lyrics.join('\n') : '');
      setChords(editingSong.chords || '');
      setBpm(editingSong.audioParams?.bpm || 116);
      setMusicKey(editingSong.audioParams?.key || 'A Minor');
      setAudioStyle(editingSong.audioParams?.style || 'melancholic_rock');
      setAudioUrl(editingSong.audioUrl || '');
      setAudioFileName(editingSong.audioUrl ? (editingSong.audioUrl.startsWith('idb://') ? 'ไฟล์เสียง MP3/WAV ที่อัปโหลดแล้ว' : 'ลิงก์ไฟล์เสียง Audio URL') : '');
      setPendingAudioBlob(null);
    } else {
      // Reset form for new song
      setTitleThai('');
      setTitleEng('');
      setDuration('4:15');
      setFeaturedArtist('');
      setStory('');
      setLyricsText('มองย้อนไปในวันเก่า ที่เคยมีเธอตรงนี้\nทุกภาพความทรงจำยังชัดเจนในใจ...\n\n(Chorus)\nหากวันนั้นฉันรู้ว่านั่นคือครั้งสุดท้าย...');
      setChords('Intro: Am | F | C | G\nChorus: F | G | Em | Am');
      setBpm(116);
      setMusicKey('A Minor');
      setAudioStyle('melancholic_rock');
      setAudioUrl('');
      setAudioFileName('');
      setPendingAudioBlob(null);
    }
  }, [editingSong, isSongEditorOpen]);

  if (!isSongEditorOpen) return null;

  // Handle uploading audio file (.mp3, .wav, .m4a, .ogg)
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAudio(true);
    setAudioFileName(file.name);
    setPendingAudioBlob(file);

    // Auto calculate duration from uploaded audio metadata
    const objectUrl = URL.createObjectURL(file);
    const testAudio = new Audio(objectUrl);
    testAudio.onloadedmetadata = () => {
      if (testAudio.duration && !isNaN(testAudio.duration)) {
        const mins = Math.floor(testAudio.duration / 60);
        const secs = Math.floor(testAudio.duration % 60);
        const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        setDuration(formatted);
      }
      setIsProcessingAudio(false);
      URL.revokeObjectURL(objectUrl);
    };
    testAudio.onerror = () => {
      setIsProcessingAudio(false);
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleClearAudio = async () => {
    setAudioUrl('');
    setAudioFileName('');
    setPendingAudioBlob(null);
    if (editingSong?.id) {
      await removeAudioBlob(editingSong.id);
    }
    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = '';
    }
  };

  // Calculate duration in seconds e.g. "4:15" => 255
  const parseDurationSeconds = (durStr: string): number => {
    try {
      const parts = durStr.split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0], 10) || 0;
        const secs = parseInt(parts[1], 10) || 0;
        return mins * 60 + secs;
      }
    } catch {
      // fallback
    }
    return 240;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleThai.trim()) {
      alert('กรุณากรอกชื่อเพลงภาษาไทย');
      return;
    }

    setIsProcessingAudio(true);

    let finalAudioUrl = audioUrl.trim();
    const songId = editingSong ? editingSong.id : `song-custom-${Date.now()}`;

    // If an MP3/WAV audio file was selected, save it into IndexedDB
    if (pendingAudioBlob) {
      try {
        finalAudioUrl = await storeAudioBlob(songId, pendingAudioBlob);
      } catch (err) {
        console.error('Failed to store audio file:', err);
      }
    }

    const lyricsArray = lyricsText
      .split('\n')
      .map(line => line.trimEnd());

    const durSecs = parseDurationSeconds(duration);

    const songData = {
      titleThai: titleThai.trim(),
      titleEng: titleEng.trim() || titleThai.trim(),
      duration: duration.trim() || '4:00',
      durationSeconds: durSecs,
      featuredArtist: featuredArtist.trim() || undefined,
      story: story.trim() || 'บทเพลงอารมณ์ลึกซึ้งจากวง TRIPLETS',
      lyrics: lyricsArray,
      chords: chords.trim() || undefined,
      audioUrl: finalAudioUrl || undefined,
      audioParams: {
        bpm: Number(bpm) || 120,
        key: musicKey || 'A Minor',
        style: audioStyle,
        rootNote: 57,
      },
    };

    if (editingSong) {
      editSong(editingSong.id, songData);
    } else {
      addSong(songData);
    }

    setIsProcessingAudio(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      closeSongEditor();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600/20 border border-red-500/30 rounded-xl text-red-500">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{editingSong ? 'แก้ไขเพลงและเนื้อเพลง' : 'เพิ่มเพลงใหม่'}</span>
                <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
                  ADMIN ONLY
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                {editingSong ? `แก้ไขเพลง "${editingSong.titleThai}"` : 'กรอกรายละเอียดเพื่อเพิ่มเพลงลงในอัลบั้ม'}
              </p>
            </div>
          </div>

          <button
            onClick={closeSongEditor}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAdmin ? (
          /* Admin Security Lock Screen */
          <div className="p-8 text-center space-y-5 bg-neutral-900 my-auto animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center mx-auto text-red-400 shadow-xl shadow-red-950/60">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="text-xl font-bold text-white">สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin)</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                การเพิ่ม แก้ไข ลบ เพลงและเนื้อเพลง สงวนสิทธิ์สำหรับ Admin เท่านั้น กรุณากรอกรหัสผ่าน Admin PIN เพื่อดำเนินการต่อ
              </p>
            </div>

            <form onSubmit={handleAdminUnlock} className="max-w-xs mx-auto space-y-3 pt-2">
              <div className="relative">
                <input
                  type="password"
                  maxLength={10}
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  placeholder="กรอกรหัสผ่าน Admin PIN"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-center font-mono text-base text-white focus:outline-none shadow-inner"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {adminPinError && (
                <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{adminPinError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeSongEditor}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ปลดล็อก Admin</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Scrollable Form Body */
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Track Basic Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                ชื่อเพลง (ภาษาไทย) *
              </label>
              <input
                type="text"
                required
                value={titleThai}
                onChange={(e) => setTitleThai(e.target.value)}
                placeholder="เช่น หากวันนั้น..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                ชื่อเพลง (ภาษาอังกฤษ)
              </label>
              <input
                type="text"
                value={titleEng}
                onChange={(e) => setTitleEng(e.target.value)}
                placeholder="เช่น If That Day..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                ความยาวเพลง (นาที:วินาที)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="4:15"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                ศิลปินร่วม / นักร้องรับเชิญ (ถ้ามี)
              </label>
              <input
                type="text"
                value={featuredArtist}
                onChange={(e) => setFeaturedArtist(e.target.value)}
                placeholder="เช่น Feat. Mona"
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

          </div>

          {/* Story Behind Song */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>เรื่องราว / แนวคิดเบื้องหลังบทเพลง (Story)</span>
            </label>
            <textarea
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="อธิบายที่มา หรือเรื่องราวที่ถ่ายทอดในเพลงนี้..."
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Lyrics Editor (Key Request: เพิ่ม ลบ เนื้อเพลงได้) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-red-500" />
                <span>เนื้อเพลงเต็ม (Lyrics) - กรอกบรรทัดละ 1 ประโยค</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">
                {lyricsText.split('\n').filter(l => l.trim()).length} บรรทัด
              </span>
            </div>

            <textarea
              rows={8}
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder={`พิมพ์หรือวางเนื้อเพลงที่นี่...\n(Chorus)\nหากวันนั้นฉันรู้ว่านั่นคือครั้งสุดท้าย...`}
              className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl p-3.5 text-xs text-neutral-100 font-mono leading-relaxed focus:outline-none resize-y"
            />
          </div>

          {/* Chords & Synthesizer Parameters */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800/80">
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                คอร์ดเพลง (Chords)
              </label>
              <textarea
                rows={3}
                value={chords}
                onChange={(e) => setChords(e.target.value)}
                placeholder="Intro: Am | F | C | G..."
                className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-300 block">
                สไตล์ดนตรีและจังหวะ (Audio Synth)
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">สไตล์ดนตรี:</span>
                  <select
                    value={audioStyle}
                    onChange={(e) => setAudioStyle(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="melancholic_rock">Melancholic Rock</option>
                    <option value="heavy_groove">Heavy Groove</option>
                    <option value="ballad">Emotional Ballad</option>
                    <option value="energetic_alt">Energetic Alt-Rock</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">BPM จังหวะ:</span>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Audio File Upload & Stream URL Section */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-red-500" />
                <span>เพิ่มไฟล์เพลงสตรีมมิ่ง (Audio File / MP3 / WAV)</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                {audioFileName || audioUrl ? 'มีไฟล์เสียงแล้ว' : 'ใช้ระบบดนตรีสังเคราะห์ (Synth)'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              อัปโหลดไฟล์เพลงจริงของคุณ (.mp3, .wav, .m4a, .ogg) หรือระบุลิงก์ไฟล์เสียง Audio URL เพื่อให้ผู้ฟังเปิดเล่นเพลงจริงได้ผ่านผู้เล่นเพลง
            </p>

            {/* Hidden File Input */}
            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioFileChange}
              className="hidden"
            />

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Option 1: Upload MP3/WAV File from computer */}
              <button
                type="button"
                onClick={() => audioFileInputRef.current?.click()}
                disabled={isProcessingAudio}
                className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-white font-medium text-xs py-3 px-4 rounded-xl transition-all cursor-pointer group"
              >
                {isProcessingAudio ? (
                  <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                )}
                <span>{audioFileName ? 'เปลี่ยนไฟล์เพลง MP3/WAV' : 'เลือกไฟล์เพลงจากเครื่อง (.mp3)'}</span>
              </button>

              {/* Option 2: Enter Audio File URL */}
              <div className="relative flex items-center">
                <LinkIcon className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={audioUrl.startsWith('idb://') ? '' : audioUrl}
                  onChange={(e) => {
                    setAudioUrl(e.target.value);
                    setAudioFileName(e.target.value ? 'ลิงก์ไฟล์เสียง Audio URL' : '');
                    setPendingAudioBlob(null);
                  }}
                  placeholder="หรือ วางลิงก์ Audio URL (https://...)"
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl pl-9 pr-3 py-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Current Active File Indicator & Presets */}
            {(audioFileName || audioUrl || pendingAudioBlob) && (
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 bg-red-600/20 text-red-400 rounded-lg shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">
                      {audioFileName || audioUrl}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      ✓ โหลดไฟล์เสียงพร้อมใช้งาน
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={togglePreviewAudio}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border ${
                      previewPlaying
                        ? 'bg-red-600 border-red-500 text-white animate-pulse'
                        : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
                    }`}
                  >
                    {previewPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-red-400" />}
                    <span>{previewPlaying ? 'หยุดฟัง' : 'ลองฟังเสียง'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAudio}
                    className="p-1.5 bg-neutral-800 hover:bg-red-900/80 text-neutral-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="ลบไฟล์เพลงนี้ออก"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Demo Presets Row */}
            <div className="pt-1">
              <span className="text-[10px] text-neutral-400 font-mono block mb-1.5">
                หรือเลือกใช้ตัวอย่างเพลง Rock Demo Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {AUDIO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAudioUrl(preset.url);
                      setAudioFileName(preset.name);
                      setPendingAudioBlob(null);
                    }}
                    className="text-[11px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-500 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 text-red-500" />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={closeSongEditor}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={savedSuccess}
              className={`font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingSong ? 'บันทึกการแก้ไข' : 'เพิ่มเพลงใหม่'}</span>
                </>
              )}
            </button>
          </div>

        </form>
        )}

      </div>
    </div>
  );
};
