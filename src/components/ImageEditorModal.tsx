import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, RotateCcw, Check, Sparkles, Image as ImageIcon, Camera, Loader2, Plus, Trash2, Images, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useBandImages, BandImageMap, PRESET_LIBRARY } from '../context/ImageContext';
import { useSongs } from '../context/SongContext';
import { compressImageDataUrl } from '../utils/imageCompressor';

const TARGET_LABELS: Record<keyof BandImageMap, { name: string; role: string; desc: string }> = {
  bandLogo: { name: 'โลโก้วง TRIPLETS', role: 'Official Band Logo', desc: 'โลโก้เมทัลลิก 3D ประจำวง TRIPLETS' },
  win: { name: 'วิน (WIN)', role: 'Lead Vocal', desc: 'รูปพอร์ตเทรตนักร้องนำบนเวทีและโปสเตอร์' },
  mona: { name: 'โมนา (Mona)', role: 'Guest Vocal', desc: 'รูปพอร์ตเทรตนักร้องรับเชิญพิเศษ' },
  ten: { name: 'เท็น (Ten)', role: 'Bass', desc: 'รูปพอร์ตเทรตมือเบสวง TRIPLETS' },
  tiger: { name: 'ไทเกอร์ (Tiger)', role: 'Drums', desc: 'รูปพอร์ตเทรตมือกลองวง TRIPLETS' },
  heroBanner: { name: 'รูปพื้นหลังเวทีหน้าแรก (Hero Banner)', role: 'Background Stage', desc: 'ภาพบรรยากาศเวทีคอนเสิร์ตใหญ่ด้านหลัง' },
  albumCover: { name: 'ปกอัลบั้ม "หากวันนั้น..."', role: 'Album Artwork', desc: 'รูปหน้าปกอัลบั้มและเครื่องเล่นเพลง' },
  bandSilhouette: { name: 'รูปเงาสมาชิกวง (Band Silhouette)', role: 'Silhouettes', desc: 'รูปเงา 3 สมาชิกริมน้ำแถบอัลบั้มด้านล่าง' },
};

