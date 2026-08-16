import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  Instagram, 
  Youtube, 
  Facebook, 
  Heart, 
  Edit2, 
  Check, 
  X, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  Link as LinkIcon, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  User, 
  AlertCircle 
} from 'lucide-react';
import { useBandImages } from '../context/ImageContext';
import { useSongs, DEFAULT_BOOKING_CONTACT, DEFAULT_QUICK_LINKS } from '../context/SongContext';
import { CustomContactItem, FooterQuickLink } from '../types';
import { BAND_INFO } from '../data/bandData';
import { handleImageLoadError } from '../utils/placeholderImages';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const { images } = useBandImages();
  const { bookingContact, updateBookingContact, resetBookingContact, isAdmin } = useSongs();

  // Contact Box Edit State
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    title: bookingContact.title || 'ติดต่องานแสดง & สปอนเซอร์',
    isVisible: bookingContact.isVisible !== false,
    phone: bookingContact.phone || '',
    email: bookingContact.email || '',
    line: bookingContact.line || '',
    customItems: (bookingContact.customItems || []) as CustomContactItem[],
  });

  // Quick Links Edit State
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [linksForm, setLinksForm] = useState({
    title: bookingContact.quickLinksTitle || 'ลิงก์ด่วน (QUICK LINKS)',
    isVisible: bookingContact.isQuickLinksVisible !== false,
    links: (bookingContact.quickLinks && bookingContact.quickLinks.length > 0 ? bookingContact.quickLinks : DEFAULT_QUICK_LINKS) as FooterQuickLink[],
  });

  // Brand Bio & Socials Edit State
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioForm, setBioForm] = useState({
    bioText: bookingContact.bioText || BAND_INFO.bio.slice(0, 180),
    facebook: bookingContact.socials?.facebook || BAND_INFO.socials.facebook,
    instagram: bookingContact.socials?.instagram || BAND_INFO.socials.instagram,
    youtube: bookingContact.socials?.youtube || BAND_INFO.socials.youtube,
    tiktok: bookingContact.socials?.tiktok || BAND_INFO.socials.tiktok,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // --- Contact Box Handlers ---
  const handleOpenContactEdit = () => {
    setContactForm({
      title: bookingContact.title || 'ติดต่องานแสดง & สปอนเซอร์',
      isVisible: bookingContact.isVisible !== false,
      phone: bookingContact.phone || '',
      email: bookingContact.email || '',
      line: bookingContact.line || '',
      customItems: [...(bookingContact.customItems || [])],
    });
    setIsEditingContact(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingContact({
      title: contactForm.title.trim() || 'ติดต่องานแสดง & สปอนเซอร์',
      isVisible: contactForm.isVisible,
      phone: contactForm.phone.trim(),
      email: contactForm.email.trim(),
      line: contactForm.line.trim(),
      customItems: contactForm.customItems.filter(item => item.label.trim() || item.value.trim()),
    });
    setIsEditingContact(false);
    showNotification('บันทึกข้อมูลติดต่องานแสดงเรียบร้อยแล้ว');
  };

  const handleAddCustomContact = () => {
    const newItem: CustomContactItem = {
      id: `contact-${Date.now()}`,
      label: 'ติดต่ออื่นๆ',
      value: '',
      type: 'other'
    };
    setContactForm(prev => ({
      ...prev,
      customItems: [...prev.customItems, newItem]
    }));
  };

  const handleDeleteCustomContact = (id: string) => {
    setContactForm(prev => ({
      ...prev,
      customItems: prev.customItems.filter(item => item.id !== id)
    }));
  };

  const handleQuickDeleteField = (field: 'phone' | 'email' | 'line') => {
    if (window.confirm(`คุณต้องการลบข้อมูล "${field === 'phone' ? 'เบอร์โทรศัพท์' : field === 'email' ? 'อีเมล' : 'Line Official'}" ใช่หรือไม่?`)) {
      updateBookingContact({ [field]: '' });
      showNotification('ลบข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleQuickDeleteCustomItem = (id: string, label: string) => {
    if (window.confirm(`คุณต้องการลบข้อมูล "${label || 'รายการนี้'}" ใช่หรือไม่?`)) {
      const remaining = (bookingContact.customItems || []).filter(item => item.id !== id);
      updateBookingContact({ customItems: remaining });
      showNotification('ลบข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleToggleContactVisibility = () => {
    const nextVal = !bookingContact.isVisible;
    updateBookingContact({ isVisible: nextVal });
    showNotification(nextVal ? 'เปิดแสดงกล่องติดต่อแล้ว' : 'ซ่อนกล่องติดต่อเรียบร้อยแล้ว');
  };

  const handleClearAllContact = () => {
    if (window.confirm('คุณต้องการลบข้อมูลการติดต่อทั้งหมดในกล่องนี้ใช่หรือไม่?')) {
      setContactForm(prev => ({
        ...prev,
        phone: '',
        email: '',
        line: '',
        customItems: []
      }));
    }
  };

  const handleResetContact = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลติดต่องานแสดงกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      resetBookingContact();
      setContactForm({
        title: DEFAULT_BOOKING_CONTACT.title,
        isVisible: true,
        phone: DEFAULT_BOOKING_CONTACT.phone || '',
        email: DEFAULT_BOOKING_CONTACT.email || '',
        line: DEFAULT_BOOKING_CONTACT.line || '',
        customItems: [],
      });
      setIsEditingContact(false);
      showNotification('รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นแล้ว');
    }
  };

  // --- Quick Links Handlers ---
  const handleOpenLinksEdit = () => {
    setLinksForm({
      title: bookingContact.quickLinksTitle || 'ลิงก์ด่วน (QUICK LINKS)',
      isVisible: bookingContact.isQuickLinksVisible !== false,
      links: (bookingContact.quickLinks && bookingContact.quickLinks.length > 0 ? bookingContact.quickLinks : DEFAULT_QUICK_LINKS).map(l => ({ ...l })),
    });
    setIsEditingLinks(true);
  };

  const handleSaveLinks = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingContact({
      quickLinksTitle: linksForm.title.trim() || 'ลิงก์ด่วน (QUICK LINKS)',
      isQuickLinksVisible: linksForm.isVisible,
      quickLinks: linksForm.links.filter(l => l.label.trim().length > 0),
    });
    setIsEditingLinks(false);
    showNotification('บันทึกลิงก์ด่วนเรียบร้อยแล้ว');
  };

  const handleAddLink = () => {
    const newLink: FooterQuickLink = {
      id: `link-${Date.now()}`,
      label: 'ลิงก์ใหม่',
      sectionId: 'hero',
    };
    setLinksForm(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
  };

  const handleDeleteLink = (id: string) => {
    setLinksForm(prev => ({
      ...prev,
      links: prev.links.filter(l => l.id !== id)
    }));
  };

  const handleQuickDeleteLink = (id: string, label: string) => {
    if (window.confirm(`คุณต้องการลบลิงก์ "${label}" ใช่หรือไม่?`)) {
      const currentLinks = bookingContact.quickLinks || DEFAULT_QUICK_LINKS;
      const remaining = currentLinks.filter(l => l.id !== id);
      updateBookingContact({ quickLinks: remaining });
      showNotification('ลบลิงก์เรียบร้อยแล้ว');
    }
  };

  const handleResetLinks = () => {
    if (window.confirm('ต้องการรีเซ็ตลิงก์ด่วนกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      updateBookingContact({
        quickLinksTitle: 'ลิงก์ด่วน (QUICK LINKS)',
        isQuickLinksVisible: true,
        quickLinks: DEFAULT_QUICK_LINKS,
      });
      setLinksForm({
        title: 'ลิงก์ด่วน (QUICK LINKS)',
        isVisible: true,
        links: DEFAULT_QUICK_LINKS,
      });
      setIsEditingLinks(false);
      showNotification('รีเซ็ตลิงก์กลับเป็นค่าเริ่มต้นแล้ว');
    }
  };

  // --- Bio & Socials Handlers ---
  const handleOpenBioEdit = () => {
    setBioForm({
      bioText: bookingContact.bioText || BAND_INFO.bio.slice(0, 180),
      facebook: bookingContact.socials?.facebook || BAND_INFO.socials.facebook,
      instagram: bookingContact.socials?.instagram || BAND_INFO.socials.instagram,
      youtube: bookingContact.socials?.youtube || BAND_INFO.socials.youtube,
      tiktok: bookingContact.socials?.tiktok || BAND_INFO.socials.tiktok,
    });
    setIsEditingBio(true);
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingContact({
      bioText: bioForm.bioText.trim(),
      socials: {
        facebook: bioForm.facebook.trim(),
        instagram: bioForm.instagram.trim(),
        youtube: bioForm.youtube.trim(),
        tiktok: bioForm.tiktok.trim(),
      }
    });
    setIsEditingBio(false);
    showNotification('บันทึกข้อมูลวงและโซเชียลเรียบร้อยแล้ว');
  };

  // Active Values
  const isBoxVisible = bookingContact.isVisible !== false;
  const isLinksVisible = bookingContact.isQuickLinksVisible !== false;
  const activeQuickLinks = (bookingContact.quickLinks && bookingContact.quickLinks.length > 0) ? bookingContact.quickLinks : DEFAULT_QUICK_LINKS;
  const activeCustomItems = bookingContact.customItems || [];

  const hasAnyContactData = Boolean(
    bookingContact.phone || 
    bookingContact.email || 
    bookingContact.line || 
    activeCustomItems.length > 0
  );

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 py-16 relative overflow-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* 1. Brand & Bio Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-16 rounded-lg bg-neutral-900 border border-neutral-700/80 p-0.5 shadow-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={images.bandLogo} 
                    alt="TRIPLETS Logo" 
                    onError={(e) => handleImageLoadError(e, 'bandLogo')}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>
                <div>
                  <span className="font-extrabold tracking-wider text-xl text-white uppercase font-mono">
                    TRIPLETS
                  </span>
                  <span className="text-[10px] font-semibold bg-red-600/30 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded ml-2 uppercase">
                    OFFICIAL
                  </span>
                </div>
              </div>

              {isAdmin && !isEditingBio && (
                <button
                  onClick={handleOpenBioEdit}
                  className="text-[11px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-white px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="แก้ไขข้อมูลวงและลิงก์โซเชียล"
                >
                  <Edit2 className="w-3 h-3 text-red-400" />
                  <span>แก้ไข</span>
                </button>
              )}
            </div>

            {!isEditingBio ? (
              <>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  {bookingContact.bioText ? `${bookingContact.bioText}...` : `${BAND_INFO.bio.slice(0, 180)}...`}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  {(bookingContact.socials?.facebook || BAND_INFO.socials.facebook) && (
                    <a href={bookingContact.socials?.facebook || BAND_INFO.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-white transition-colors" title="Facebook">
                      <Facebook className="w-4 h-4 text-blue-500" />
                    </a>
                  )}
                  {(bookingContact.socials?.instagram || BAND_INFO.socials.instagram) && (
                    <a href={bookingContact.socials?.instagram || BAND_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-white transition-colors" title="Instagram">
                      <Instagram className="w-4 h-4 text-pink-500" />
                    </a>
                  )}
                  {(bookingContact.socials?.youtube || BAND_INFO.socials.youtube) && (
                    <a href={bookingContact.socials?.youtube || BAND_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-white transition-colors" title="YouTube">
                      <Youtube className="w-4 h-4 text-red-500" />
                    </a>
                  )}
                </div>
              </>
            ) : (
              /* Inline Bio & Socials Form */
              <form onSubmit={handleSaveBio} className="space-y-3 bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl text-xs animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">คำบรรยายวงย่อ:</label>
                  <textarea
                    rows={3}
                    value={bioForm.bioText}
                    onChange={(e) => setBioForm(prev => ({ ...prev, bioText: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg p-2 text-xs text-white"
                    placeholder="ใส่คำอธิบายวง..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-neutral-400 font-mono">Facebook URL:</label>
                    <input
                      type="text"
                      value={bioForm.facebook}
                      onChange={(e) => setBioForm(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2 py-1 text-[11px] text-white"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-neutral-400 font-mono">Instagram URL:</label>
                    <input
                      type="text"
                      value={bioForm.instagram}
                      onChange={(e) => setBioForm(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2 py-1 text-[11px] text-white"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-neutral-400 font-mono">YouTube URL:</label>
                    <input
                      type="text"
                      value={bioForm.youtube}
                      onChange={(e) => setBioForm(prev => ({ ...prev, youtube: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2 py-1 text-[11px] text-white"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-neutral-400 font-mono">TikTok URL:</label>
                    <input
                      type="text"
                      value={bioForm.tiktok}
                      onChange={(e) => setBioForm(prev => ({ ...prev, tiktok: e.target.value }))}
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2 py-1 text-[11px] text-white"
                      placeholder="https://tiktok.com/..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 text-xs cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Quick Navigation Links Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {bookingContact.quickLinksTitle || 'ลิงก์ด่วน (QUICK LINKS)'}
              </h4>

              {isAdmin && !isEditingLinks && (
                <button
                  onClick={handleOpenLinksEdit}
                  className="text-[11px] bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-white px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="แก้ไขหรือลบลิงก์ด่วน"
                >
                  <Edit2 className="w-3 h-3 text-red-400" />
                  <span>จัดการลิงก์</span>
                </button>
              )}
            </div>

            {!isLinksVisible && isAdmin && (
              <div className="text-[11px] bg-neutral-900 border border-neutral-800 text-amber-400 px-3 py-1.5 rounded-lg">
                🔒 [Admin] ส่วนลิงก์ด่วนถูกซ่อนจากผู้ใช้ทั่วไป
              </div>
            )}

            {isLinksVisible && !isEditingLinks && (
              <ul className="space-y-2 text-xs">
                {activeQuickLinks.map((link) => (
                  <li key={link.id} className="group flex items-center justify-between">
                    {link.customUrl ? (
                      <a 
                        href={link.customUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>{link.label}</span>
                        <LinkIcon className="w-2.5 h-2.5 text-neutral-500" />
                      </a>
                    ) : (
                      <button 
                        onClick={() => onNavigateSection(link.sectionId)} 
                        className="hover:text-red-400 transition-colors cursor-pointer text-left"
                      >
                        {link.label}
                      </button>
                    )}

                    {/* Quick Delete for Admin on Hover */}
                    {isAdmin && (
                      <button
                        onClick={() => handleQuickDeleteLink(link.id, link.label)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-all cursor-pointer"
                        title={`ลบลิงก์ "${link.label}"`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Quick Links Edit Form */}
            {isEditingLinks && (
              <form onSubmit={handleSaveLinks} className="space-y-3 bg-neutral-900/95 border border-neutral-800 p-4 rounded-xl text-xs animate-fadeIn shadow-xl">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">หัวข้อลิงก์ด่วน:</label>
                  <input
                    type="text"
                    value={linksForm.title}
                    onChange={(e) => setLinksForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2 py-1 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="linksVisibleCheckbox"
                    checked={linksForm.isVisible}
                    onChange={(e) => setLinksForm(prev => ({ ...prev, isVisible: e.target.checked }))}
                    className="rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="linksVisibleCheckbox" className="text-[11px] text-neutral-300 cursor-pointer">
                    แสดงส่วนลิงก์ด่วนบนหน้าเว็บ
                  </label>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-[10px] text-neutral-400 font-mono block">รายการลิงก์:</label>
                  {linksForm.links.map((link, idx) => (
                    <div key={link.id} className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...linksForm.links];
                          updated[idx].label = e.target.value;
                          setLinksForm(prev => ({ ...prev, links: updated }));
                        }}
                        className="flex-1 bg-transparent border-0 text-white text-xs px-1 focus:outline-none"
                        placeholder="ชื่อลิงก์"
                      />
                      <select
                        value={link.sectionId}
                        onChange={(e) => {
                          const updated = [...linksForm.links];
                          updated[idx].sectionId = e.target.value;
                          setLinksForm(prev => ({ ...prev, links: updated }));
                        }}
                        className="bg-neutral-900 border border-neutral-700 text-[10px] text-neutral-300 rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        <option value="hero">หน้าหลัก (Hero)</option>
                        <option value="band">สมาชิกวง (Band)</option>
                        <option value="music">เครื่องเล่นเพลง (Music)</option>
                        <option value="fanzone">มุมแฟนคลับ (Fan Zone)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                        title="ลบลิงก์นี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full py-1.5 border border-dashed border-neutral-700 hover:border-red-500 text-neutral-400 hover:text-red-400 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>เพิ่มลิงก์ด่วน</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={handleResetLinks}
                    className="text-[10px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รีเซ็ตค่าเดิม</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsEditingLinks(false)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 text-xs cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* 3. Booking Contact Information Box */}
          <div className="md:col-span-4 bg-neutral-900/80 border border-neutral-800/90 rounded-2xl p-5 space-y-3 relative group shadow-xl">
            
            {/* Box Header & Admin Controls */}
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>{bookingContact.title || 'ติดต่องานแสดง & สปอนเซอร์'}</span>
              </h4>

              {isAdmin && !isEditingContact && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleContactVisibility}
                    className={`text-[11px] p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isBoxVisible 
                        ? 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500' 
                        : 'bg-amber-950/80 border-amber-700 text-amber-300'
                    }`}
                    title={isBoxVisible ? 'ซ่อนกล่องติดต่อจากผู้ใช้' : 'แสดงกล่องติดต่อ'}
                  >
                    {isBoxVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={handleOpenContactEdit}
                    className="flex items-center gap-1 text-[11px] bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-md"
                    title="แก้ไขหรือลบข้อมูลติดต่องานแสดง"
                  >
                    <Edit2 className="w-3 h-3 text-red-400" />
                    <span>จัดการ / ลบ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Hidden Box Notice for Admin */}
            {!isBoxVisible && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-300 text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>กล่องนี้ถูกซ่อนอยู่ (ผู้ใช้ทั่วไปจะไม่เห็น)</span>
                </p>
                {isAdmin && (
                  <button
                    onClick={handleToggleContactVisibility}
                    className="text-[11px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
                  >
                    คลิกที่นี่เพื่อเปิดแสดงอีกครั้ง
                  </button>
                )}
              </div>
            )}

            {/* Normal Display View (When not editing & box is visible) */}
            {isBoxVisible && !isEditingContact && (
              <div className="space-y-2.5 text-xs text-neutral-300 pt-1">
                
                {/* Phone row */}
                {bookingContact.phone && (
                  <div className="group/row flex items-center justify-between">
                    <p className="flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      <span>เบอร์โทร: <strong className="text-white select-all">{bookingContact.phone}</strong></span>
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => handleQuickDeleteField('phone')}
                        className="opacity-0 group-hover/row:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-all cursor-pointer"
                        title="ลบเบอร์โทรศัพท์"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Email row */}
                {bookingContact.email && (
                  <div className="group/row flex items-center justify-between">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      <span>อีเมล: <strong className="text-white select-all">{bookingContact.email}</strong></span>
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => handleQuickDeleteField('email')}
                        className="opacity-0 group-hover/row:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-all cursor-pointer"
                        title="ลบอีเมล"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Line Official row */}
                {bookingContact.line && (
                  <div className="group/row flex items-center justify-between">
                    <p className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      <span>Line Official: <strong className="text-emerald-400 select-all">{bookingContact.line}</strong></span>
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => handleQuickDeleteField('line')}
                        className="opacity-0 group-hover/row:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-all cursor-pointer"
                        title="ลบ Line Official"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Custom contact items */}
                {activeCustomItems.map(item => (
                  <div key={item.id} className="group/row flex items-center justify-between">
                    <p className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      <span>{item.label}: <strong className="text-white select-all">{item.value}</strong></span>
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => handleQuickDeleteCustomItem(item.id, item.label)}
                        className="opacity-0 group-hover/row:opacity-100 text-neutral-500 hover:text-red-400 p-1 transition-all cursor-pointer"
                        title={`ลบ ${item.label}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {!hasAnyContactData && (
                  <div className="text-center py-3 text-neutral-500 text-xs italic">
                    (ไม่มีข้อมูลการติดต่อ — Admin สามารถกดปุ่ม "จัดการ / ลบ" เพื่อเพิ่มข้อมูลใหม่)
                  </div>
                )}
              </div>
            )}

            {/* Admin Full Edit / Delete Form */}
            {isEditingContact && (
              <form onSubmit={handleSaveContact} className="space-y-3.5 pt-2 text-xs border-t border-neutral-800/80 animate-fadeIn">
                
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">หัวข้อกล่องติดต่อ:</label>
                  <input
                    type="text"
                    value={contactForm.title}
                    onChange={(e) => setContactForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="ติดต่องานแสดง & สปอนเซอร์"
                  />
                </div>

                <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                  <input
                    type="checkbox"
                    id="contactVisibleCheckbox"
                    checked={contactForm.isVisible}
                    onChange={(e) => setContactForm(prev => ({ ...prev, isVisible: e.target.checked }))}
                    className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="contactVisibleCheckbox" className="text-[11px] text-neutral-300 cursor-pointer select-none">
                    แสดงกล่องติดต่อบนหน้าเว็บไซต์
                  </label>
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-neutral-400" />
                      <span>เบอร์โทรศัพท์:</span>
                    </label>
                    {contactForm.phone && (
                      <button
                        type="button"
                        onClick={() => setContactForm(prev => ({ ...prev, phone: '' }))}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>ล้างค่า</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="081-987-6543 (คุณนก - Manager)"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      <span>อีเมล:</span>
                    </label>
                    {contactForm.email && (
                      <button
                        type="button"
                        onClick={() => setContactForm(prev => ({ ...prev, email: '' }))}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>ล้างค่า</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="booking@tripletsband.com"
                  />
                </div>

                {/* Line Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-neutral-400" />
                      <span>Line Official:</span>
                    </label>
                    {contactForm.line && (
                      <button
                        type="button"
                        onClick={() => setContactForm(prev => ({ ...prev, line: '' }))}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>ล้างค่า</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={contactForm.line}
                    onChange={(e) => setContactForm(prev => ({ ...prev, line: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="@tripletsbooking"
                  />
                </div>

                {/* Custom items */}
                {contactForm.customItems.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <label className="text-[10px] text-neutral-400 font-mono block">ช่องทางติดต่อเพิ่มเติม:</label>
                    {contactForm.customItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...contactForm.customItems];
                            updated[idx].label = e.target.value;
                            setContactForm(prev => ({ ...prev, customItems: updated }));
                          }}
                          className="w-1/3 bg-neutral-900 border border-neutral-700 rounded px-1.5 py-1 text-[11px] text-white"
                          placeholder="ชื่อหัวข้อ (เช่น WhatsApp)"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const updated = [...contactForm.customItems];
                            updated[idx].value = e.target.value;
                            setContactForm(prev => ({ ...prev, customItems: updated }));
                          }}
                          className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-1.5 py-1 text-[11px] text-white"
                          placeholder="ข้อมูลติดต่อ"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomContact(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                          title="ลบช่องนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom item button */}
                <button
                  type="button"
                  onClick={handleAddCustomContact}
                  className="w-full py-1.5 border border-dashed border-neutral-700 hover:border-red-500 text-neutral-400 hover:text-red-400 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>เพิ่มช่องทางติดต่อใหม่</span>
                </button>

                {/* Form Action Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleClearAllContact}
                      className="text-[10px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                      <span>ล้างข้อมูลทั้งหมด</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetContact}
                      className="text-[10px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>รีเซ็ตค่าเดิม</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingContact(false)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>ยกเลิก</span>
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>บันทึกข้อมูล</span>
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>

        </div>

        {/* Bottom Copyright Notice */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <p>© {new Date().getFullYear()} TRIPLETS Band. All Rights Reserved. Studio Tri-Eage Official.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for TRIPLETS Fan Club with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
          </p>
        </div>

      </div>

    </footer>
  );
};
