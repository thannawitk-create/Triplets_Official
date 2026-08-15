import { BandMember, Song, LiveShow, NewsItem, FanMessage, GalleryItem } from '../types';
import { IMAGES } from './images';

export const BAND_INFO = {
  name: 'TRIPLETS',
  taglineEng: 'THREE SOULS • THREE VOICES • ONE STORY',
  taglineThai: '3 คน 3 เสียง 3 มุมมอง... หนึ่งเรื่องราว',
  genre: 'Emotion Rock / Pop-Rock / Modern Alternative',
  formedYear: 2022,
  label: 'Independent / Studio Tri-Eage',
  bio: `TRIPLETS (ทริปเพล็ตส์) วงดนตรีร็อกอารมณ์ลึกซึ้งจากการรวมตัวของ 3 เพื่อนสนิท - วิน (WIN), เท็น (Ten) และ ไทเกอร์ (Tiger) ผู้เชื่อในพลังของเสียงดนตรีที่ถ่ายทอดจากหัวใจจริง 

ดนตรีของ TRIPLETS โดดเด่นด้วยเมโลดี้ร็อกฟังติดหู เสียงร้องทรงพลังที่มีกลิ่นอายความเหงาและเว้าวอน ผสานไลน์เบสแน่นแน่นมีมิติ และจังหวะกลองกระแทกใจ โดยมีซิงเกิลล่าสุด "หากวันนั้น..." ที่จับมือกับนักร้องรับเชิญพิเศษ "โมนา (Mona)" สร้างปรากฏการณ์ฮิตติดชาร์ตเพลงทั่วประเทศ`,
  stats: {
    monthlyListeners: '1.2M+',
    youtubeViews: '45M+',
    totalShows: '180+',
    fanclubCount: '250,000+'
  },
  socials: {
    facebook: 'https://facebook.com/tripletsband.official',
    instagram: 'https://instagram.com/triplets.official',
    youtube: 'https://youtube.com/@tripletsband',
    tiktok: 'https://tiktok.com/@triplets.band',
    lineOA: 'https://lin.ee/tripletsofficial'
  },
  bookingContact: {
    phone: '081-987-6543 (คุณนก - Manager)',
    email: 'booking@tripletsband.com',
    line: '@tripletsbooking'
  }
};

