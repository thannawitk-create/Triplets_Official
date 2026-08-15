import { BandTemplateData, Song, BandMember } from '../types';
import { SONGS, BAND_INFO, ALBUM_INFO, MEMBERS } from './bandData';
import { IMAGES } from './images';
import { BLANK_PLACEHOLDER_IMAGES } from '../utils/placeholderImages';

export const BLANK_STARTER_SONGS: Song[] = [
  {
    id: 'song-slot-1',
    trackNumber: 1,
    titleThai: 'บทเพลงที่ 1 (รอระบุชื่อเพลง)',
    titleEng: 'Track 01 (Your Song Title)',
    duration: '3:45',
    durationSeconds: 225,
    story: 'พิมพ์เรื่องราวและแรงบันดาลใจเบื้องหลังบทเพลงของคุณที่นี่...',
    lyrics: [
      '(Verse 1)',
      'พิมพ์เนื้อเพลงท่อนที่ 1 ของคุณ...',
      'เรื่องราวที่อยากบอกผ่านเสียงดนตรี...',
      '',
      '(Chorus)',
      'พิมพ์เนื้อเพลงท่อนฮุกที่นี่...',
      'ความรู้สึกที่ส่งตรงถึงผู้ฟัง...',
      '',
      '(Outro)',
      'ท่อนจบของบทเพลง...'
    ],
    chords: 'Intro: Am | F | C | G\nVerse: Am | F | C | G\nChorus: F | G | Em | Am',
    audioParams: {
      bpm: 118,
      key: 'A Minor',
      style: 'melancholic_rock',
      rootNote: 57
    }
  },
  {
    id: 'song-slot-2',
    trackNumber: 2,
    titleThai: 'บทเพลงที่ 2 (รอระบุชื่อเพลง)',
    titleEng: 'Track 02 (Your Song Title)',
    duration: '4:10',
    durationSeconds: 250,
    story: 'พิมพ์เรื่องราวของเพลงที่ 2 หรืออัปโหลดไฟล์เสียง MP3 เข้ามาแทนที่...',
    lyrics: [
      '(Verse 1)',
      'พิมพ์เนื้อเพลงท่อนที่ 1...',
      '',
      '(Chorus)',
      'พิมพ์เนื้อเพลงท่อนฮุก...'
    ],
    chords: 'Intro: C | G | Am | F\nChorus: C | G | Am | F',
    audioParams: {
      bpm: 110,
      key: 'C Major',
      style: 'ballad',
      rootNote: 60
    }
  }
];

export const BLANK_BAND_INFO = {
  name: 'YOUR BAND NAME',
  taglineEng: 'YOUR MUSIC • YOUR IDENTITY • YOUR STORY',
  taglineThai: 'ชื่อวงดนตรีของคุณ - อธิบายคอนเซปต์วงสั้นๆ ตรงนี้',
  genre: 'Indie Rock / Alternative / Pop',
  bio: 'เขียนประวัติ แนะนำสมาชิกวง และแรงบันดาลใจในการทำผลงานเพลงของคุณ เพื่อบอกเล่าเรื่องราวให้แฟนเพลงได้รู้จักที่นี่'
};

export const BLANK_ALBUM_INFO = {
  titleThai: 'ชื่ออัลบั้มของคุณ',
  titleEng: 'YOUR ALBUM TITLE',
  releaseYear: '2026',
  conceptQuote: 'คำคมหรือประโยคสื่อความหมายประจำอัลบั้มนี้',
  description: 'คำอธิบายอัลบั้ม สไตล์ดนตรี และความตั้งใจในการสร้างสรรค์ผลงานชุดนี้'
};

