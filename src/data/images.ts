// TRIPLETS Band Asset Mapping & Default Blank Placeholders
import { BLANK_PLACEHOLDER_IMAGES } from '../utils/placeholderImages';

export const IMAGES = {
  bandLogo: BLANK_PLACEHOLDER_IMAGES.bandLogo,
  heroBanner: BLANK_PLACEHOLDER_IMAGES.heroBanner,
  albumCover: BLANK_PLACEHOLDER_IMAGES.albumCover,
  winPortrait: BLANK_PLACEHOLDER_IMAGES.win,
  nightPortrait: BLANK_PLACEHOLDER_IMAGES.win,
  tenPortrait: BLANK_PLACEHOLDER_IMAGES.ten,
  tigerPortrait: BLANK_PLACEHOLDER_IMAGES.tiger,
  monaPortrait: BLANK_PLACEHOLDER_IMAGES.mona,
  bandSilhouette: BLANK_PLACEHOLDER_IMAGES.bandSilhouette,
  
  // Gallery fallbacks
  gallery: [
    {
      id: "g1",
      title: "Live Concert Stage Highlight",
      category: "Concert",
      url: BLANK_PLACEHOLDER_IMAGES.heroBanner,
      caption: "พื้นที่สำหรับภาพบรรยากาศการแสดงสด (คลิกเพื่อแก้ไข/อัปโหลด)"
    },
    {
      id: "g2",
      title: "Studio Recording Session",
      category: "Behind The Scenes",
      url: BLANK_PLACEHOLDER_IMAGES.albumCover,
      caption: "พื้นที่สำหรับภาพเบื้องหลังการทำงานในห้องอัด"
    },
    {
      id: "g3",
      title: "Band Jam Session",
      category: "Studio",
      url: BLANK_PLACEHOLDER_IMAGES.win,
      caption: "พื้นที่สำหรับภาพการซ้อมดนตรี"
    }
  ]
};