export const MEMBERS: BandMember[] = [
  {
    id: 'win',
    nameThai: 'วิน',
    nameEng: 'WIN (Vocal)',
    role: 'Lead Vocal',
    roleDescription: 'เสียงร้องหลักถ่ายทอดอารมณ์ความรู้สึกตรงเข้าถึงหัวใจผู้ฟัง',
    quote: 'เสียงที่ถ่ายทอดความรู้สึกจากหัวใจ... ตรงถึงเธอ',
    bio: 'วินเป็นนักร้องนำผู้สร้างพลังและแรงดึงดูดบนเวที ด้วยน้ำเสียงเข้มมีเสน่ห์เฉพาะตัว สะท้อนทุกห้วงอารมณ์ทั้งความรัก ความเหงา และความหวัง',
    signatureGear: ['Shure KSM9 Microphone', 'Custom Fender Telecaster Thinline', 'Kemper Profiler Stage'],
    favoriteGenre: 'Alternative Rock, Britpop',
    image: IMAGES.winPortrait,
    socials: {
      instagram: '@win_triplets',
      tiktok: '@win.vocal'
    },
    keyTracks: ['หากวันนั้น...', 'ความรักที่หายไป', 'ย้อนเวลาเพื่อเธอ']
  },
  {
    id: 'ten',
    nameThai: 'เท็น',
    nameEng: 'Ten (Bass)',
    role: 'Bass',
    roleDescription: 'จังหวะและมิติที่เชื่อมทุกอารมณ์ให้เป็นหนึ่งเดียว',
    quote: 'จังหวะและมิติที่เชื่อมทุกอารมณ์ให้เป็นหนึ่งเดียว',
    bio: 'เท็นเป็นมือเบสผู้กุมจังหวะเบสหนาหนักลึก เป็นเสาหลักที่ผสานท่วงทำนองเสียงร้องและกลองให้หลอมรวมเป็นเนื้อเดียวกัน',
    signatureGear: ['Music Man StingRay Special 4-String', 'Ampeg SVT-CL Tube Amp', 'Darkglass B7K Ultra'],
    favoriteGenre: 'Post-Rock, Modern Metalcore',
    image: IMAGES.tenPortrait,
    socials: {
      instagram: '@ten_bassline',
      tiktok: '@ten.triplets'
    },
    keyTracks: ['เพราะขาดเธอ', 'รักที่ไม่ได้พูด', 'หากวันนั้น...']
  },
  {
    id: 'tiger',
    nameThai: 'ไทเกอร์',
    nameEng: 'Tiger (Drums)',
    role: 'Drums',
    roleDescription: 'พลังของจังหวะ ที่ผลักดันทุกความรู้สึกให้เดินต่อไป',
    quote: 'พลังของจังหวะ ที่ผลักดันทุกความรู้สึกให้เดินต่อไป',
    bio: 'ไทเกอร์คือขุมพลังหลังชุดกลอง Dynamic การตีทรงพลัง ดุดัน แต่แฝงด้วยลูกล่อลูกชนชั้นเชิงจังหวะที่ทำให้ทุกโชว์เต็มไปด้วยความตื่นเต้น',
    signatureGear: ['Tama Starclassic Walnut/Birch Drumkit', 'Zildjian K Custom Cymbals', 'Promark 5B Drumsticks'],
    favoriteGenre: 'Hard Rock, Progressive Pop',
    image: IMAGES.tigerPortrait,
    socials: {
      instagram: '@tiger_drums',
      tiktok: '@tiger.beat'
    },
    keyTracks: ['คิดถึงเธอเสมอ', 'หากวันนั้น...', 'ความรักที่หายไป']
  },
  {
    id: 'mona',
    nameThai: 'โมนา',
    nameEng: 'Mona (Guest Vocal)',
    role: 'Guest Vocal',
    roleDescription: 'เสียงที่เติมเต็ม... ให้เรื่องราวสมบูรณ์',
    quote: 'เสียงที่เติมเต็ม... ให้เรื่องราวสมบูรณ์',
    bio: 'โมนา นักร้องสาวรับเชิญสุดพิเศษในอัลบั้ม "หากวันนั้น..." เสียงร้องละมุนหวานแต่สะกดอารมณ์ที่มาช่วยเพิ่มมิติและเรื่องราวคู่ขนานให้กับบทเพลง',
    signatureGear: ['Neumann TLM 103', 'Sennheiser Digital Wireless Mic'],
    favoriteGenre: 'Neo-Soul, Emotional Pop-Rock',
    image: IMAGES.monaPortrait,
    socials: {
      instagram: '@mona_voice',
      tiktok: '@mona.official'
    },
    keyTracks: ['หากวันนั้น... (Feat. Mona)']
  }
];

export const ALBUM_INFO = {
  titleThai: 'หากวันนั้น...',
  titleEng: 'If That Day...',
  releaseYear: '2026',
  conceptQuote: 'ถ้าย้อนเวลากลับไปได้... เราจะยังเลือกกันและกันอยู่อีกไหม',
  coverImage: IMAGES.albumCover,
  producer: 'TRIPLETS & Tri-Eage Studio',
  genre: 'Emotion Rock',
  description: 'อัลบั้มที่รวบรวม 8 บทเพลงแห่งความทรงจำ คำถามในใจ และความรู้สึกที่ยังไม่เคยจางหาย ถ่ายทอดผ่านมุมมองดนตรีร็อกเข้มข้นหลอมรวมเป็นหนึ่ง'
};