export const BLANK_MEMBERS: BandMember[] = [
  {
    id: 'win',
    nameThai: 'สมาชิก 1',
    nameEng: 'Member 1 (Vocal)',
    role: 'Lead Vocal',
    roleDescription: 'นักร้องนำ (Lead Vocalist)',
    quote: 'ประโยคประจำตัวของสมาชิกคนที่ 1',
    bio: 'ประวัติและข้อมูลแนะนำตัวสมาชิกคนที่ 1 เช่น ตำแหน่ง อุปกรณ์ที่ใช้ และความถนัด',
    signatureGear: ['Microphone', 'Guitar'],
    favoriteGenre: 'Rock, Alternative',
    image: BLANK_PLACEHOLDER_IMAGES.win,
    socials: { instagram: '@vocal_official' },
    keyTracks: ['บทเพลงที่ 1']
  },
  {
    id: 'ten',
    nameThai: 'สมาชิก 2',
    nameEng: 'Member 2 (Bass/Guitar)',
    role: 'Bass',
    roleDescription: 'มือเบส / กีตาร์ (Bassist / Guitarist)',
    quote: 'ประโยคประจำตัวของสมาชิกคนที่ 2',
    bio: 'ประวัติและข้อมูลแนะนำตัวสมาชิกคนที่ 2',
    signatureGear: ['Bass Guitar', 'Amp'],
    favoriteGenre: 'Rock, Post-Rock',
    image: BLANK_PLACEHOLDER_IMAGES.ten,
    socials: { instagram: '@bass_official' },
    keyTracks: ['บทเพลงที่ 1']
  },
  {
    id: 'tiger',
    nameThai: 'สมาชิก 3',
    nameEng: 'Member 3 (Drums)',
    role: 'Drums',
    roleDescription: 'มือกลอง (Drummer)',
    quote: 'ประโยคประจำตัวของสมาชิกคนที่ 3',
    bio: 'ประวัติและข้อมูลแนะนำตัวสมาชิกคนที่ 3',
    signatureGear: ['Drum Kit', 'Cymbals'],
    favoriteGenre: 'Rock, Hard Rock',
    image: BLANK_PLACEHOLDER_IMAGES.tiger,
    socials: { instagram: '@drums_official' },
    keyTracks: ['บทเพลงที่ 1']
  },
  {
    id: 'mona',
    nameThai: 'สมาชิก 4 / แขกรับเชิญ',
    nameEng: 'Member 4 / Guest',
    role: 'Guest Vocal',
    roleDescription: 'นักร้องรับเชิญ / คีย์บอร์ด / กีตาร์',
    quote: 'ประโยคประจำตัวของสมาชิกคนที่ 4',
    bio: 'ประวัติและข้อมูลแนะนำตัวสมาชิกคนที่ 4 หรือศิลปินรับเชิญพิเศษ',
    signatureGear: ['Keyboard', 'Mic'],
    favoriteGenre: 'Neo-Soul, Pop',
    image: BLANK_PLACEHOLDER_IMAGES.mona,
    socials: { instagram: '@guest_official' },
    keyTracks: ['บทเพลงที่ 2']
  }
];

