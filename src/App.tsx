import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MusicPlayerSection } from './components/MusicPlayerSection';
import { BandSection } from './components/BandSection';
import { FanZoneSection } from './components/FanZoneSection';
import { Footer } from './components/Footer';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { ImageEditorModal } from './components/ImageEditorModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SongEditorModal } from './components/SongEditorModal';
import { ImageProvider } from './context/ImageContext';
import { SongProvider } from './context/SongContext';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ImageProvider>
      <SongProvider>
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-600 selection:text-white">
          
          {/* Navigation Bar */}
          <Navbar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Hero Section */}
          <Hero
            onNavigateSection={handleNavigateSection}
          />

          {/* Band & Member Bio Section */}
          <BandSection />

          {/* Music Player & Tracklist Section */}
          <MusicPlayerSection />

          {/* Fan Zone & Guestbook Section */}
          <FanZoneSection />

          {/* Footer Section */}
          <Footer
            onNavigateSection={handleNavigateSection}
          />

          {/* Floating Audio Player Sticky Bar */}
          <FloatingMusicPlayer
            onNavigateMusic={() => handleNavigateSection('music')}
          />

          {/* Custom Modals */}
          <ImageEditorModal />
          <AdminLoginModal />
          <SongEditorModal />

        </div>
      </SongProvider>
    </ImageProvider>
  );
}