export const SONGS: Song[] = [
  {
    id: 'song-1',
    trackNumber: 1,
    titleThai: 'หากวันนั้น...',
    titleEng: 'If That Day...',
    duration: '4:28',
    durationSeconds: 268,
    featuredArtist: 'Feat. Mona',
    story: 'เพลงไทเทิลหลักของอัลบั้ม พูดถึงการตั้งคำถามกับตัวเองในวันที่สายไป ว่าถ้าหากย้อนเวลากลับไปในจุดเริ่มต้นได้ เราจะตัดสินใจเหมือนเดิม หรือจะเลือกเส้นทางที่ไม่ต้องเจ็บปวด',
    audioUrl: '/audio/01.mp3.mp3',
    lyrics: [
      'มองย้อนไปในวันเก่า ที่เคยมีเธอตรงนี้',
      'ทุกภาพความทรงจำยังชัดเจนในใจ',
      'หากวันนั้นฉันรั้งเธอไว้ ไม่ปล่อยมือให้เดินไป',
      'วันนี้เรายังคงรักกันอยู่ใช่ไหม...',
      '',
      '(Chorus - WIN & Mona)',
      'หากวันนั้นฉันรู้ว่านั่นคือครั้งสุดท้าย',
      'กอดเธอไว้ให้นานกว่านี้ ไม่ยอมให้จากไป',
      'คำว่ารักที่ค้างอยู่ในใจ จะพูดให้เธอฟัง',
      'ก่อนที่กาลเวลาจะพาเธอไกลเกินไขว่คว้า...',
      '',
      'ในยามค่ำคืนที่อ้างว้าง เสียงเพลงเดิมยังตอกย้ำ',
      'ว่าฉันยังคงคิดถึงเธอเสมอ...',
      'ย้อนเวลากลับไปได้ไหม... หากวันนั้น...'
    ],
    chords: 'Intro: Am | F | C | G\nVerse: Am | F | C | G\nChorus: F | G | Em | Am | F | G | C',
    audioParams: {
      bpm: 116,
      key: 'A Minor',
      style: 'melancholic_rock',
      rootNote: 57 // A3
    }
  },
  {
    id: 'song-2',
    trackNumber: 2,
    titleThai: 'ความรักที่หายไป',
    titleEng: 'Lost Love',
    duration: '4:12',
    durationSeconds: 252,
    audioUrl: '/audio/02.mp3.mp3',
    story: 'เพลงร็อกจังหวะหนักแน่นที่ระบายความรู้สึกเมื่อความสัมพันธ์ค่อยๆ จางหายไป โดยที่เราทำได้เพียงมองดูมันพังทลายลงไปต่อหน้าต่อตา',
    lyrics: [
      'เงียบงัน... ในความอ้างว้าง',
      'ไม่มีคำอธิบาย ถึงเหตุผลที่เธอเปลี่ยนไป',
      'ความรักที่เคยงดงาม ค่อยๆ ล่องลอยหายไป',
      '',
      '(Chorus)',
      'ปลดปล่อยฉันจากความเจ็บปวดนี้ที',
      'เมื่อความรักที่เคยมี มันกลายเป็นเพียงควันไฟ',
      'เหลือทิ้งไว้แค่รอยแผลที่ลึกเกินทนไหว',
      'ค้นหาเท่าไร... ก็ไม่เจอเธอคนเดิม'
    ],
    chords: 'Intro: Dm | Bb | F | C\nChorus: Bb | C | Am | Dm',
    audioParams: {
      bpm: 128,
      key: 'D Minor',
      style: 'heavy_groove',
      rootNote: 62 // D4
    }
  },
  {
    id: 'song-3',
    trackNumber: 3,
    titleThai: 'รักที่ไม่ได้พูด',
    titleEng: 'Unspoken Love',
    duration: '4:05',
    durationSeconds: 245,
    audioUrl: '/audio/03.mp3.mp3',
    story: 'บทเพลงแทนใจคนที่ทำได้เพียงแอบรักและเคียงข้างในฐานะเพื่อน เก็บซ่อนความรู้สึกไว้ข้างในเพราะกลัวจะสูญเสียเธอไปตลอดกาล',
    lyrics: [
      'ยิ้มให้เธอทุกครั้งเมื่อเราพบกัน',
      'ทำเหมือนไม่คิดอะไร ในใจสั่นไหวทุกที',
      'แอบมองเธออยู่ตรงนี้ ใกล้เพียงแค่เอื้อมมือ',
      'แต่เหมือนไกลสุดสายตา...',
      '',
      '(Chorus)',
      'คำว่ารักที่ปิดซ่อนไว้ ไม่เคยกล้าพูดออกไป',
      'กลัวความจริงจะทำลาย เรื่องราวระหว่างเรา',
      'ขอเป็นคนที่ยืนข้างเธอ แม้ในฐานะอะไรก็ตาม',
      'แค่นี้ก็เพียงพอ... สำหรับคนที่รักเธอ'
    ],
    chords: 'Intro: C | G/B | Am | F\nChorus: F | G | C G/B | Am',
    audioParams: {
      bpm: 92,
      key: 'C Major',
      style: 'ballad',
      rootNote: 60 // C4
    }
  },
  {
    id: 'song-4',
    trackNumber: 4,
    titleThai: 'เพราะขาดเธอ',
    titleEng: 'Without You',
    duration: '3:59',
    durationSeconds: 239,
    audioUrl: '/audio/04.mp3.mp3',
    story: 'เพลงที่สะท้อนให้เห็นว่าในวันที่ไม่มีเธอ โลกใบเดิมที่เคยสดใสกลับกลายเป็นสีเทาและความเจ็บปวดของการเรียนรู้ที่จะอยู่คนเดียว',
    lyrics: [
      'ลมหนาวพัดผ่านเข้ามา เตือนให้รู้ว่าไม่มีเธอ',
      'ก้าวเดินไปบนทางเดิม แต่ไม่มีมือเธอจับไว้',
      '',
      '(Chorus)',
      'เพราะขาดเธอ โลกทั้งใบก็ไร้ความหมาย',
      'ลมหายใจที่มี กลายเป็นเพียงแค่ความว่างเปล่า',
      'ต้องทรมานกับความเหงา ไปอีกนานเท่าไร...',
      'เมื่อไรใจนี้จะลืมเธอได้เสียที'
    ],
    chords: 'Intro: Em | C | G | D\nChorus: C | D | Bm | Em',
    audioParams: {
      bpm: 108,
      key: 'E Minor',
      style: 'melancholic_rock',
      rootNote: 64 // E4
    }
  },
  {
    id: 'song-5',
    trackNumber: 5,
    titleThai: 'คิดถึงเธอเสมอ',
    titleEng: 'Always Missing You',
    duration: '4:33',
    durationSeconds: 273,
    audioUrl: '/audio/05.mp3.mp3',
    story: 'เพลงที่ถ่ายทอดความรู้สึกอบอุ่นแกมเหงา ยินดีที่เคยได้รักเธอ และขอให้เธอมีความสุขแม้ในวันนี้คนที่ยืนข้างเธอจะไม่ใช่เราอีกแล้ว',
    lyrics: [
      'มองดูท้องฟ้าค่ำคืนนี้ ดวงดาวส่องแสงกว้างไกล',
      'หวังว่าเธอตรงนั้น คงมีความสุขดี',
      '',
      '(Chorus)',
      'คิดถึงเธอเสมอ ไม่ว่าเวลาจะผ่านไปเท่าไร',
      'ขอบคุณทุกนาทีดีๆ ที่เคยสร้างมาด้วยกัน',
      'แม้เราต้องแยกย้ายไปตามทางของชีวิต',
      'เธอยังเป็นคนสำคัญ... ในใจฉันตลอดไป'
    ],
    chords: 'Intro: G | D | Em | C\nChorus: C | D | G D/F# | Em',
    audioParams: {
      bpm: 98,
      key: 'G Major',
      style: 'ballad',
      rootNote: 55 // G3
    }
  },
  {
    id: 'song-6',
    trackNumber: 6,
    titleThai: 'ย้อนเวลาเพื่อเธอ',
    titleEng: 'Time Travel for You',
    duration: '4:21',
    durationSeconds: 261,
    audioUrl: '/audio/06.mp3.mp3',
    story: 'เพลงแทร็กสุดท้ายที่มีจังหวะพุ่งและทรงพลัง ปลุกเร้าอารมณ์ของการต่อสู้กับโชคชะตา เพื่อรักษาความรักและความฝันเอาไว้สุดกำลัง',
    lyrics: [
      'หากขีดเขียนชะตาชีวิตได้เองอีกครั้ง',
      'จะไม่ยอมพ่ายแพ้ให้กับความเหงาอีกต่อไป',
      '',
      '(Chorus)',
      'จะขอย้อนเวลา กลับไปแก้ไขทุกสิ่ง',
      'จะกอดเธอไว้ด้วยหัวใจทั้งหมดที่มี',
      'จะไม่ปล่อยให้ความเข้าใจผิด มาแยกเราไกล',
      'เพราะเธอคือคนเดียว... ที่ฉันรักหมดหัวใจ!'
    ],
    chords: 'Intro: Bm | G | D | A\nChorus: G | A | F#m | Bm',
    audioParams: {
      bpm: 135,
      key: 'B Minor',
      style: 'energetic_alt',
      rootNote: 59 // B3
    }
  },
  {
    id: 'song-7',
    trackNumber: 7,
    titleThai: 'หากวันนั้น',
    titleEng: 'If That Day (Mona)',
    duration: '3:31',
    durationSeconds: 211,
    featuredArtist: 'Mona',
    audioUrl: '/audio/07.mp3.mp3',
    story: 'บทเพลง "หากวันนั้น..." ถ่ายทอดผ่านน้ำเสียงอันทรงเสน่ห์และลึกซึ้งของ Mona ในสไตล์ Melancholic Rock กับอารมณ์ความรู้สึกที่เต็มไปด้วยความทรงจำอันงดงามและคราบน้ำตา',
    lyrics: [
      'มองย้อนไปในวันเก่า ที่เคยมีเธอตรงนี้',
      'ทุกภาพความทรงจำยังชัดเจนในใจ',
      'หากวันนั้นฉันรั้งเธอไว้ ไม่ปล่อยมือให้เดินไป',
      'วันนี้เรายังคงรักกันอยู่ใช่ไหม...',
      '',
      '(Chorus - Mona)',
      'หากวันนั้นฉันรู้ว่านั่นคือครั้งสุดท้าย',
      'กอดเธอไว้ให้นานกว่านี้ ไม่ยอมให้จากไป',
      'คำว่ารักที่ค้างอยู่ในใจ จะพูดให้เธอฟัง',
      'ก่อนที่กาลเวลาจะพาเธอไกลเกินไขว่คว้า...',
      '',
      'ในยามค่ำคืนที่อ้างว้าง เสียงเพลงเดิมยังตอกย้ำ',
      'ว่าฉันยังคงคิดถึงเธอเสมอ...',
      'ย้อนเวลากลับไปได้ไหม... หากวันนั้น...'
    ],
    chords: 'Intro: Am | F | C | G\nVerse: Am | F | C | G\nChorus: F | G | Em | Am | F | G | C',
    audioParams: {
      bpm: 114,
      key: 'A Minor',
      style: 'melancholic_rock',
      rootNote: 57 // A3
    }
  },
  {
    id: 'song-8',
    trackNumber: 8,
    titleThai: 'หากวันนั้น',
    titleEng: 'If That Day (Win Feat. Mona)',
    duration: '3:34',
    durationSeconds: 214,
    featuredArtist: 'Win Feat. Mona',
    audioUrl: '/audio/08.mp3.mp3',
    story: 'บทเพลง "หากวันนั้น..." เวอร์ชันพิเศษ Win Feat. Mona ที่ประสานเสียงร้องคู่ได้อย่างลงตัว ดนตรี Melancholic Rock อันหนักแน่น ถ่ายทอดมิติความรู้สึกของทั้งสองฝ่ายได้อย่างสมบูรณ์แบบ',
    lyrics: [
      'มองย้อนไปในวันเก่า ที่เคยมีเธอตรงนี้',
      'ทุกภาพความทรงจำยังชัดเจนในใจ',
      'หากวันนั้นฉันรั้งเธอไว้ ไม่ปล่อยมือให้เดินไป',
      'วันนี้เรายังคงรักกันอยู่ใช่ไหม...',
      '',
      '(Chorus - Win & Mona)',
      'หากวันนั้นฉันรู้ว่านั่นคือครั้งสุดท้าย',
      'กอดเธอไว้ให้นานกว่านี้ ไม่ยอมให้จากไป',
      'คำว่ารักที่ค้างอยู่ในใจ จะพูดให้เธอฟัง',
      'ก่อนที่กาลเวลาจะพาเธอไกลเกินไขว่คว้า...',
      '',
      'ในยามค่ำคืนที่อ้างว้าง เสียงเพลงเดิมยังตอกย้ำ',
      'ว่าฉันยังคงคิดถึงเธอเสมอ...',
      'ย้อนเวลากลับไปได้ไหม... หากวันนั้น...'
    ],
    chords: 'Intro: Am | F | C | G\nVerse: Am | F | C | G\nChorus: F | G | Em | Am | F | G | C',
    audioParams: {
      bpm: 116,
      key: 'A Minor',
      style: 'melancholic_rock',
      rootNote: 57 // A3
    }
  }
];

