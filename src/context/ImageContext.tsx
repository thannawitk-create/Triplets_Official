import React, { createContext, useContext, useState, useEffect } from 'react';
import { IMAGES } from '../data/images';
import { compressImageDataUrl } from '../utils/imageCompressor';
import { BLANK_PLACEHOLDER_IMAGES, isPlaceholderImage } from '../utils/placeholderImages';

export interface BandImageMap {
  bandLogo: string;
  win: string;
  ten: string;
  tiger: string;
  mona: string;
  heroBanner: string;
  albumCover: string;
  bandSilhouette: string;
}

export interface SlideshowItem {
  id: string;
  key?: keyof BandImageMap;
  title: string;
  subtitle: string;
  url: string;
  isCustom?: boolean;
}

export const DEFAULT_IMAGES: BandImageMap = {
  bandLogo: IMAGES.bandLogo,
  win: IMAGES.winPortrait,
  ten: IMAGES.tenPortrait,
  tiger: IMAGES.tigerPortrait,
  mona: IMAGES.monaPortrait,
  heroBanner: IMAGES.heroBanner,
  albumCover: IMAGES.albumCover,
  bandSilhouette: IMAGES.bandSilhouette,
};

const STORAGE_KEY = 'triplets_custom_band_images';
const CUSTOM_SLIDES_STORAGE_KEY = 'triplets_custom_slideshow_items';
const HIDDEN_SLIDES_STORAGE_KEY = 'triplets_hidden_slideshow_ids';

interface ImageContextType {
  images: BandImageMap;
  updateImage: (key: keyof BandImageMap, url: string) => Promise<void>;
  setAllImages: (newImages: BandImageMap) => void;
  setBlankImages: () => void;
  isPlaceholderImage: (url: string | undefined) => boolean;
  resetImage: (key: keyof BandImageMap) => void;
  resetAllImages: () => void;
  isImageEditorOpen: boolean;
  openImageEditor: (targetKey?: keyof BandImageMap) => void;
  closeImageEditor: () => void;
  activeEditingTarget: keyof BandImageMap;
  setActiveEditingTarget: (key: keyof BandImageMap) => void;