export const ImageEditorModal: React.FC = () => {
  const { isAdmin, loginAdmin } = useSongs();
  const {
    images,
    updateImage,
    resetImage,
    resetAllImages,
    isImageEditorOpen,
    closeImageEditor,
    activeEditingTarget,
    setActiveEditingTarget,
    slideshowList,
    addCustomSlide,
    deleteSlide,
    resetSlideshowList,
  } = useBandImages();

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets' | 'slideshow_list'>('upload');
  const [inputUrl, setInputUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingToSlideshow, setIsAddingToSlideshow] = useState(false);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImageEditorOpen) return null;

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(adminPinInput)) {
      setAdminPinError(null);
      setAdminPinInput('');
    } else {
      setAdminPinError('รหัสผ่านไม่ถูกต้อง (กรุณากรอกรหัสผ่าน Admin)');
    }
  };

  const currentImage = previewUrl || images[activeEditingTarget];
  const targetInfo = TARGET_LABELS[activeEditingTarget];
  const presets = PRESET_LIBRARY[activeEditingTarget] || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WEBP, etc.)');
        return;
      }

      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawResult = event.target?.result as string;
        if (rawResult) {
          try {
            const compressed = await compressImageDataUrl(rawResult, 900, 900, 0.75);
            setPreviewUrl(compressed);
          } catch {
            setPreviewUrl(rawResult);
          }
        }
        setIsProcessing(false);
      };
      reader.onerror = () => setIsProcessing(false);
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (!inputUrl.trim()) return;
    setPreviewUrl(inputUrl.trim());
  };

  const handleSave = async () => {
    const finalUrl = previewUrl || (activeTab === 'url' ? inputUrl.trim() : null);
    if (!finalUrl) return;

    setIsProcessing(true);
    if (isAddingToSlideshow) {
      await addCustomSlide(
        slideTitle || `รูปภาพ ${targetInfo.name}`,
        slideSubtitle || 'TRIPLETS Slideshow Gallery',
        finalUrl
      );
    } else {
      await updateImage(activeEditingTarget, finalUrl);
    }
    setIsProcessing(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setPreviewUrl(null);
      setInputUrl('');
      setSlideTitle('');
      setSlideSubtitle('');
      if (isAddingToSlideshow) {
        setIsAddingToSlideshow(false);
        setActiveTab('slideshow_list');
      }
    }, 1200);
  };

  const handleResetCurrent = () => {
    resetImage(activeEditingTarget);
    setPreviewUrl(null);
    setInputUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal Bar */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600/20 border border-red-500/30 rounded-xl text-red-500">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>จัดการรูปภาพศิลปิน & เวที</span>
                <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
                  ADMIN ONLY
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                เพิ่ม เปลี่ยน อัปโหลด และแก้ไขรูปภาพศิลปินวง TRIPLETS ได้ด้วยตนเอง
              </p>
            </div>
          </div>

          <button
            onClick={closeImageEditor}
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
                การแก้ไขและอัปโหลดรูปภาพศิลปินหรือแบนเนอร์เวที สงวนสิทธิ์สำหรับ Admin เท่านั้น กรุณากรอกรหัสผ่าน Admin PIN เพื่อปลดล็อก
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
                  onClick={closeImageEditor}
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
          <>
            {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-12 gap-6">
          
          {/* Left Column: Select Artist / Banner Target */}
          <div className="md:col-span-4 space-y-3 border-r border-neutral-800/80 pr-0 md:pr-4">
            <label className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider block">
              เลือกหัวข้อที่ต้องการเปลี่ยนรูป:
            </label>

            <div className="space-y-1.5">
              {(Object.keys(TARGET_LABELS) as Array<keyof BandImageMap>).map((key) => {
                const isSelected = activeEditingTarget === key;
                const info = TARGET_LABELS[key];

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveEditingTarget(key);
                      setPreviewUrl(null);
                      setInputUrl('');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/80 to-neutral-900 border-red-500 text-white shadow-md'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={images[key]}
                        alt={info.name}
                        className="w-8 h-8 rounded-lg object-cover border border-neutral-700 flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">{info.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono truncate">{info.role}</div>
                      </div>
                    </div>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={resetAllImages}
                className="w-full text-xs text-neutral-400 hover:text-red-400 bg-neutral-950 border border-neutral-800 hover:border-red-900/60 p-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตรูปทั้งหมดกลับค่าเริ่มต้น</span>
              </button>
            </div>
          </div>

          {/* Right Column: Upload / URL / Presets Control */}
          <div className="md:col-span-8 space-y-5">
            
            {/* Current Target Title Banner */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase">
                  กำลังแก้ไข: {targetInfo.role}
                </span>
                <h4 className="text-sm font-bold text-white">{targetInfo.name}</h4>
                <p className="text-[11px] text-neutral-400">{targetInfo.desc}</p>
              </div>

              {previewUrl && (
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full self-start sm:self-auto">
                  มีพรีวิวใหม่
                </span>
              )}
            </div>

            {/* Recommended Image Dimensions Notice Box */}
            <div className="bg-neutral-950/90 border border-red-950/80 rounded-xl p-3 space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>💡 คำแนะนำขนาดรูปภาพที่เหมาะสม (Recommended Image Dimensions):</span>
              </div>
              <ul className="text-[11px] space-y-1 font-mono text-neutral-400 list-disc list-inside pl-1">
                <li><strong className="text-white">ปกเล่นเพลง / สไลด์โชว์หลัก:</strong> แนะนำสัดส่วน <span className="text-red-400 font-bold">1:1 (จัตุรัส)</span> เช่น <span className="text-white font-bold">1000 × 1000 px</span> หรือ <span className="text-white font-bold">800 × 800 px</span></li>
                <li><strong className="text-white">รูปภาพแนวนอน / เวทีคอนเสิร์ต:</strong> สัดส่วน <span className="text-red-400 font-bold">16:9</span> เช่น <span className="text-white font-bold">1280 × 720 px</span> ขึ้นไป</li>
                <li><strong className="text-white">ไฟล์ที่รองรับ:</strong> JPG, PNG, WEBP, GIF (ระบบย่อขนาดไฟล์อัตโนมัติ)</li>
              </ul>
            </div>

            {/* Input Mode Tabs */}
            <div className="flex flex-wrap border-b border-neutral-800 text-xs font-medium gap-y-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`pb-2.5 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-red-500 text-red-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>อัปโหลดจากเครื่อง</span>
              </button>

              <button
                onClick={() => setActiveTab('url')}
                className={`pb-2.5 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'url'
                    ? 'border-red-500 text-red-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>ใส่ลิงก์รูปภาพ (URL)</span>
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`pb-2.5 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'presets'
                    ? 'border-red-500 text-red-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>คลังรูปพรีเซ็ต</span>
              </button>

              <button
                onClick={() => setActiveTab('slideshow_list')}
                className={`pb-2.5 px-3.5 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ml-auto ${
                  activeTab === 'slideshow_list'
                    ? 'border-red-500 text-red-400 font-bold bg-red-950/40 rounded-t-lg'
                    : 'border-transparent text-red-400 hover:text-red-300'
                }`}
              >
                <Images className="w-3.5 h-3.5 text-red-400" />
                <span>จัดการสไลด์โชว์ ({slideshowList.length} รูป)</span>
              </button>
            </div>

            {/* Slide Add Toggle Box (For Upload / URL tabs) */}
            {(activeTab === 'upload' || activeTab === 'url') && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-200">
                  <input
                    type="checkbox"
                    checked={isAddingToSlideshow}
                    onChange={(e) => setIsAddingToSlideshow(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 text-red-600 focus:ring-red-500 bg-neutral-900 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-red-400">
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มรูปนี้เป็นสไลด์ใหม่ในเครื่องเล่นเพลง (Slideshow)</span>
                  </span>
                </label>

                {isAddingToSlideshow && (
                  <div className="grid sm:grid-cols-2 gap-2 pt-1 animate-fadeIn">
                    <input
                      type="text"
                      value={slideTitle}
                      onChange={(e) => setSlideTitle(e.target.value)}
                      placeholder="ชื่อรูปภาพ (เช่น วิน ร้องสดคอนเสิร์ตใหญ่)"
                      className="bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={slideSubtitle}
                      onChange={(e) => setSlideSubtitle(e.target.value)}
                      placeholder="คำบรรยายย่อย (เช่น Live at Thunder Dome)"
                      className="bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tab Contents */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const pseudoEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                      handleFileUpload(pseudoEvent);
                    }
                  }}
                  className="border-2 border-dashed border-neutral-700 hover:border-red-500 bg-neutral-950/80 hover:bg-neutral-950 rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 group-hover:border-red-500/50 flex items-center justify-center mx-auto text-neutral-400 group-hover:text-red-400 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">คลิกหรือลากวางไฟล์รูปภาพจากอุปกรณ์ของคุณ (Drag & Drop)</p>
                    <p className="text-[10px] text-neutral-400 mt-1">รองรับไฟล์ JPG, PNG, WEBP, GIF (ระบบย่อขนาดอัตโนมัติ)</p>
                  </div>
                </div>

                {previewUrl && (
                  <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-emerald-700" />
                      <div>
                        <div className="text-xs font-bold text-emerald-300">เลือกรูปภาพเรียบร้อยแล้ว</div>
                        <div className="text-[10px] text-emerald-400/80">กดปุ่ม "ใช้รูปนี้ทันที" ด้านล่างเพื่อแสดงผลบนเว็บ</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>บันทึกรูป</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-3">
                <label className="text-xs text-neutral-300 block">วางลิงก์รูปภาพ (Image Address):</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/artist-photo.jpg"
                    className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={handleApplyUrl}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    ดูตัวอย่าง
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'presets' && (
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">เลือกรูปพรีเซ็ตคุณภาพสูง:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => setPreviewUrl(preset.url)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                        previewUrl === preset.url || images[activeEditingTarget] === preset.url
                          ? 'border-red-500 ring-2 ring-red-500/50'
                          : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 flex items-end">
                        <span className="text-[10px] font-medium text-white truncate">{preset.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'slideshow_list' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-300 block font-bold">
                    รายการรูปภาพที่อยู่ในสไลด์โชว์ทั้งหมด ({slideshowList.length} รูป):
                  </label>
                  <button
                    type="button"
                    onClick={resetSlideshowList}
                    className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รีเซ็ตสไลด์ทั้งหมด</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                  {slideshowList.map((item) => (
                    <div
                      key={item.id}
                      className="relative bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden group flex flex-col justify-between"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => deleteSlide(item.id)}
                          className="absolute top-1.5 right-1.5 bg-neutral-950/80 hover:bg-red-600 text-white p-1.5 rounded-lg border border-neutral-700 hover:border-red-500 transition-all cursor-pointer"
                          title={`ลบ "${item.title}" ออกจากสไลด์โชว์`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-2 space-y-0.5">
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{item.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview & Actions Box */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-neutral-700 flex-shrink-0 bg-neutral-900">
                  <img
                    src={currentImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {previewUrl && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                    <span>ตัวอย่างรูปภาพที่จะใช้</span>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    {previewUrl ? 'พร้อมแสดงผลบนเว็บไซต์ทันที' : 'ใช้อยู่ปัจจุบันในระบบ'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleResetCurrent}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-semibold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>คืนค่ารูปเดิม</span>
                </button>

                <button
                  onClick={handleSave}
                  disabled={isProcessing || (!previewUrl && activeTab !== 'url')}
                  className={`font-bold px-5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    saveSuccess
                      ? 'bg-emerald-600 text-white'
                      : isProcessing
                      ? 'bg-neutral-800 text-neutral-400 cursor-wait'
                      : previewUrl || (activeTab === 'url' && inputUrl)
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/60'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      <span>กำลังประมวลผลรูป...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>บันทึกเรียบร้อย!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ใช้รูปนี้ทันที</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>* รูปภาพที่อัปโหลดจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณ (Admin Mode)</span>
          <button
            onClick={closeImageEditor}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง [ESC]
          </button>
        </div>
        </>
        )}

      </div>
    </div>
  );
};