export const LIVE_SHOWS: LiveShow[] = [
  {
    id: 'show-1',
    date: '15 ส.ค. 2026',
    isoDate: '2026-08-15',
    time: '21:30 น.',
    title: 'TRIPLETS Live in Bangkok - Album Launch Concert',
    venue: 'Thunder Dome, Muang Thong Thani',
    district: 'ปากเกร็ด',
    province: 'นนทบุรี / กรุงเทพฯ',
    type: 'Concert & Festival',
    status: 'Selling Fast',
    ticketPrice: '800 / 1,200 / 1,800 บาท',
    bookingUrl: '#booking',
    locationMapUrl: 'https://maps.google.com/?q=Thunder+Dome+Muang+Thong+Thani',
    description: 'คอนเสิร์ตใหญ่เปิดอัลบั้มใหม่ "หากวันนั้น..." พร้อมแขกรับเชิญพิเศษ Mona และโชว์เต็มรูปแบบ 2 ชั่วโมงเต็ม!'
  },
  {
    id: 'show-2',
    date: '22 ส.ค. 2026',
    isoDate: '2026-08-22',
    time: '22:45 น.',
    title: 'Rock Out Night Live Show',
    venue: 'Overground Bar & Live Music',
    district: 'เอกมัย',
    province: 'กรุงเทพมหานคร',
    type: 'Pub & Live House',
    status: 'Available',
    ticketPrice: 'สำรองโต๊ะล่วงหน้า / บัตรผ่านประตู 350 บาท (ฟรี 1 Drink)',
    tableReservationPhone: '082-111-2233',
    lineId: '@overgroundbar',
    locationMapUrl: 'https://maps.google.com/?q=Ekkamai+Bangkok',
    description: 'โชว์อคูสติกสลับร็อกเน้นๆ ใกล้ชิดแฟนคลับในบรรยากาศผับสุดชิลล์ใจกลางเอกมัย'
  },
  {
    id: 'show-3',
    date: '29 ส.ค. 2026',
    isoDate: '2026-08-29',
    time: '20:00 น.',
    title: 'Chiang Mai North Rock Fest 2026',
    venue: 'ศูนย์การค้าเซ็นทรัล เชียงใหม่ (เฟสติวัล)',
    district: 'เมือง',
    province: 'เชียงใหม่',
    type: 'Concert & Festival',
    status: 'Selling Fast',
    ticketPrice: '600 บาท (บัตรเหมาวัน)',
    bookingUrl: '#booking',
    locationMapUrl: 'https://maps.google.com/?q=Central+Chiangmai',
    description: 'ทัวร์ภาคเหนือครั้งแรกของปี โชว์เพลงใหม่ยกอัลบั้มกลางลมหนาวต้นฤดู'
  },
  {
    id: 'show-4',
    date: '05 ก.ย. 2026',
    isoDate: '2026-09-05',
    time: '19:00 น.',
    title: 'TRIPLETS Exclusive Fan Meeting & Acoustic Intimate Session',
    venue: 'GMM Live Studio, CentralWorld Class 8',
    district: 'ปทุมวัน',
    province: 'กรุงเทพมหานคร',
    type: 'Fan Meeting',
    status: 'Sold Out',
    ticketPrice: '1,500 บาท (จำกัด 300 ที่นั่ง + รับโปสเตอร์พร้อมลายเซ็นสด)',
    locationMapUrl: 'https://maps.google.com/?q=CentralWorld+Bangkok',
    description: 'กิจกรรมมีตติ้งสุดเอ็กซ์คลูซีฟ พูดคุย Q&A ร้องเพลงสดๆ อคูสติกเวอร์ชัน ถ่ายรูป Group Photo กับสมาชิกวง'
  },
  {
    id: 'show-5',
    date: '12 ก.ย. 2026',
    isoDate: '2026-09-12',
    time: '23:00 น.',
    title: 'Isan Rock Explosion Tour 2026',
    venue: 'ตะวันแดง มหาชน ขอนแก่น',
    district: 'เมือง',
    province: 'ขอนแก่น',
    type: 'Pub & Live House',
    status: 'Available',
    ticketPrice: 'เข้าชมฟรี (สำรองโต๊ะล่วงหน้า)',
    tableReservationPhone: '043-999-888',
    locationMapUrl: 'https://maps.google.com/?q=Khon+Kaen',
    description: 'เยือนถิ่นอีสานกับโชว์สุดมันส์ระเบิดความสนุกต่อเนื่องตลอดค่ำคืน'
  },
  {
    id: 'show-6',
    date: '19 ก.ย. 2026',
    isoDate: '2026-09-19',
    time: '21:00 น.',
    title: 'Chonburi Music Beach Party',
    venue: 'หาดบางแสน (เวทีกลาง)',
    district: 'เมือง',
    province: 'ชลบุรี',
    type: 'Concert & Festival',
    status: 'Free Entry',
    ticketPrice: 'เข้าชมฟรี!',
    locationMapUrl: 'https://maps.google.com/?q=Bangsaen+Beach',
    description: 'เทศกาลดนตรีริมหาดชลบุรี ฟังดนตรีร็อกเคล้าเสียงคลื่นและลมทะเล'
  },
  {
    id: 'show-7',
    date: '03 ต.ค. 2026',
    isoDate: '2026-10-03',
    time: '20:30 น.',
    title: 'Phuket Soundwave Live Fest',
    venue: 'สะพานหิน เทศบาลนครภูเก็ต',
    district: 'เมือง',
    province: 'ภูเก็ต',
    type: 'Concert & Festival',
    status: 'Available',
    ticketPrice: '500 บาท',
    bookingUrl: '#booking',
    locationMapUrl: 'https://maps.google.com/?q=Phuket+Saphan+Hin',
    description: 'ลุยทัวร์คอนเสิร์ตภาคใต้สุดตระการตาที่จังหวัดภูเก็ต'
  }
];

