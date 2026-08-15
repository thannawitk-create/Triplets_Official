import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song, BandTemplateData, SavedTemplateMeta, BandMember } from '../types';
import { SONGS as DEFAULT_SONGS, BAND_INFO as DEFAULT_BAND_INFO, ALBUM_INFO as DEFAULT_ALBUM_INFO, MEMBERS as DEFAULT_MEMBERS } from '../data/bandData';
import { BLANK_STARTER_SONGS, BLANK_BAND_INFO, BLANK_ALBUM_INFO, BLANK_MEMBERS, PRESET_TEMPLATES } from '../data/templatePresets';
import { audioSynth } from '../utils/audioSynth';
import { BandImageMap, SlideshowItem, DEFAULT_IMAGES } from './ImageContext';
import { BLANK_PLACEHOLDER_IMAGES } from '../utils/placeholderImages';

const SONGS_STORAGE_KEY = 'triplets_custom_songs_v3';
const ADMIN_STORAGE_KEY = 'triplets_admin_logged_in_v1';
const BOOKING_STORAGE_KEY = 'triplets_booking_contact_v1';
const REPEAT_STORAGE_KEY = 'triplets_repeat_mode_v1';
const SHUFFLE_STORAGE_KEY = 'triplets_shuffle_mode_v1';
const BAND_INFO_STORAGE_KEY = 'triplets_band_info_v1';
const ALBUM_INFO_STORAGE_KEY = 'triplets_album_info_v1';
const MEMBERS_STORAGE_KEY = 'triplets_members_info_v1';
const SAVED_TEMPLATES_STORAGE_KEY = 'triplets_saved_templates_v1';

export const ADMIN_CORRECT_PIN = '120123';

export type RepeatMode = 'all' | 'one' | 'off';

export interface BookingContactInfo {
  title: string;
  phone: string;
  email: string;
  line: string;
}

export type BandInfoType = typeof DEFAULT_BAND_INFO;
export type AlbumInfoType = typeof DEFAULT_ALBUM_INFO;

const DEFAULT_BOOKING_CONTACT: BookingContactInfo = {
  title: 'ติดต่องานแสดง & สปอนเซอร์',
  phone: DEFAULT_BAND_INFO.bookingContact.phone,
  email: DEFAULT_BAND_INFO.bookingContact.email,
  line: DEFAULT_BAND_INFO.bookingContact.line,
};

interface SongContextType {
  songs: Song[];
  setAllSongs: (newSongs: Song[]) => void;
  setBlankSongs: () => void;
  clearAllSongs: () => void;
  importSongsFromJson: (jsonStr: string) => boolean;

  isAdmin: boolean;
  adminPinError: string | null;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  addSong: (newSongData: Omit<Song, 'id' | 'trackNumber'>) => Song;
  editSong: (songId: string, updatedData: Partial<Song>) => void;
  deleteSong: (songId: string) => boolean;
  resetSongs: () => void;

  // Band Info & Members & Album customization
  bandInfo: BandInfoType;
  updateBandInfo: (data: Partial<BandInfoType>) => void;
  resetBandInfo: () => void;
  
  albumInfo: AlbumInfoType;
  updateAlbumInfo: (data: Partial<AlbumInfoType>) => void;
  resetAlbumInfo: () => void;

  members: BandMember[];
  updateMember: (memberId: string, data: Partial<BandMember>) => void;
  resetMembers: () => void;

  // Template Management (Save / Load / Export / Import / Blank)
  isTemplateModalOpen: boolean;
  openTemplateModal: () => void;
  closeTemplateModal: () => void;
  savedTemplates: SavedTemplateMeta[];
  saveCurrentAsTemplate: (name: string, description: string, currentImages: BandImageMap, slideshowItems?: SlideshowItem[]) => SavedTemplateMeta;
  deleteSavedTemplate: (templateId: string) => void;
  loadTemplate: (templateData: BandTemplateData, updateImagesCallback?: (imgs: BandImageMap) => void, updateSlideshowCallback?: (items: SlideshowItem[]) => void) => void;
  applyBlankDesignTemplate: (updateImagesCallback?: (imgs: BandImageMap) => void) => void;
  resetToDefaultTemplate: (updateImagesCallback?: (imgs: BandImageMap) => void) => void;
  exportTemplateAsJsonFile: (templateData: BandTemplateData) => void;

  // Booking contact management
  bookingContact: BookingContactInfo;
  updateBookingContact: (updated: Partial<BookingContactInfo>) => void;
  resetBookingContact: () => void;
  
