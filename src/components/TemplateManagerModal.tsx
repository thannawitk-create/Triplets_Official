import React, { useState, useRef } from 'react';
import { 
  X, 
  Layout, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Layers, 
  Trash2, 
  FileCode, 
  Music, 
  Image as ImageIcon, 
  Camera, 
  FolderDown, 
  AlertCircle,
  FileJson,
  Plus,
  Play,
  Copy,
  ChevronRight,
  Lock,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { useSongs } from '../context/SongContext';
import { useBandImages, BandImageMap } from '../context/ImageContext';
import { PRESET_TEMPLATES, BLANK_STARTER_SONGS } from '../data/templatePresets';
import { BandTemplateData } from '../types';
import { BLANK_PLACEHOLDER_IMAGES } from '../utils/placeholderImages';

export const TemplateManagerModal: React.FC = () => {
  const {
    isTemplateModalOpen,
    closeTemplateModal,
    isAdmin,
    loginAdmin,
    songs,
    setAllSongs,
    setBlankSongs,
    clearAllSongs,
    bandInfo,
    updateBandInfo,
    albumInfo,
    updateAlbumInfo,
    members,
    updateMember,
    savedTemplates,
    saveCurrentAsTemplate,
    deleteSavedTemplate,
    loadTemplate,
    applyBlankDesignTemplate,
    resetToDefaultTemplate,
    exportTemplateAsJsonFile,
  } = useSongs();

  const { images, setAllImages, slideshowList, setSlideshowItems, openImageEditor } = useBandImages();

  const [activeTab, setActiveTab] = useState<'presets' | 'save' | 'import_replace' | 'band_info'>('presets');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [modalPinInput, setModalPinInput] = useState('');
  const [modalPinError, setModalPinError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isTemplateModalOpen) return null;

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(modalPinInput)) {
      setModalPinError(null);
      setModalPinInput('');
    } else {
      setModalPinError('รหัสผ่านไม่ถูกต้อง (กรุณากรอกรหัสผ่าน Admin)');
    }
  };

  const handleApplyPreset = (preset: BandTemplateData) => {
    if (!isAdmin) {
      alert('สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
      return;
    }
    if (confirm(`คุณต้องการโหลดเทมเพลต "${preset.templateName}" ใช่หรือไม่? (ข้อมูลปัจจุบันจะถูกแทนที่ด้วยเทมเพลตนี้)`)) {
      loadTemplate(preset, setAllImages, setSlideshowItems);
      setSaveSuccessMessage(`โหลดเทมเพลต "${preset.templateName}" สำเร็จ!`);
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  const handleApplyBlank = () => {
    if (!isAdmin) {
      alert('สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
      return;
    }
    if (confirm('คุณต้องการทำเพลงและภาพเป็นค่าว่างทั้งหมด (โครงร่างสำหรับออกแบบ) ใช่หรือไม่?')) {
      applyBlankDesignTemplate(setAllImages);
      setSaveSuccessMessage('ตั้งค่าเพลงและรูปภาพเป็นค่าว่างสำหรับออกแบบเรียบร้อย!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  const handleResetDefault = () => {
    if (!isAdmin) {
      alert('สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
      return;
    }
    if (confirm('คุณต้องการคืนค่าทั้งหมดเป็นเทมเพลตวง TRIPLETS ดั้งเดิมใช่หรือไม่?')) {
      resetToDefaultTemplate(setAllImages);
      setSaveSuccessMessage('คืนค่าเป็นเทมเพลตเริ่มต้นเรียบร้อยแล้ว!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น');
      return;
    }
    if (!templateName.trim()) {
      alert('กรุณากรอกชื่อเทมเพลต');
      return;
    }

    const savedMeta = saveCurrentAsTemplate(
      templateName,
      templateDescription || `บันทึกเมื่อ ${new Date().toLocaleDateString('th-TH')}`,
      images,
      slideshowList
    );

    setTemplateName('');
    setTemplateDescription('');
    setSaveSuccessMessage(`บันทึกเทมเพลต "${savedMeta.name}" เรียบร้อยแล้ว!`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
      setActiveTab('presets');
    }, 1500);
  };

  const handleExportCurrent = () => {
    const currentTemplateData: BandTemplateData = {
      version: '1.0',
      templateId: `tpl-export-${Date.now()}`,
      templateName: templateName.trim() || `${bandInfo.name} Custom Template`,
      templateDescription: templateDescription.trim() || `ส่งออกเมื่อ ${new Date().toLocaleString('th-TH')}`,
      createdAt: new Date().toISOString(),
      bandInfo,
      albumInfo,
      members,
      images,
      slideshowList,
      songs,
    };

    exportTemplateAsJsonFile(currentTemplateData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Validation check
        if (!parsed.songs && !parsed.images && !Array.isArray(parsed)) {
          throw new Error('รูปแบบไฟล์เทมเพลต JSON ไม่ถูกต้อง (ต้องมี songs หรือ images)');
        }

        const templateData: BandTemplateData = {
          version: parsed.version || '1.0',
          templateId: parsed.templateId || `tpl-imported-${Date.now()}`,
          templateName: parsed.templateName || file.name.replace(/\.json$/i, ''),
          templateDescription: parsed.templateDescription || `นำเข้าจากไฟล์ ${file.name}`,
          createdAt: parsed.createdAt || new Date().toISOString(),
          bandInfo: parsed.bandInfo || bandInfo,
          albumInfo: parsed.albumInfo || albumInfo,
          members: parsed.members || members,
          images: parsed.images || images,
          slideshowList: parsed.slideshowList || slideshowList,
          songs: Array.isArray(parsed) ? parsed : (parsed.songs || songs),
        };

        loadTemplate(templateData, setAllImages, setSlideshowItems);
        setSaveSuccessMessage(`นำเข้าเทมเพลตจากไฟล์ "${file.name}" สำเร็จแล้ว!`);
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      } catch (err: any) {
        setImportError(`ไม่สามารถนำเข้าไฟล์ได้: ${err.message || 'ไฟล์ JSON เสียหาย'}`);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteJsonImport = () => {
    if (!importJsonText.trim()) return;
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText.trim());
      const templateData: BandTemplateData = {
        version: parsed.version || '1.0',
        templateId: parsed.templateId || `tpl-pasted-${Date.now()}`,
        templateName: parsed.templateName || 'เทมเพลตที่วางโค้ด JSON',
        templateDescription: parsed.templateDescription || 'นำเข้าจาก JSON Text',
        createdAt: new Date().toISOString(),
        bandInfo: parsed.bandInfo || bandInfo,
        albumInfo: parsed.albumInfo || albumInfo,
        members: parsed.members || members,
        images: parsed.images || images,
        slideshowList: parsed.slideshowList || slideshowList,
        songs: Array.isArray(parsed) ? parsed : (parsed.songs || songs),
      };

      loadTemplate(templateData, setAllImages, setSlideshowItems);
      setImportJsonText('');
      setSaveSuccessMessage('นำเข้าข้อมูล JSON สำเร็จเรียบร้อยแล้ว!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    } catch (err: any) {
      setImportError(`รูปแบบ JSON ไม่ถูกต้อง: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal Bar */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600/20 border border-red-500/30 rounded-xl text-red-500">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>จัดการเทมเพลต & ออกแบบเว็บวง</span>
                <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
                  ADMIN ONLY
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                ทำเป็นค่าว่างตอนออกแบบ • นำเข้าแทนที่เพลงและรูปภาพ • บันทึกเป็นเทมเพลต
              </p>
            </div>
          </div>

          <button
            onClick={closeTemplateModal}
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
                ระบบจัดการเทมเพลต โหมดออกแบบโครงร่างว่าง และการนำเข้าแทนที่ข้อมูล เป็นฟังก์ชันระดับผู้ดูแลระบบ (Admin) กรุณากรอกรหัสผ่าน Admin PIN เพื่อปลดล็อก
              </p>
            </div>

            <form onSubmit={handleUnlockAdmin} className="max-w-xs mx-auto space-y-3 pt-2">
              <div className="relative">
                <input
                  type="password"
                  maxLength={10}
                  value={modalPinInput}
                  onChange={(e) => setModalPinInput(e.target.value)}
                  placeholder="กรอกรหัสผ่าน Admin PIN"
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-xl px-4 py-2.5 text-center font-mono text-base text-white focus:outline-none shadow-inner"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {modalPinError && (
                <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{modalPinError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={closeTemplateModal}
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
            {/* Global Success Notification Alert */}
            {saveSuccessMessage && (
              <div className="bg-emerald-950/90 border-b border-emerald-800 text-emerald-300 text-xs px-5 py-2.5 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{saveSuccessMessage}</span>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3.5 flex items-center gap-2 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'presets'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>คลังเทมเพลต ({PRESET_TEMPLATES.length + savedTemplates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('save')}
            className={`pb-2.5 px-3.5 flex items-center gap-2 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'save'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกเป็น Template</span>
          </button>

          <button
            onClick={() => setActiveTab('import_replace')}
            className={`pb-2.5 px-3.5 flex items-center gap-2 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'import_replace'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>นำเข้า & เคลียร์ค่าว่าง</span>
          </button>

          <button
            onClick={() => setActiveTab('band_info')}
            className={`pb-2.5 px-3.5 flex items-center gap-2 border-b-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'band_info'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ข้อมูลวง & อัลบั้ม</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: PRESETS & SAVED TEMPLATES */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              
              {/* Quick Blank Template Banner */}
              <div className="bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 border border-red-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-red-400 bg-red-950 border border-red-700/80 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>โหมดโครงร่างเปล่าสำหรับออกแบบ (Design Blank Starter)</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    ทำเพลง + รูปภาพ ทั้งหมดเป็นค่าว่าง (Placeholder)
                  </h4>
                  <p className="text-xs text-neutral-300">
                    เตรียมกรอบและช่องใส่เพลง พร้อมกรอบรูปโลโก้ ปก และสมาชิก ให้คุณอัปโหลดใส่รูปและเพลงจริงได้อย่างเป็นระเบียบ
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleApplyBlank}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-red-950 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Layout className="w-3.5 h-3.5" />
                    <span>ใช้โครงร่างเปล่าทันที</span>
                  </button>

                  <button
                    onClick={handleResetDefault}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs px-3 py-2 rounded-xl border border-neutral-700 transition-colors cursor-pointer flex items-center gap-1"
                    title="คืนค่าเป็นวง TRIPLETS ต้นฉบับ"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ต้นฉบับ</span>
                  </button>
                </div>
              </div>

              {/* Built-in Preset Templates Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  เทมเพลตมาตรฐานสำเร็จรูป (Built-in Presets):
                </h4>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {PRESET_TEMPLATES.map((preset) => (
                    <div
                      key={preset.templateId}
                      className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded-full font-bold">
                            {preset.songs.length} เพลงในอัลบั้ม
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            v{preset.version}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                          {preset.templateName}
                        </h5>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {preset.templateDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                        <span className="text-[10px] text-neutral-500 font-mono">
                          วง: {preset.bandInfo?.name || 'Custom Band'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className="bg-neutral-800 hover:bg-red-600 text-neutral-200 hover:text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>โหลดเทมเพลตนี้</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Saved Templates Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                    เทมเพลตที่คุณบันทึกไว้ ({savedTemplates.length}):
                  </h4>
                  <button
                    onClick={() => setActiveTab('save')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>บันทึกสถานะปัจจุบันเป็น Template ใหม่</span>
                  </button>
                </div>

                {savedTemplates.length === 0 ? (
                  <div className="bg-neutral-950/60 border border-dashed border-neutral-800 rounded-xl p-6 text-center text-xs text-neutral-400 space-y-2">
                    <Save className="w-6 h-6 text-neutral-600 mx-auto" />
                    <p>ยังไม่มีเทมเพลตที่บันทึกไว้ในเบราว์เซอร์นี้</p>
                    <button
                      onClick={() => setActiveTab('save')}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      กดที่นี่เพื่อบันทึกเทมเพลตแรกของคุณ
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {savedTemplates.map((item) => (
                      <div
                        key={item.id}
                        className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
                              {item.songCount} เพลง
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {item.savedAt}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white">
                            {item.name}
                          </h5>
                          <p className="text-xs text-neutral-400">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
                          <button
                            onClick={() => exportTemplateAsJsonFile(item.data)}
                            className="text-neutral-400 hover:text-white p-1.5 bg-neutral-900 rounded-lg border border-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                            title="ดาวน์โหลดไฟล์ JSON (.json)"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-400" />
                            <span>Export</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => deleteSavedTemplate(item.id)}
                              className="text-neutral-400 hover:text-red-400 p-1.5 bg-neutral-900 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                              title="ลบเทมเพลตนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleApplyPreset(item.data)}
                              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              โหลดใช้งาน
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SAVE CURRENT AS TEMPLATE & EXPORT */}
          {activeTab === 'save' && (
            <div className="space-y-6">
              
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Save className="w-4 h-4 text-red-500" />
                    <span>บันทึกการออกแบบปัจจุบันเป็น Template ใหม่</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    บันทึกรูปภาพทั้งหมด ({Object.keys(images).length} รูป), รายชื่อเพลงทั้งหมด ({songs.length} เพลง), และข้อมูลวง เพื่อนำกลับมาใช้ใหม่ได้ตลอดเวลา
                  </p>
                </div>

                <form onSubmit={handleSaveTemplate} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      ชื่อเทมเพลต (Template Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="เช่น My Custom Band 2026, หรือ Single Launch Template"
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      คำอธิบายเทมเพลต (Description)
                    </label>
                    <textarea
                      rows={2}
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="อธิบายรายละเอียดสั้นๆ เช่น โทนสีเข้ม สำหรับเปิดตัวซิงเกิลใหม่..."
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 text-xs space-y-1 text-neutral-400 font-mono">
                    <div className="text-white font-bold mb-1">สิ่งที่รวมอยู่ใน Template นี้:</div>
                    <div>✓ รูปภาพทั้งหมด (Logo, Stage, Album Cover, สมาชิก 4 คน)</div>
                    <div>✓ รายชื่อเพลงทั้งหมด ({songs.length} เพลง พร้อมเนื้อเพลงและคอร์ด)</div>
                    <div>✓ ข้อมูลวงดนตรี ({bandInfo.name}) และข้อมูลอัลบั้ม ({albumInfo.titleThai})</div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleExportCurrent}
                      className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>ดาวน์โหลดเป็นไฟล์ JSON (.json)</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-red-950/60 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึก Template</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 3: IMPORT & QUICK MEDIA REPLACEMENT HUB */}
          {activeTab === 'import_replace' && (
            <div className="space-y-6">
              
              {/* Quick Blank Actions Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <Music className="w-4 h-4 text-red-500" />
                    <span>จัดการเพลง (Songs Manager)</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    ปัจจุบันมี <strong className="text-white">{songs.length} เพลง</strong> ในอัลบั้ม
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={setBlankSongs}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-200 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ใส่ 2 เพลงร่างว่าง (Blank Slots)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('คุณต้องการลบเพลงทั้งหมดออกใช่หรือไม่?')) clearAllSongs();
                      }}
                      className="bg-neutral-900 hover:bg-red-950 border border-neutral-700 hover:border-red-800 text-red-400 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ล้างเป็น 0 เพลง
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                    <span>จัดการรูปภาพ (Images Manager)</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    ตั้งค่ารูปภาพทั้งหมดเป็นกรอบ Placeholder สำหรับนำเข้าแทนที่
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAllImages(BLANK_PLACEHOLDER_IMAGES);
                        setSaveSuccessMessage('เปลี่ยนรูปทั้งหมดเป็นกรอบโครงร่างเปล่าเรียบร้อยแล้ว');
                        setTimeout(() => setSaveSuccessMessage(null), 3000);
                      }}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-200 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ทำรูปภาพเป็นค่าว่างทั้งหมด
                    </button>
                    <button
                      type="button"
                      onClick={() => openImageEditor('win')}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-red-400 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>เปิด Image Editor</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Import from JSON File (.json) */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-red-500" />
                    <span>นำเข้าเทมเพลตจากไฟล์ JSON (Import Template File)</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    เลือกไฟล์เทมเพลต <code className="text-red-400 font-mono">.json</code> ที่ส่งออกไว้ เพื่อโหลดการตั้งค่าทั้งหมดเข้ามาแทนที่ในครั้งเดียว
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-700 hover:border-red-500 bg-neutral-900/60 hover:bg-neutral-900 rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 group"
                >
                  <Upload className="w-8 h-8 text-neutral-400 group-hover:text-red-400 mx-auto transition-colors" />
                  <div>
                    <p className="text-xs font-bold text-white">คลิกเพื่อเลือกไฟล์ Template JSON (.json)</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">นำเข้ารูปภาพ เพลง และข้อมูลวงทั้งหมดอัตโนมัติ</p>
                  </div>
                </div>

                {importError && (
                  <div className="bg-red-950/80 border border-red-800 rounded-xl p-3 flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}
              </div>

              {/* Paste JSON Code Box */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-3">
                <label className="text-xs font-mono font-bold text-neutral-300 block">
                  หรือวางโค้ด JSON เทมเพลตที่นี่:
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={`{\n  "templateName": "My Band",\n  "songs": [...],\n  "images": {...}\n}`}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl p-3 text-xs text-neutral-200 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handlePasteJsonImport}
                  disabled={!importJsonText.trim()}
                  className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>นำเข้าข้อมูลจากโค้ด JSON ที่วาง</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: BAND & ALBUM METADATA */}
          {activeTab === 'band_info' && (
            <div className="space-y-5">
              
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>แก้ไขข้อมูลและคอนเซปต์วงดนตรี</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      ชื่อวงดนตรี (Band Name)
                    </label>
                    <input
                      type="text"
                      value={bandInfo.name}
                      onChange={(e) => updateBandInfo({ name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      แนวเพลง (Genre)
                    </label>
                    <input
                      type="text"
                      value={bandInfo.genre}
                      onChange={(e) => updateBandInfo({ genre: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      สโลแกนวง (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      value={bandInfo.taglineThai}
                      onChange={(e) => updateBandInfo({ taglineThai: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      สโลแกนวง (ภาษาอังกฤษ)
                    </label>
                    <input
                      type="text"
                      value={bandInfo.taglineEng}
                      onChange={(e) => updateBandInfo({ taglineEng: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-300 block">
                    ประวัติและเรื่องราวของวง (Band Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={bandInfo.bio}
                    onChange={(e) => updateBandInfo({ bio: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Album Information */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-red-500" />
                  <span>แก้ไขข้อมูลอัลบั้มหลัก</span>
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      ชื่ออัลบั้ม (ภาษาไทย)
                    </label>
                    <input
                      type="text"
                      value={albumInfo.titleThai}
                      onChange={(e) => updateAlbumInfo({ titleThai: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 block">
                      ชื่ออัลบั้ม (ภาษาอังกฤษ)
                    </label>
                    <input
                      type="text"
                      value={albumInfo.titleEng}
                      onChange={(e) => updateAlbumInfo({ titleEng: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-300 block">
                    คำคม / แนวคิดประจำอัลบั้ม (Concept Quote)
                  </label>
                  <input
                    type="text"
                    value={albumInfo.conceptQuote}
                    onChange={(e) => updateAlbumInfo({ conceptQuote: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Members Names quick editor */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white">
                  แก้ไขชื่อและตำแหน่งสมาชิก ({members.length} คน)
                </h4>

                <div className="grid sm:grid-cols-2 gap-3">
                  {members.map((member) => (
                    <div key={member.id} className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-red-400 font-bold uppercase">{member.role}</span>
                        <button
                          type="button"
                          onClick={() => {
                            closeTemplateModal();
                            openImageEditor(member.id as any);
                          }}
                          className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>เปลี่ยนรูป</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={member.nameThai}
                        onChange={(e) => updateMember(member.id, { nameThai: e.target.value })}
                        placeholder="ชื่อสมาชิก"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                      />

                      <input
                        type="text"
                        value={member.roleDescription}
                        onChange={(e) => updateMember(member.id, { roleDescription: e.target.value })}
                        placeholder="คำอธิบายบทบาทหน้าที่"
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-[11px] text-neutral-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <span>* บันทึกเทมเพลตจะถูกเก็บไว้ในอุปกรณ์ของคุณอย่างปลอดภัย (Admin Only)</span>
          <button
            onClick={closeTemplateModal}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
        </>
        )}

      </div>
    </div>
  );
};