export const NEWS_LIST: NewsItem[] = [
  {
    id: 'news-1',
    title: 'TRIPLETS ปล่อยอัลบั้มใหม่ "หากวันนั้น..." พร้อมมิวสิกวิดีโอ Feat. Mona ยอดวิวพุ่ง 1 ล้านภายใน 24 ชม.!',
    category: 'อัลบั้มใหม่',
    date: '10 ส.ค. 2026',
    summary: 'สมการรอคอยของแฟนเพลง! TRIPLETS ปล่อยอัลบั้มเต็มชุดแรกพร้อมซิงเกิลไทเทิลดึง โมนา (Mona) มาร่วมฟีทเจอริ่ง กระแสตอบรับอบอุ่นถล่มทลายทั่วโซเชียล',
    content: [
      'สิ้นสุดการรอคอยสำหรับแฟนๆ วง TRIPLETS (ทริปเพล็ตส์) ที่ล่าสุดได้ประกาศปล่อยอัลบั้มเต็มอย่างเป็นทางการในชื่อ "หากวันนั้น..." (If That Day...) พร้อมเปิดตัวมิวสิกวิดีโอซิงเกิลหลักชื่อเดียวกับอัลบั้ม',
      'ไฮไลต์สำคัญของซิงเกิลนี้คือการดึงนักร้องสาวเสียงทรงเสน่ห์ "โมนา (Mona)" มาร่วมขับร้องแบบดูโอ้คู่กับ วิน (Lead Vocal) ถ่ายทอดมิติบทสนทนาของคู่รักที่ต้องแยกทางกัน สร้างความสะเทือนอารมณ์จนติดเทรนด์มิวสิกวิดีโอมาแรงอันดับ 1 บน YouTube Thailand',
      'วิน เล่าถึงเบื้องหลังว่า "อัลบั้มนี้คือการกลั่นกรองความรู้สึกจริงตลอด 3 ปีของพวกเรา ทั้งเสียงเบสของเท็น และกลองของไทเกอร์ ถูกดีไซน์มาเพื่อรองรับอารมณ์เพลงให้ลึกซึ้งที่สุด ขอบคุณแฟนเพลงทุกคนที่ช่วยกันฟังและซัพพอร์ตพวกเราครับ"'
    ],
    image: IMAGES.albumCover,
    featured: true,
    likesCount: 1240,
    commentsCount: 185
  },
  {
    id: 'news-2',
    title: 'เปิดขายอัลบั้มแล้ว! TRIPLETS อัลบั้มเต็ม "หากวันนั้น..."',
    category: 'อัลบั้มใหม่',
    date: '08 ส.ค. 2026',
    summary: 'แฟนคลับเตรียมตัวให้พร้อม! สั่งซื้ออัลบั้มพร้อมโฟโต้บุ๊กฉบับพิเศษสุดเอ็กซ์คลูซีฟ',
    content: [
      'ประกาศอย่างเป็นทางการแล้วสำหรับอัลบั้มเต็ม "หากวันนั้น..." ของวง TRIPLETS',
      'จัดเต็มทั้งเพลงฮิต คุณภาพดนตรีอันทรงพลัง และของแถมสุดพรีเมียมภายในบ็อกเซต',
      'แฟนๆ สามารถสั่งซื้อได้แล้ววันนี้ผ่านระบบหน้าเว็บไซต์ หรือตัวแทนจำหน่ายอย่างเป็นทางการ'
    ],
    image: IMAGES.heroBanner,
    featured: false,
    likesCount: 890,
    commentsCount: 94
  },
  {
    id: 'news-3',
    title: 'เปิดตัว Official Merch คอลเลกชันใหม่ "TRIPLETS Tri-Eage Limited Boxset"',
    category: 'สินค้าวง',
    date: '05 ส.ค. 2026',
    summary: 'เอาใจสายสะสม! เปิดตัวบ็อกเซตอัลบั้มพร้อมเสื้อยืด ลายเซ็นสด และพวงกุญแจโลหะสัญลักษณ์วง TRIPLETS',
    content: [
      'วง TRIPLETS เอาใจแฟนคลับด้วยการเปิดสั่งจอง "Tri-Eage Limited Boxset" จำนวนจำกัดเพียง 1,000 ชุดทั่วประเทศ',
      'ในบ็อกเซตประกอบด้วย: แผ่น CD Audio คุณภาพสูง, สมุดภาพถ่ายเบื้องหลัง (Photobook 48 หน้า), เสื้อยืดลายโลโก้สัญลักษณ์โลหะ, และปิ๊กดีดกีตาร์สกรีนลายเซ็น 3 สมาชิก'
    ],
    image: IMAGES.heroBanner,
    featured: false,
    likesCount: 650,
    commentsCount: 42
  }
];

