import React, { useState, useEffect } from 'react';
import { Music, Users, Heart, Menu, X, Volume2, Camera, Lock, ShieldCheck, Layout } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import { useBandImages } from '../context/ImageContext';
import { useSongs } from '../context/SongContext';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { images, openImageEditor } = useBandImages();
  const { isAdmin, openAdminModal, openTemplateModal, bandInfo } = useSongs();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = audioSynth.subscribe(() => {
      setIsPlaying(audioSynth.getState().isPlaying);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navItems = [
    { id: 'hero', label: 'หน้าหลัก', icon: null },
    { id: 'band', label: 'สมาชิกวง', icon: Users },
    { id: 'music', label: 'ฟังเพลง', icon: Music },
    { id: 'fanzone', label: 'แฟนคลับ', icon: Heart },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 shadow-2xl py-3' 
        : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/50 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="h-10 w-12 sm:w-16 rounded-lg bg-neutral-900 border border-neutral-700/80 p-0.5 shadow-lg shadow-red-950/30 group-hover:scale-105 group-hover:border-red-500/60 transition-all flex items-center justify-center overflow-hidden">
            <img 
              src={images.bandLogo} 
              alt={`${bandInfo.name} Logo`} 
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-xl text-neutral-100 group-hover:text-red-400 transition-colors uppercase font-mono">
                {bandInfo.name}
              </span>
              <span className="text-[10px] font-semibold bg-red-600/30 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase">
                BAND
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 tracking-widest font-mono uppercase hidden sm:block">
              {bandInfo.taglineEng || 'THREE SOULS • THREE VOICES'}
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 border border-neutral-800/60 rounded-full px-3 py-1.5 backdrop-blur-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-900/40 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Template & Design Mode Button (Admin Only Feature) */}
          {isAdmin && (
            <button
              onClick={openTemplateModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-950/90 to-neutral-900 hover:from-red-900 hover:to-neutral-800 border border-red-600/60 text-red-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer group"
              title="จัดการเทมเพลต: ทำเป็นค่าว่าง, นำเข้าแทนที่, บันทึกเป็นเทมเพลต (Admin Only)"
            >
              <Layout className="w-3.5 h-3.5 text-red-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">เทมเพลต & ออกแบบ</span>
              <span className="sm:hidden">Template</span>
            </button>
          )}

          {/* Admin Login / Status Button */}
          <button
            onClick={openAdminModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer ${
              isAdmin
                ? 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 hover:bg-emerald-900'
                : 'bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-red-500/60 text-neutral-200 hover:text-white'
            }`}
            title="ระบบจัดการเพลง Admin"
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin Mode</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">Admin Login</span>
              </>
            )}
          </button>

          {/* Custom Image Editor Button (Visible in Admin mode) */}
          {isAdmin && (
            <button
              onClick={() => openImageEditor('win')}
              className="flex items-center gap-1.5 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-red-500/60 text-neutral-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer group"
              title="เปลี่ยนหรืออัปโหลดรูปภาพศิลปินได้เอง (Admin Only)"
            >
              <Camera className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">รูปศิลปิน</span>
            </button>
          )}

          {/* Active Player Indicator */}
          {isPlaying && (
            <button 
              onClick={() => handleNavClick('music')}
              className="hidden lg:flex items-center gap-2 bg-red-950/40 border border-red-800/50 px-3 py-1.5 rounded-full text-xs text-red-300 animate-pulse hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span className="font-mono text-[11px] font-medium">กำลังเล่นเพลง</span>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-red-500 h-full animate-[ping_1s_infinite]"></span>
                <span className="w-0.5 bg-red-400 h-2/3 animate-[ping_1.2s_infinite]"></span>
                <span className="w-0.5 bg-red-500 h-1/2 animate-[ping_0.8s_infinite]"></span>
              </div>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-2 mt-3 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-red-600 text-white font-medium'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 opacity-80" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          
          {isAdmin ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openTemplateModal();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left bg-neutral-900 text-red-400 border border-red-800/40 font-semibold"
            >
              <Layout className="w-4 h-4" />
              <span>เทมเพลต & ออกแบบ (Admin Mode)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdminModal();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left bg-neutral-900 text-neutral-300 border border-neutral-800 font-semibold"
            >
              <Lock className="w-4 h-4 text-red-400" />
              <span>เข้าสู่ระบบ Admin (Admin Login)</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