export const PRESET_TEMPLATES: BandTemplateData[] = [
  {
    version: '1.0',
    templateId: 'tpl-original-triplets',
    templateName: 'TRIPLETS Band (Original Official)',
    templateDescription: 'เทมเพลตทางการต้นฉบับของวง TRIPLETS เพลงเต็ม 8 แทร็ก พร้อมรูปและข้อมูลครบถ้วน',
    createdAt: '2026-08-15',
    bandInfo: {
      name: BAND_INFO.name,
      taglineEng: BAND_INFO.taglineEng,
      taglineThai: BAND_INFO.taglineThai,
      genre: BAND_INFO.genre,
      bio: BAND_INFO.bio
    },
    albumInfo: {
      titleThai: ALBUM_INFO.titleThai,
      titleEng: ALBUM_INFO.titleEng,
      releaseYear: ALBUM_INFO.releaseYear,
      conceptQuote: ALBUM_INFO.conceptQuote,
      description: ALBUM_INFO.description
    },
    members: MEMBERS,
    images: {
      bandLogo: IMAGES.bandLogo,
      win: IMAGES.winPortrait,
      ten: IMAGES.tenPortrait,
      tiger: IMAGES.tigerPortrait,
      mona: IMAGES.monaPortrait,
      heroBanner: IMAGES.heroBanner,
      albumCover: IMAGES.albumCover,
      bandSilhouette: IMAGES.bandSilhouette,
    },
    songs: SONGS
  },
  {
    version: '1.0',
    templateId: 'tpl-blank-design',
    templateName: 'โครงร่างเปล่าสำหรับออกแบบ (Blank Design Starter)',
    templateDescription: 'เคลียร์เพลงและรูปภาพทั้งหมดเป็นค่าว่าง/กรอบ Placeholder เพื่อให้นำเข้าเพลง รูปภาพ และปรับแต่งวงใหม่ทั้งหมดได้อย่างง่ายดาย',
    createdAt: '2026-08-15',
    bandInfo: BLANK_BAND_INFO,
    albumInfo: BLANK_ALBUM_INFO,
    members: BLANK_MEMBERS,
    images: BLANK_PLACEHOLDER_IMAGES,
    songs: BLANK_STARTER_SONGS
  },
  {
    version: '1.0',
    templateId: 'tpl-indie-rock',
    templateName: 'Indie Rock Power Trio (เทมเพลตวงร็อก 3 ชิ้น)',
    templateDescription: 'เทมเพลตโครงสร้าง 3 ชิ้น กีตาร์ เบส กลอง พร้อมช่องใส่เพลงสไตล์อัลเทอร์เนทีฟ',
    createdAt: '2026-08-15',
    bandInfo: {
      name: 'THE REVELS',
      taglineEng: 'RAW ENERGY • MODERN SOUND',
      taglineThai: 'พลังดนตรีร็อกรุ่นใหม่ ไร้ขีดจำกัด',
      genre: 'Modern Alternative Rock',
      bio: 'วงร็อก 3 ชิ้นพลังงานล้นเหลือที่เน้นการเล่นสดอันดุดัน เมโลดี้หนักแน่น และความหมายเพลงที่สะท้อนสังคมคนรุ่นใหม่'
    },
    albumInfo: {
      titleThai: 'ปลดปล่อย',
      titleEng: 'UNLEASHED',
      releaseYear: '2026',
      conceptQuote: 'ไม่มีอะไรหยุดยั้งเสียงที่คุณอยากให้โลกได้ยิน',
      description: 'อัลบั้มรวมเพลงร็อกเร็ว หนักแน่น ริฟฟ์กีตาร์คมชัด เบสไลน์กระชับ และกลองเร้าใจ'
    },
    members: BLANK_MEMBERS.slice(0, 3),
    images: BLANK_PLACEHOLDER_IMAGES,
    songs: [
      {
        id: 'indie-song-1',
        trackNumber: 1,
        titleThai: 'เสียงในความเงียบ',
        titleEng: 'Voice in The Silence',
        duration: '3:30',
        durationSeconds: 210,
        story: 'เพลงเร็วเปิดอัลบั้มที่กระตุ้นให้ทุกคนกล้าลุกขึ้นมาพูดความจริง',
        lyrics: [
          '(Intro Riff)',
          'เมื่อโลกมันหมุนเร็วเกินกว่าจะตามทัน...',
          'เสียงตะโกนในใจยังดังก้องในความเงียบ!',
          '',
          '(Chorus)',
          'ลุกขึ้นมา ร้องมันออกไป!'
        ],
        chords: 'Intro: Em | C | G | D\nChorus: Em | C | G | D',
        audioParams: { bpm: 135, key: 'E Minor', style: 'energetic_alt', rootNote: 64 }
      },
      {
        id: 'indie-song-2',
        trackNumber: 2,
        titleThai: 'ทางที่ไม่เคยเลือก',
        titleEng: 'The Untraveled Path',
        duration: '4:05',
        durationSeconds: 245,
        story: 'บทเพลงจังหวะกรูฟหนักแน่น สะท้อนการตัดสินใจเดินบนเส้นทางดนตรีของตัวเอง',
        lyrics: [
          '(Verse 1)',
          'หลายคนบอกให้เดินตามรอยเดิม...',
          'แต่ฉันเลือกที่จะก้าวไปในทางใหม่'
        ],
        chords: 'Verse: Dm | Bb | F | C',
        audioParams: { bpm: 124, key: 'D Minor', style: 'heavy_groove', rootNote: 62 }
      }
    ]
  }
];
