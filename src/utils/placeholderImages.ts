// High quality SVG Data URLs for blank design template mode

const createSvgDataUrl = (
  width: number,
  height: number,
  bgColor: string,
  accentColor: string,
  title: string,
  subtitle: string,
  iconType: 'logo' | 'banner' | 'cover' | 'vocal' | 'bass' | 'drums' | 'guest' | 'silhouette'
): string => {
  let iconSvg = '';
  
  if (iconType === 'logo') {
    iconSvg = `
      <rect x="${width/2 - 40}" y="${height/2 - 50}" width="80" height="40" rx="8" fill="none" stroke="${accentColor}" stroke-width="3" stroke-dasharray="6,4"/>
      <path d="M ${width/2 - 20} ${height/2 - 30} L ${width/2} ${height/2 - 40} L ${width/2 + 20} ${height/2 - 30}" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${width/2}" cy="${height/2 - 25}" r="6" fill="${accentColor}"/>
    `;
  } else if (iconType === 'cover') {
    iconSvg = `
      <circle cx="${width/2}" cy="${height/2 - 30}" r="45" fill="none" stroke="${accentColor}" stroke-width="3"/>
      <circle cx="${width/2}" cy="${height/2 - 30}" r="20" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4,3"/>
      <circle cx="${width/2}" cy="${height/2 - 30}" r="8" fill="${accentColor}"/>
    `;
  } else if (iconType === 'banner') {
    iconSvg = `
      <rect x="${width/2 - 60}" y="${height/2 - 45}" width="120" height="50" rx="8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-dasharray="8,4"/>
      <path d="M ${width/2 - 40} ${height/2 - 10} L ${width/2 - 15} ${height/2 - 30} L ${width/2 + 10} ${height/2 - 15} L ${width/2 + 40} ${height/2 - 35}" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${width/2 - 25}" cy="${height/2 - 35}" r="5" fill="${accentColor}"/>
    `;
  } else {
    // Member Portrait Silhouette
    iconSvg = `
      <circle cx="${width/2}" cy="${height/2 - 50}" r="26" fill="none" stroke="${accentColor}" stroke-width="3"/>
      <path d="M ${width/2 - 42} ${height/2 + 10} C ${width/2 - 40} ${height/2 - 20}, ${width/2 + 40} ${height/2 - 20}, ${width/2 + 42} ${height/2 + 10} Z" fill="none" stroke="${accentColor}" stroke-width="3"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </linearGradient>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#262626" stroke-width="1" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="12" fill="none" stroke="#333333" stroke-width="2" stroke-dasharray="8,6"/>
      ${iconSvg}
      <text x="${width/2}" y="${height/2 + 40}" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
        ${title}
      </text>
      <text x="${width/2}" y="${height/2 + 62}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="medium" fill="#a3a3a3" text-anchor="middle">
        ${subtitle}
      </text>
      <rect x="${width/2 - 60}" y="${height/2 + 76}" width="120" height="22" rx="11" fill="#262626" stroke="${accentColor}" stroke-width="1"/>
      <text x="${width/2}" y="${height/2 + 91}" font-family="monospace" font-size="10" font-weight="bold" fill="${accentColor}" text-anchor="middle">
        + คลิกเพื่ออัปโหลด
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const BLANK_PLACEHOLDER_IMAGES = {
  bandLogo: createSvgDataUrl(300, 200, '#171717', '#ef4444', 'โลโก้วง (Band Logo)', 'ขนาดแนะนำ: 400x400 หรือ PNG โปร่งใส', 'logo'),
  heroBanner: createSvgDataUrl(1280, 720, '#141414', '#ef4444', 'รูปพื้นหลังเวที (Hero Banner)', 'ขนาดแนะนำ: 1920x1080 หรือ 1280x720 (16:9)', 'banner'),
  albumCover: createSvgDataUrl(800, 800, '#171717', '#ef4444', 'ปกอัลบั้ม (Album Cover)', 'ขนาดแนะนำ: 1000x1000 หรือ 800x800 (1:1)', 'cover'),
  win: createSvgDataUrl(600, 800, '#171717', '#ef4444', 'รูปนักร้องนำ (Lead Vocal)', 'ขนาดแนะนำ: 600x800 หรือ 3:4', 'vocal'),
  ten: createSvgDataUrl(600, 800, '#171717', '#ef4444', 'รูปมือเบส (Bass Player)', 'ขนาดแนะนำ: 600x800 หรือ 3:4', 'bass'),
  tiger: createSvgDataUrl(600, 800, '#171717', '#ef4444', 'รูปมือกลอง (Drummer)', 'ขนาดแนะนำ: 600x800 หรือ 3:4', 'drums'),
  mona: createSvgDataUrl(600, 800, '#171717', '#ef4444', 'รูปศิลปินร่วม / กีตาร์ (Member 4)', 'ขนาดแนะนำ: 600x800 หรือ 3:4', 'guest'),
  bandSilhouette: createSvgDataUrl(800, 400, '#141414', '#ef4444', 'รูปเงาสมาชิกวง (Band Silhouette)', 'ขนาดแนะนำ: แนวนอน 800x400', 'silhouette'),
};

export const isPlaceholderImage = (url: string | undefined): boolean => {
  if (!url) return true;
  return url.startsWith('data:image/svg+xml') && url.includes('+%20%E0%B8%84%E0%B8%A5%E0%B8%B4%E0%B8%81%E0%B9%80%E0%B8%9E%E0%B8%B8%E0%B9%88%E0%B8%AD%E0%B8%AD%E0%B8%B1%E0%B8%9B%E0%B9%82%E0%B8%AB%E0%B8%A5%E0%B8%94');
};
