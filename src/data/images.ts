// TRIPLETS Band Asset Mapping & Static Public Image Paths
import { BLANK_PLACEHOLDER_IMAGES } from '../utils/placeholderImages';

export const IMAGES = {
  bandLogo: '/images/band_logo.png',
  heroBanner: '/images/hero_banner.jpg',
  albumCover: '/images/album_cover.jpg',
  winPortrait: '/images/win.jpg',
  nightPortrait: '/images/win.jpg',
  tenPortrait: '/images/ten.jpg',
  tigerPortrait: '/images/tiger.jpg',
  monaPortrait: '/images/mona.jpg',
  bandSilhouette: '/images/hero_banner.jpg',
  
  // Gallery fallbacks
  gallery: [
    {
      id: "g1",
      title: "Live Concert Stage Highlight",
      category: "Concert",
      url: "/images/hero_banner.jpg",
      caption: "ภาพบรรยากาศการแสดงสดของวง TRIPLETS"
    },
    {
      id: "g2",
      title: "Studio Recording Session",
      category: "Behind The Scenes",
      url: "/images/album_cover.jpg",
      caption: "ภาพเบื้องหลังการทำงานในห้องอัดอัลบั้ม 'หากวันนั้น...'"
    },
    {
      id: "g3",
      title: "Band Jam Session",
      category: "Studio",
      url: "/images/win.jpg",
      caption: "ภาพการซ้อมดนตรีและเตรียมความพร้อมก่อนขึ้นเวที"
    }
  ]
};

