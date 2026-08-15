# TRIPLETS Band Official Website 🎸🥁🎤

เว็บไซต์ทางการและแพลตฟอร์มสตรีมมิ่ง/ศูนย์รวมแฟนคลับของวง **TRIPLETS Band** พัฒนาด้วย **React 19, TypeScript, Tailwind CSS v4, Motion และ Web Audio API**

---

## 🌟 คุณสมบัติเด่น (Key Features)

- 🎵 **ระบบเครื่องเล่นเพลงออนไลน์ (Interactive Music Streaming & Web Audio Engine)**:
  - เครื่องเล่นเพลงหลักพร้อมระบบจำลองเสียงดนตรี Web Audio API / รองรับไฟล์เสียงจริง MP3
  - แถบสถานะเวลาเพลง ความยาวเพลง การเลื่อนหาตำแหน่งเพลง (Timeline Seek) ที่ซิงค์ตรงกันทุกจุด
  - รองรับโหมดวนซ้ำ (Repeat All / Repeat One / Off) และโหมดสุ่มเพลง (Shuffle)
  - ระบบเนื้อเพลง (Lyrics), เรื่องราวเบื้องหลังเพลง (Story), และคอร์ดเพลง (Chords)
  - แถบ **Floating Mini-Player** ติดล่างหน้าจอพร้อมปุ่มควบคุมเต็มรูปแบบ
- 🖼️ **ระบบสไลด์โชว์ & แกลเลอรีภาพวง (Live Slideshow & Gallery)**:
  - สไลด์โชว์รูปภาพวงอัตโนมัติขณะฟังเพลง
  - ระบบพรีเซ็ทภาพศิลปินและเวที
- 👥 **โปรไฟล์สมาชิกวง (Band Members Profile)**:
  - ข้อมูลสมาชิกหลัก 3 คน (วิน, เท็น, ไทเกอร์) + 1 นักร้องรับเชิญพิเศษ (โมนา)
  - ระบบปุ่มปรับแต่งข้อมูลและรูปภาพศิลปิน
- 🔒 **ระบบ Admin Mode (Admin PIN: `120123`)**:
  - ล็อกสิทธิ์เข้าถึงเครื่องมือจัดการสำหรับผู้ดูแลระบบเท่านั้น
  - เพิ่ม / แก้ไข / ลบ เพลง, ปรับแต่งเนื้อเพลง, แก้ไขรูปภาพศิลปินและแบนเนอร์เวที
  - ระบบ **Template Manager & Blank Design Engine** สำหรับการสำรอง/นำเข้าโครงร่างการออกแบบ (JSON Export/Import)
- 💬 **มุมแฟนคลับ & สมุดเยี่ยม (Fan Zone & Guestbook)**:
  - ฝากข้อความถึงวง TRIPLETS และกดส่งหัวใจให้กำลังใจศิลปิน

---

## 🛠️ การติดตั้งและการรันโปรเจกต์ (Installation & Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโปรเจกต์ในโหมดพัฒนา (Development Mode)
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### 3. ตรวจสอบโค้ด (Linting)
```bash
npm run lint
```

### 4. บิลด์สำหรับ Production
```bash
npm run build
```

---

## 🚀 คำสั่งนำขึ้น GitHub (How to Push to GitHub)

หากคุณต้องการนำโปรเจกต์นี้ขึ้น Repository บน GitHub ของคุณเอง ให้ทำตามขั้นตอนดังนี้:

### 1. สร้าง Repository ใหม่บน GitHub
- เข้าไปที่ [GitHub](https://github.com/new) และสร้าง Repository ใหม่ (เช่นชื่อ `triplets-band-website`)

### 2. รันคำสั่ง Git ในเครื่องของคุณ
```bash
# 1. สร้าง Git repository ภายในโฟลเดอร์
git init

# 2. เพิ่มไฟล์ทั้งหมดเข้าสู่ Staging
git add .

# 3. บันทึก Commit แรก
git commit -m "feat: initial commit for triplets band website"

# 4. ตั้งชื่อ Branch หลักเป็น main
git branch -M main

# 5. เชื่อมต่อกับ Remote Repository ของคุณ (แทนที่ด้วย URL ของคุณ)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push ข้อมูลขึ้นสู่ GitHub
git push -u origin main
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
├── public/                 # ไฟล์ Static assets (favicon, icons)
├── src/
│   ├── components/         # คอมโพเนนต์ UI ทั้งหมด (Navbar, Hero, Player, Modals, ฯลฯ)
│   ├── context/            # Context จัดการ State กลาง (SongContext, ImageContext)
│   ├── data/               # ข้อมูลเริ่มต้น (bandData, templatePresets)
│   ├── utils/              # ตัวช่วยคำนวณเสียง (audioSynth, audioStorage, imageCompressor)
│   ├── types.ts            # ประกาศ Type definitions ใน TypeScript
│   ├── App.tsx             # หน้าหลัก Main Component
│   ├── main.tsx            # จุดเริ่มต้น React Application
│   └── index.css           # สไตล์สากล Tailwind CSS v4
├── metadata.json           # การตั้งค่าแอปพลิเคชัน
├── package.json            # รายการ Dependencies และ Scripts
└── README.md               # คู่มือการใช้งานและเอกสารกำกับโปรเจกต์
```

---

## 🔐 ข้อมูลผู้ดูแลระบบ (Admin Credentials)
- **Admin PIN**: `120123`
