import React, { useState } from 'react';
import { BAND_INFO } from '../data/bandData';
import { PhoneCall, Mail, MessageSquare, Instagram, Youtube, Facebook, Heart, Edit2, Check, X, RotateCcw } from 'lucide-react';
import { useBandImages } from '../context/ImageContext';
import { useSongs } from '../context/SongContext';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const { images } = useBandImages();
  const { bookingContact, updateBookingContact, resetBookingContact, isAdmin } = useSongs();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: bookingContact.title || 'ติดต่องานแสดง & สปอนเซอร์',
    phone: bookingContact.phone,
    email: bookingContact.email,
    line: bookingContact.line,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenEdit = () => {
    setFormData({
      title: bookingContact.title || 'ติดต่องานแสดง & สปอนเซอร์',
      phone: bookingContact.phone,
      email: bookingContact.email,
      line: bookingContact.line,
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingContact(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลติดต่องานแสดงกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      resetBookingContact();
      setFormData({
        title: 'ติดต่องานแสดง & สปอนเซอร์',
        phone: BAND_INFO.bookingContact.phone,
        email: BAND_INFO.bookingContact.email,
        line: BAND_INFO.bookingContact.line,
      });
      setIsEditing(false);
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 py-16 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Bio Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-16 rounded-lg bg-neutral-900 border border-neutral-700/80 p-0.5 shadow-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={images.bandLogo} 
                  alt="TRIPLETS Logo" 
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

            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {BAND_INFO.bio.slice(0, 180)}...
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a href={BAND_INFO.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-white transition-colors">
                <Facebook className="w-4 h-4 text-blue-500" />
              </a>
              <a href={BAND_INFO.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-white transition-colors">
                <Instagram className="w-4 h-4 text-pink-500" />
              </a>
              <a href={BAND_INFO.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:text-white transition-colors">
                <Youtube className="w-4 h-4 text-red-500" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              ลิงก์ด่วน (QUICK LINKS)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateSection('hero')} className="hover:text-red-400 transition-colors cursor-pointer">
                  หน้าหลัก (Home)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('band')} className="hover:text-red-400 transition-colors cursor-pointer">
                  สมาชิกวง TRIPLETS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('music')} className="hover:text-red-400 transition-colors cursor-pointer">
                  ฟังเพลงในอัลบั้ม "หากวันนั้น..."
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('fanzone')} className="hover:text-red-400 transition-colors cursor-pointer">
                  มุมแฟนคลับ (Fan Zone)
                </button>
              </li>
            </ul>
          </div>

          {/* Booking Contact Information Box */}
          <div className="md:col-span-4 bg-neutral-900/80 border border-neutral-800/90 rounded-2xl p-5 space-y-3 relative group">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-red-500" />
                <span>{bookingContact.title || 'ติดต่องานแสดง & สปอนเซอร์'}</span>
              </h4>

              {/* Admin Edit Trigger Button */}
              {isAdmin && !isEditing && (
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center gap-1 text-[11px] bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-md"
                  title="แก้ไขข้อมูลติดต่องานแสดง"
                >
                  <Edit2 className="w-3 h-3 text-red-400" />
                  <span>แก้ไขข้อมูล</span>
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="text-[11px] bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                <span>บันทึกข้อมูลติดต่องานแสดงเรียบร้อยแล้ว</span>
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-2 text-xs text-neutral-300 pt-1">
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                  <span>เบอร์โทร: <strong className="text-white select-all">{bookingContact.phone}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                  <span>อีเมล: <strong className="text-white select-all">{bookingContact.email}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                  <span>Line Official: <strong className="text-emerald-400 select-all">{bookingContact.line}</strong></span>
                </p>
              </div>
            ) : (
              /* Inline Admin Edit Form */
              <form onSubmit={handleSave} className="space-y-3 pt-2 text-xs border-t border-neutral-800/80 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">หัวข้อ:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="ติดต่องานแสดง & สปอนเซอร์"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">เบอร์โทรศัพท์:</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="081-987-6543 (คุณนก - Manager)"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">อีเมล:</label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="booking@tripletsband.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 font-mono">Line Official:</label>
                  <input
                    type="text"
                    value={formData.line}
                    onChange={(e) => setFormData(prev => ({ ...prev, line: e.target.value }))}
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    placeholder="@tripletsbooking"
                    required
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] text-neutral-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รีเซ็ตค่าเดิม</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      <span>ยกเลิก</span>
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <Check className="w-3 h-3" />
                      <span>บันทึก</span>
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