  // Slideshow management
  slideshowList: SlideshowItem[];
  addCustomSlide: (title: string, subtitle: string, url: string) => Promise<void>;
  deleteSlide: (id: string) => void;
  setSlideshowItems: (items: SlideshowItem[]) => void;
  resetSlideshowList: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const PRESET_LIBRARY: Record<keyof BandImageMap, { id: string; name: string; url: string }[]> = {
  bandLogo: [
    { id: 'logo-1', name: 'โลโก้ TRIPLETS เมทัลลิก 3D สีเงิน-แดง (Official)', url: IMAGES.bandLogo }
  ],
  win: [
    { id: 'win-1', name: 'วิน - โชว์เวทีไฟส้ม (Original)', url: IMAGES.winPortrait },
    { id: 'win-2', name: 'วิน - ร้องไมค์สดเวทีร็อก', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80' },
    { id: 'win-3', name: 'วิน - ร็อกสไตล์พังก์แจ็กเก็ตหนัง', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80' },
    { id: 'win-4', name: 'วิน - อะคูสติกเซสชันในสตูดิโอ', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' }
  ],
  mona: [
    { id: 'mona-1', name: 'โมนา - นักร้องสาวรับเชิญ (Original)', url: IMAGES.monaPortrait },
    { id: 'mona-2', name: 'โมนา - ไมค์วินเทจคลาสสิก', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80' },
    { id: 'mona-3', name: 'โมนา - ร้องสดเวทีแสงไฟนีออน', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' }
  ],
  ten: [
    { id: 'ten-1', name: 'เท็น - มือเบสเบสไฟฟ้า (Original)', url: IMAGES.tenPortrait },
    { id: 'ten-2', name: 'เท็น - โซโล่เบสบนเวทีสด', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },
    { id: 'ten-3', name: 'เท็น - สตูดิโอแจมมิ่ง', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80' }
  ],
  tiger: [
    { id: 'tiger-1', name: 'ไทเกอร์ - มือกลองพลังร็อก (Original)', url: IMAGES.tigerPortrait },
    { id: 'tiger-2', name: 'ไทเกอร์ - หวดกลองคอนเสิร์ตใหญ่', url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80' },
    { id: 'tiger-3', name: 'ไทเกอร์ - ซ้อมกลองสตูดิโอ', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80' }
  ],
  heroBanner: [
    { id: 'hb-1', name: 'เวทีคอนเสิร์ตใหญ่ TRIPLETS (Original)', url: IMAGES.heroBanner },
    { id: 'hb-2', name: 'บรรยากาศไฟเวทีสเตจและสปอตไลต์', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
    { id: 'hb-3', name: 'ทะเลคลื่นแฟนเพลง Thunder Dome', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80' }
  ],
  albumCover: [
    { id: 'ac-1', name: 'ปกอัลบั้ม "หากวันนั้น..." (Original)', url: IMAGES.albumCover },
    { id: 'ac-2', name: 'ปกภาพวิวเมืองริมทะเลมู้ดดี้', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80' },
    { id: 'ac-3', name: 'ปกโทนขาวดำอารมณ์ลึกซึ้ง', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80' }
  ],
  bandSilhouette: [
    { id: 'bs-1', name: 'รูปเงาสมาชิก 3 คนริมน้ำ (Original)', url: IMAGES.bandSilhouette },
    { id: 'bs-2', name: 'รูปเงาเวทีใหญ่คอนเสิร์ต', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80' }
  ]
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<BandImageMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned: Partial<BandImageMap> = {};
        for (const key in parsed) {
          const val = parsed[key as keyof BandImageMap];
          // Replace stale /src/ paths or old broken unsplash URLs with default imported asset URL
          if (typeof val === 'string' && (val.startsWith('/src/') || val.includes('unsplash.com') || !val.trim())) {
            cleaned[key as keyof BandImageMap] = DEFAULT_IMAGES[key as keyof BandImageMap];
          } else if (val) {
            cleaned[key as keyof BandImageMap] = val;
          }
        }
        return { ...DEFAULT_IMAGES, ...cleaned };
      }
    } catch {
      // Ignored
    }
    return DEFAULT_IMAGES;
  });

  const [customSlides, setCustomSlides] = useState<SlideshowItem[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SLIDES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignored
    }
    return [];
  });

  const [hiddenSlideIds, setHiddenSlideIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HIDDEN_SLIDES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignored
    }
    return [];
  });

  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [activeEditingTarget, setActiveEditingTarget] = useState<keyof BandImageMap>('win');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [images]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_SLIDES_STORAGE_KEY, JSON.stringify(customSlides));
    } catch (e) {
      console.warn('LocalStorage custom slides save warning:', e);
    }
  }, [customSlides]);

  useEffect(() => {
    try {
      localStorage.setItem(HIDDEN_SLIDES_STORAGE_KEY, JSON.stringify(hiddenSlideIds));
    } catch (e) {
      console.warn('LocalStorage hidden slides save warning:', e);
    }
  }, [hiddenSlideIds]);

  const updateImage = async (key: keyof BandImageMap, url: string) => {
    let compressedUrl = url;
    if (url && url.startsWith('data:image/')) {
      compressedUrl = await compressImageDataUrl(url, 900, 900, 0.75);
    }
    setImages(prev => ({ ...prev, [key]: compressedUrl }));
  };

  const setAllImages = (newImages: BandImageMap) => {
    setImages(newImages);
  };

  const setBlankImages = () => {
    setImages(BLANK_PLACEHOLDER_IMAGES);
    setCustomSlides([]);
    setHiddenSlideIds([]);
  };

  const resetImage = (key: keyof BandImageMap) => {
    setImages(prev => ({ ...prev, [key]: DEFAULT_IMAGES[key] }));
  };

  const resetAllImages = () => {
    setImages(DEFAULT_IMAGES);
    setCustomSlides([]);
    setHiddenSlideIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CUSTOM_SLIDES_STORAGE_KEY);
      localStorage.removeItem(HIDDEN_SLIDES_STORAGE_KEY);
    } catch {
      // Ignored
    }
  };