  // Modals management
  isAdminModalOpen: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  
  isSongEditorOpen: boolean;
  editingSong: Song | null;
  openSongEditor: (songToEdit?: Song) => void;
  closeSongEditor: () => void;

  // Audio Playback & Loop / Continuous State
  currentTrackId: string;
  setCurrentTrackId: (id: string) => void;
  isPlaying: boolean;
  isUsingRealAudio: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  frequencies: number[];

  // Audio Playback Actions
  playTrack: (songId?: string) => void;
  pauseTrack: () => void;
  togglePlayPause: (songId?: string) => void;
  playNext: () => void;
  playPrev: () => void;
  toggleRepeatMode: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(SONGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved songs:', e);
    }
    return DEFAULT_SONGS;
  });

  const [bandInfo, setBandInfo] = useState<BandInfoType>(() => {
    try {
      const saved = localStorage.getItem(BAND_INFO_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_BAND_INFO, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_BAND_INFO;
  });

  const [albumInfo, setAlbumInfo] = useState<AlbumInfoType>(() => {
    try {
      const saved = localStorage.getItem(ALBUM_INFO_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_ALBUM_INFO, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_ALBUM_INFO;
  });

  const [members, setMembers] = useState<BandMember[]>(() => {
    try {
      const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_MEMBERS;
  });

  const [savedTemplates, setSavedTemplates] = useState<SavedTemplateMeta[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_TEMPLATES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [bookingContact, setBookingContact] = useState<BookingContactInfo>(() => {
    try {
      const saved = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_BOOKING_CONTACT, ...parsed };
        }
      }
    } catch (e) {
      console.error('Failed to parse saved booking contact:', e);
    }
    return DEFAULT_BOOKING_CONTACT;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSongEditorOpen, setIsSongEditorOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  // Audio Player State
  const [currentTrackId, setCurrentTrackId] = useState<string>(() => songs[0]?.id || 'song-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUsingRealAudio, setIsUsingRealAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(268);
  const [volume, setVolumeState] = useState(0.8);
  const [frequencies, setFrequencies] = useState<number[]>(Array(16).fill(12));

  // Loop & Continuous Playback Modes
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>(() => {
    try {
      const saved = localStorage.getItem(REPEAT_STORAGE_KEY) as RepeatMode;
      if (saved === 'all' || saved === 'one' || saved === 'off') {
        return saved;
      }
    } catch {}
    return 'all';
  });

  const [isShuffle, setIsShuffle] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SHUFFLE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // State refs for async audio loops
  const songsRef = useRef(songs);
  songsRef.current = songs;

  const currentTrackIdRef = useRef(currentTrackId);
  currentTrackIdRef.current = currentTrackId;

  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  const isShuffleRef = useRef(isShuffle);
  isShuffleRef.current = isShuffle;

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem(SONGS_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.error('Failed to save songs to localStorage:', e);
    }
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem(BAND_INFO_STORAGE_KEY, JSON.stringify(bandInfo));
    } catch {}
  }, [bandInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(ALBUM_INFO_STORAGE_KEY, JSON.stringify(albumInfo));
    } catch {}
  }, [albumInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
    } catch {}
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_TEMPLATES_STORAGE_KEY, JSON.stringify(savedTemplates));
    } catch {}
  }, [savedTemplates]);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingContact));
    } catch {}
  }, [bookingContact]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdmin));
    } catch {}
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(REPEAT_STORAGE_KEY, repeatMode);
    } catch {}
  }, [repeatMode]);

  useEffect(() => {
    try {
      localStorage.setItem(SHUFFLE_STORAGE_KEY, String(isShuffle));
    } catch {}
  }, [isShuffle]);

  // Audio Engine visualizer and state sync
  useEffect(() => {
    const unsubscribe = audioSynth.subscribe(() => {
      const state = audioSynth.getState();
      setIsPlaying(state.isPlaying);
      setIsUsingRealAudio(Boolean(state.isUsingRealAudio));
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
      setVolumeState(state.volume);
    });

    const animTimer = setInterval(() => {
      if (audioSynth.getState().isPlaying) {
        setFrequencies(audioSynth.getFrequencyData());
      } else {
        setFrequencies(Array(16).fill(10));
      }
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(animTimer);
    };
  }, []);

  const playTrackById = (songId: string) => {
    const list = songsRef.current;
    if (list.length === 0) return;
    const target = list.find(s => s.id === songId) || list[0];
    if (!target) return;

    setCurrentTrackId(target.id);
    currentTrackIdRef.current = target.id;
    audioSynth.playTrack(
      target.id,
      target.durationSeconds,
      target.audioParams?.rootNote || 57,
      target.audioParams?.bpm || 118,
      target.audioParams?.style || 'melancholic_rock',
      target.audioUrl,
      target.trackNumber
    );
  };

  useEffect(() => {
    const handleTrackEnded = () => {
      const list = songsRef.current;
      if (list.length === 0) return;

      const mode = repeatModeRef.current;
      const shuffle = isShuffleRef.current;
      const currentId = currentTrackIdRef.current;
      const currentIdx = list.findIndex(s => s.id === currentId);

      if (mode === 'one') {
        const currentSong = currentIdx >= 0 ? list[currentIdx] : list[0];
        audioSynth.seek(0);
        playTrackById(currentSong.id);
        return;
      }

      if (shuffle && list.length > 1) {
        const otherIndices = list.map((_, i) => i).filter(i => i !== currentIdx);
        const randomIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
        playTrackById(list[randomIdx].id);
        return;
      }

      const nextIdx = currentIdx + 1;
      if (nextIdx < list.length) {
        playTrackById(list[nextIdx].id);
      } else {
        if (mode === 'all') {
          playTrackById(list[0].id);
        } else {
          audioSynth.pause();
          audioSynth.seek(0);
        }
      }
    };

    audioSynth.setOnEndedCallback(handleTrackEnded);
    return () => {
      audioSynth.setOnEndedCallback(null);
    };
  }, []);

  const playTrack = (songId?: string) => {
    const targetId = songId || currentTrackIdRef.current;
    playTrackById(targetId);
  };

  const pauseTrack = () => {
    audioSynth.pause();
  };

  const togglePlayPause = (songId?: string) => {
    const list = songsRef.current;
    if (list.length === 0) return;
    const targetId = songId || currentTrackIdRef.current;
    const target = list.find(s => s.id === targetId) || list[0];
    if (!target) return;

    if (isPlaying && currentTrackIdRef.current === target.id) {
      audioSynth.pause();
    } else {
      playTrackById(target.id);
    }
  };

  const playNext = () => {
    const list = songsRef.current;
    if (list.length === 0) return;
    const currentId = currentTrackIdRef.current;
    const currentIdx = list.findIndex(s => s.id === currentId);
    if (isShuffleRef.current && list.length > 1) {
      const otherIndices = list.map((_, i) => i).filter(i => i !== currentIdx);
      const randomIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
      playTrackById(list[randomIdx].id);
    } else {
      const nextIdx = (currentIdx + 1) % list.length;
      playTrackById(list[nextIdx].id);
    }
  };

  const playPrev = () => {
    const list = songsRef.current;
    if (list.length === 0) return;
    const state = audioSynth.getState();
    if (state.currentTime > 3) {
      audioSynth.seek(0);
      return;
    }
    const currentId = currentTrackIdRef.current;
    const currentIdx = list.findIndex(s => s.id === currentId);
    const prevIdx = (currentIdx - 1 + list.length) % list.length;
    playTrackById(list[prevIdx].id);
  };

  const toggleRepeatMode = () => {
    setRepeatModeState(prev => {
      if (prev === 'all') return 'one';
      if (prev === 'one') return 'off';
      return 'all';
    });
  };

  const setRepeatMode = (mode: RepeatMode) => {
    setRepeatModeState(mode);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const seek = (seconds: number) => {
    audioSynth.seek(seconds);
  };

  const setVolume = (vol: number) => {
    audioSynth.setVolume(vol);
  };

  const updateBookingContact = (updated: Partial<BookingContactInfo>) => {
    setBookingContact(prev => ({ ...prev, ...updated }));
  };

  const resetBookingContact = () => {
    setBookingContact(DEFAULT_BOOKING_CONTACT);
    localStorage.removeItem(BOOKING_STORAGE_KEY);
  };

  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === ADMIN_CORRECT_PIN) {
      setIsAdmin(true);
      setAdminPinError(null);
      setIsAdminModalOpen(false);
      return true;
    } else {
      setAdminPinError('รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const addSong = (newSongData: Omit<Song, 'id' | 'trackNumber'>): Song => {
    const nextId = `song-custom-${Date.now()}`;
    const nextTrackNum = songs.length + 1;
    
    const newSong: Song = {
      ...newSongData,
      id: nextId,
      trackNumber: nextTrackNum,
    };

    setSongs(prev => [...prev, newSong]);
    if (songs.length === 0) {
      setCurrentTrackId(newSong.id);
    }
    return newSong;
  };

  const editSong = (songId: string, updatedData: Partial<Song>) => {
    setSongs(prev =>
      prev.map(song => (song.id === songId ? { ...song, ...updatedData } : song))
    );
  };

  const deleteSong = (songId: string): boolean => {
    setSongs(prev => {
      const filtered = prev.filter(s => s.id !== songId);
      return filtered.map((song, idx) => ({ ...song, trackNumber: idx + 1 }));
    });
    return true;
  };

  const setAllSongs = (newSongs: Song[]) => {
    setSongs(newSongs.map((s, idx) => ({ ...s, trackNumber: idx + 1 })));
    if (newSongs.length > 0) {
      setCurrentTrackId(newSongs[0].id);
    }
  };

  const setBlankSongs = () => {
    setAllSongs(BLANK_STARTER_SONGS);
  };

  const clearAllSongs = () => {
    setSongs([]);
    audioSynth.pause();
  };

  const importSongsFromJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      let list: Song[] = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && Array.isArray(parsed.songs)) {
        list = parsed.songs;
      }
      if (list.length > 0) {
        setAllSongs(list);
        return true;
      }
    } catch (e) {
      console.error('Failed to import songs from JSON:', e);
    }
    return false;
  };

  const resetSongs = () => {
    if (window.confirm('คุณต้องการรีเซ็ตรายชื่อเพลงและเนื้อเพลงกลับเป็นค่าเริ่มต้นทั้งหมดใช่หรือไม่?')) {
      setSongs(DEFAULT_SONGS);
      localStorage.removeItem(SONGS_STORAGE_KEY);
      if (DEFAULT_SONGS.length > 0) {
        setCurrentTrackId(DEFAULT_SONGS[0].id);
      }
    }
  };

  // Band / Album / Members updates
  const updateBandInfo = (data: Partial<BandInfoType>) => {
    setBandInfo(prev => ({ ...prev, ...data }));
  };

  const resetBandInfo = () => {
    setBandInfo(DEFAULT_BAND_INFO);
    localStorage.removeItem(BAND_INFO_STORAGE_KEY);
  };

  const updateAlbumInfo = (data: Partial<AlbumInfoType>) => {
    setAlbumInfo(prev => ({ ...prev, ...data }));
  };

  const resetAlbumInfo = () => {
    setAlbumInfo(DEFAULT_ALBUM_INFO);
    localStorage.removeItem(ALBUM_INFO_STORAGE_KEY);
  };

  const updateMember = (memberId: string, data: Partial<BandMember>) => {
    setMembers(prev => prev.map(m => (m.id === memberId ? { ...m, ...data } : m)));
  };

  const resetMembers = () => {
    setMembers(DEFAULT_MEMBERS);
    localStorage.removeItem(MEMBERS_STORAGE_KEY);
  };

  // Template Management Methods
  const saveCurrentAsTemplate = (
    name: string,
    description: string,
    currentImages: BandImageMap,
    slideshowItems?: SlideshowItem[]
  ): SavedTemplateMeta => {
    const templateId = `tpl-custom-${Date.now()}`;
    const newTemplateData: BandTemplateData = {
      version: '1.0',
      templateId,
      templateName: name.trim() || 'เทมเพลตที่บันทึกไว้',
      templateDescription: description.trim() || `บันทึกเมื่อ ${new Date().toLocaleDateString('th-TH')}`,
      createdAt: new Date().toISOString(),
      bandInfo,
      albumInfo,
      members,
      images: currentImages,
      slideshowList: slideshowItems,
      songs,
    };

    const newMeta: SavedTemplateMeta = {
      id: templateId,
      name: newTemplateData.templateName,
      description: newTemplateData.templateDescription,
      savedAt: new Date().toLocaleString('th-TH'),
      songCount: songs.length,
      hasCustomImages: true,
      data: newTemplateData,
    };

    setSavedTemplates(prev => [newMeta, ...prev]);
    return newMeta;
  };

  const deleteSavedTemplate = (templateId: string) => {
    setSavedTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const loadTemplate = (
    templateData: BandTemplateData,
    updateImagesCallback?: (imgs: BandImageMap) => void,
    updateSlideshowCallback?: (items: SlideshowItem[]) => void
  ) => {
    if (templateData.songs) {
      setAllSongs(templateData.songs);
    }
    if (templateData.bandInfo) {
      setBandInfo(prev => ({ ...prev, ...templateData.bandInfo }));
    }
    if (templateData.albumInfo) {
      setAlbumInfo(prev => ({ ...prev, ...templateData.albumInfo }));
    }
    if (templateData.members) {
      setMembers(templateData.members);
    }
    if (templateData.images && updateImagesCallback) {
      updateImagesCallback(templateData.images);
    }
    if (templateData.slideshowList && updateSlideshowCallback) {
      updateSlideshowCallback(templateData.slideshowList);
    }
  };

  const applyBlankDesignTemplate = (updateImagesCallback?: (imgs: BandImageMap) => void) => {
    setAllSongs(BLANK_STARTER_SONGS);
    setBandInfo(BLANK_BAND_INFO as any);
    setAlbumInfo(BLANK_ALBUM_INFO as any);
    setMembers(BLANK_MEMBERS);
    if (updateImagesCallback) {
      updateImagesCallback(BLANK_PLACEHOLDER_IMAGES);
    }
  };

  const resetToDefaultTemplate = (updateImagesCallback?: (imgs: BandImageMap) => void) => {
    setSongs(DEFAULT_SONGS);
    setBandInfo(DEFAULT_BAND_INFO);
    setAlbumInfo(DEFAULT_ALBUM_INFO);
    setMembers(DEFAULT_MEMBERS);
    if (DEFAULT_SONGS.length > 0) {
      setCurrentTrackId(DEFAULT_SONGS[0].id);
    }
    if (updateImagesCallback) {
      updateImagesCallback(DEFAULT_IMAGES);
    }
    localStorage.removeItem(SONGS_STORAGE_KEY);
    localStorage.removeItem(BAND_INFO_STORAGE_KEY);
    localStorage.removeItem(ALBUM_INFO_STORAGE_KEY);
    localStorage.removeItem(MEMBERS_STORAGE_KEY);
  };

  const exportTemplateAsJsonFile = (templateData: BandTemplateData) => {
    const jsonStr = JSON.stringify(templateData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `${templateData.templateName.replace(/[^a-zA-Z0-9ก-๙_-]/g, '_')}_template.json`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openAdminModal = () => {
    setAdminPinError(null);
    setIsAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setAdminPinError(null);
  };

  const openSongEditor = (songToEdit?: Song) => {
    if (!isAdmin) {
      setAdminPinError('🔒 ฟังก์ชันเพิ่มและแก้ไขเพลง สงวนสิทธิ์สำหรับ Admin เท่านั้น');
      setIsAdminModalOpen(true);
      return;
    }
    setEditingSong(songToEdit || null);
    setIsSongEditorOpen(true);
  };

  const closeSongEditor = () => {
    setIsSongEditorOpen(false);
    setEditingSong(null);
  };

  const openTemplateModal = () => {
    if (!isAdmin) {
      setAdminPinError('🔒 ฟังก์ชันจัดการเทมเพลตและโหมดออกแบบ สงวนสิทธิ์สำหรับ Admin เท่านั้น');
      setIsAdminModalOpen(true);
      return;
    }
    setIsTemplateModalOpen(true);
  };

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  return (
    <SongContext.Provider
      value={{
        songs,
        setAllSongs,
        setBlankSongs,
        clearAllSongs,
        importSongsFromJson,

        isAdmin,
        adminPinError,
        loginAdmin,
        logoutAdmin,
        addSong,
        editSong,
        deleteSong,
        resetSongs,

        bandInfo,
        updateBandInfo,
        resetBandInfo,
        albumInfo,
        updateAlbumInfo,
        resetAlbumInfo,
        members,
        updateMember,
        resetMembers,

        isTemplateModalOpen,
        openTemplateModal,
        closeTemplateModal,
        savedTemplates,
        saveCurrentAsTemplate,
        deleteSavedTemplate,
        loadTemplate,
        applyBlankDesignTemplate,
        resetToDefaultTemplate,
        exportTemplateAsJsonFile,

        bookingContact,
        updateBookingContact,
        resetBookingContact,
        isAdminModalOpen,
        openAdminModal,
        closeAdminModal,
        isSongEditorOpen,
        editingSong,
        openSongEditor,
        closeSongEditor,

        // Playback state & controls
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
        pauseTrack,
        togglePlayPause,
        playNext,
        playPrev,
        toggleRepeatMode,
        setRepeatMode,
        toggleShuffle,
        seek,
        setVolume,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSongs must be used within a SongProvider');
  }
  return context;
};
