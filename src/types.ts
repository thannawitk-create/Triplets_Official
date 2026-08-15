// TRIPLETS Band Data Types

export type MemberRole = 'Lead Vocal' | 'Bass' | 'Drums' | 'Guest Vocal';

export interface BandMember {
  id: string;
  nameThai: string;
  nameEng: string;
  role: MemberRole;
  roleDescription: string;
  quote: string;
  bio: string;
  signatureGear: string[];
  favoriteGenre: string;
  image: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  keyTracks: string[];
}

export interface Song {
  id: string;
  trackNumber: number;
  titleThai: string;
  titleEng: string;
  duration: string; // e.g. "4:28"
  durationSeconds: number;
  featuredArtist?: string;
  story: string;
  lyrics: string[];
  chords?: string;
  audioUrl?: string; // MP3/WAV file URL or idb:// pointer
  audioParams: {
    bpm: number;
    key: string;
    style: 'melancholic_rock' | 'heavy_groove' | 'ballad' | 'energetic_alt';
    rootNote: number; // MIDI note e.g. 60 for C4, 57 for A3
  };
}

export interface LiveShow {
  id: string;
  date: string; // e.g. "15 ส.ค. 2026"
  isoDate: string; // YYYY-MM-DD
  time: string; // "20:00 น."
  title: string;
  venue: string;
  district: string;
  province: string;
  type: 'Concert & Festival' | 'Pub & Live House' | 'Fan Meeting' | 'TV & Media';
  status: 'Selling Fast' | 'Sold Out' | 'Free Entry' | 'Available';
  ticketPrice: string; // e.g. "800 - 1,500 บาท" or "เข้าชมฟรี"
  bookingUrl?: string;
  tableReservationPhone?: string;
  lineId?: string;
  locationMapUrl: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'อัลบั้มใหม่' | 'ตารางแสดง' | 'สินค้าวง' | 'กิจกรรมแฟนคลับ' | 'สัมภาษณ์';
  date: string;
  summary: string;
  content: string[];
  image: string;
  featured?: boolean;
  likesCount: number;
  commentsCount: number;
}

export interface FanMessage {
  id: string;
  fanName: string;
  memberTag: 'ALL' | 'WIN' | 'Ten' | 'Tiger' | 'Mona';
  favoriteSong: string;
  message: string;
  timestamp: string;
  likes: number;
  verifiedFan?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  url: string;
  caption: string;
}

export interface TicketBookingRequest {
  showId: string;
  showTitle: string;
  showDate: string;
  venue: string;
  customerName: string;
  phone: string;
  email: string;
  ticketCount: number;
  ticketType: string;
  notes?: string;
  paymentMethod: 'PromptPay' | 'CreditCard' | 'BankTransfer';
}

export interface BandTemplateData {
  version: string;
  templateId: string;
  templateName: string;
  templateDescription: string;
  createdAt: string;
  bandInfo?: {
    name: string;
    taglineEng: string;
    taglineThai: string;
    genre: string;
    bio: string;
  };
  albumInfo?: {
    titleThai: string;
    titleEng: string;
    releaseYear: string;
    conceptQuote: string;
    description: string;
  };
  members?: BandMember[];
  images: {
    bandLogo: string;
    win: string;
    ten: string;
    tiger: string;
    mona: string;
    heroBanner: string;
    albumCover: string;
    bandSilhouette: string;
  };
  slideshowList?: {
    id: string;
    title: string;
    subtitle: string;
    url: string;
  }[];
  songs: Song[];
}

export interface SavedTemplateMeta {
  id: string;
  name: string;
  description: string;
  savedAt: string;
  songCount: number;
  hasCustomImages: boolean;
  data: BandTemplateData;
}