  // Base default slides constructed dynamically from images
  const defaultSlides: SlideshowItem[] = [
    { id: 'slide-albumCover', key: 'albumCover', title: 'หากวันนั้น...', subtitle: 'ปกอัลบั้ม Official Artwork', url: images.albumCover },
    { id: 'slide-heroBanner', key: 'heroBanner', title: 'TRIPLETS Live Stage', subtitle: 'บรรยากาศเวทีคอนเสิร์ตใหญ่', url: images.heroBanner },
    { id: 'slide-bandSilhouette', key: 'bandSilhouette', title: '3 สมาชิกวง TRIPLETS', subtitle: 'วิน • เท็น • ไทเกอร์', url: images.bandSilhouette },
    { id: 'slide-win', key: 'win', title: 'วิน (WIN)', subtitle: 'นักร้องนำ (Lead Vocalist)', url: images.win },
    { id: 'slide-ten', key: 'ten', title: 'เท็น (TEN)', subtitle: 'มือเบส (Bassist)', url: images.ten },
    { id: 'slide-tiger', key: 'tiger', title: 'ไทเกอร์ (TIGER)', subtitle: 'มือกลอง (Drummer)', url: images.tiger },
    { id: 'slide-mona', key: 'mona', title: 'โมนา (MONA)', subtitle: 'นักร้องรับเชิญ (Guest Vocalist)', url: images.mona },
  ];

  // Combined active slideshow list (Default slides - hidden slides + custom slides)
  const slideshowList = [
    ...defaultSlides.filter(s => !hiddenSlideIds.includes(s.id)),
    ...customSlides,
  ];

  const setSlideshowItems = (items: SlideshowItem[]) => {
    setCustomSlides(items);
    setHiddenSlideIds([]);
  };

  const addCustomSlide = async (title: string, subtitle: string, url: string) => {
    let compressedUrl = url;
    if (url && url.startsWith('data:image/')) {
      compressedUrl = await compressImageDataUrl(url, 900, 900, 0.75);
    }
    const newSlide: SlideshowItem = {
      id: `custom-slide-${Date.now()}`,
      title: title.trim() || 'รูปสไลด์โชว์เพิ่มเติม',
      subtitle: subtitle.trim() || 'วง TRIPLETS Gallery',
      url: compressedUrl,
      isCustom: true,
    };
    setCustomSlides(prev => [...prev, newSlide]);
  };

  const deleteSlide = (id: string) => {
    // If custom slide, filter out from customSlides
    setCustomSlides(prev => prev.filter(s => s.id !== id));
    // If default slide, add to hiddenSlideIds
    setHiddenSlideIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const resetSlideshowList = () => {
    setCustomSlides([]);
    setHiddenSlideIds([]);
    try {
      localStorage.removeItem(CUSTOM_SLIDES_STORAGE_KEY);
      localStorage.removeItem(HIDDEN_SLIDES_STORAGE_KEY);
    } catch {
      // Ignored
    }
  };

  const openImageEditor = (targetKey?: keyof BandImageMap) => {
    if (targetKey) {
      setActiveEditingTarget(targetKey);
    }
    setIsImageEditorOpen(true);
  };

  const closeImageEditor = () => {
    setIsImageEditorOpen(false);
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        updateImage,
        setAllImages,
        setBlankImages,
        isPlaceholderImage,
        resetImage,
        resetAllImages,
        isImageEditorOpen,
        openImageEditor,
        closeImageEditor,
        activeEditingTarget,
        setActiveEditingTarget,

        slideshowList,
        addCustomSlide,
        deleteSlide,
        setSlideshowItems,
        resetSlideshowList,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useBandImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useBandImages must be used within an ImageProvider');
  }
  return context;
};