export const INITIAL_FAN_MESSAGES: FanMessage[] = [
  {
    id: 'fan-1',
    fanName: 'น้องมายด์ (Triplets_FC_BKK)',
    memberTag: 'WIN',
    favoriteSong: 'หากวันนั้น...',
    message: 'ฟังเพลง หากวันนั้น... แล้วร้องไห้เลยค่ะ เสียงพี่วินกับพี่โมนาเข้ากันมากกก! รอเชียร์และเป็นกำลังใจให้พี่ๆ TRIPLETS ทุกคนเสมอนะคะ ❤️',
    timestamp: '10 นาทีที่แล้ว',
    likes: 28,
    verifiedFan: true
  },
  {
    id: 'fan-2',
    fanName: 'กอล์ฟ สายร็อก',
    memberTag: 'Tiger',
    favoriteSong: 'ความรักที่หายไป',
    message: 'ไลน์กลองพี่ไทเกอร์ในเพลง ความรักที่หายไป ดุดันสะใจมากครับ! มือดรัมเมอร์ไอดอลของผมเลย ติดตามผลงานมาตั้งแต่อีพีแรกครับ!',
    timestamp: '1 ชั่วโมงที่แล้ว',
    likes: 19
  },
  {
    id: 'fan-3',
    fanName: 'นิว Bassist Girl',
    memberTag: 'Ten',
    favoriteSong: 'เพราะขาดเธอ',
    message: 'พี่เท็นซาวด์เบสแน่นมากค่ะ ฟังกับหูฟังเสียงเบสเดินเนียนกริ๊บ ชอบลุคใส่แจ็กเก็ตหนังมาก เท่ที่สุดในวง!',
    timestamp: '3 ชั่วโมงที่แล้ว',
    likes: 34,
    verifiedFan: true
  },
  {
    id: 'fan-4',
    fanName: 'Ploy_MonaFan',
    memberTag: 'Mona',
    favoriteSong: 'หากวันนั้น...',
    message: 'พี่โมนาขึ้นร้องเพลงด้วยคือเติมเต็มความรู้สึกสมชื่อจริงๆ ค่ะ หวังว่าจะมีทัวร์คอนเสิร์ตต่างจังหวัดเยอะๆ นะคะ!',
    timestamp: '5 ชั่วโมงที่แล้ว',
    likes: 15
  }
];
