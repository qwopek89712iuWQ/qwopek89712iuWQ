import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

function useDocumentTitle(titles: string[], interval: number) {
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      document.title = titles[currentIndex];
      currentIndex = (currentIndex + 1) % titles.length;
    }, interval);

    return () => clearInterval(timer);
  }, [titles, interval]);
}

interface Song {
  title: string;
  url: string;
}

function MusicControls({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initialLoadRef = useRef(true);

  const songs: Song[] = [
    { title: "Jazz Track 1", url: "https://files.catbox.moe/itg2jk.mp3" },
    { title: "Jazz Track 2", url: "https://files.catbox.moe/lab7e0.mp3" },
    { title: "Jazz Track 3", url: "https://files.catbox.moe/gs7apl.mp3" }
  ];

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(songs[currentSongIndex].url);
      audio.volume = volume;
      audioRef.current = audio;
    }

    const handleSongEnd = () => {
      handleNextSong();
    };

    audioRef.current.addEventListener('ended', handleSongEnd);
    
    if (initialLoadRef.current && isPlaying) {
      audioRef.current.play().catch(error => console.log("Playback failed:", error));
    }
    initialLoadRef.current = false;

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleSongEnd);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].url;
      if (isPlaying) {
        audioRef.current.play().catch(error => console.log("Playback failed:", error));
      }
    }
  }, [currentSongIndex]);

  const handlePrevSong = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = (prev - 1 + songs.length) % songs.length;
      return newIndex;
    });
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = (prev + 1) % songs.length;
      return newIndex;
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.log("Playback failed!"));
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="absolute top-full right-0 mt-2 bg-black/20 backdrop-blur-lg border border-white/10 rounded-lg p-4 w-64 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={togglePlayPause}
          className="text-white/80 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer touch-action-manipulation [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrevSong}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="text-white/80 text-sm font-medium">
          {songs[currentSongIndex].title}
        </span>
        
        <button
          onClick={handleNextSong}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function ProfileButton({ imageUrl, alternateImageUrl, position, size, isActive, onHover, name, telegramUrl }: { 
  imageUrl: string;
  alternateImageUrl: string;
  position: { x: number; y: number };
  size: number;
  isActive: boolean;
  onHover: (active: boolean) => void;
  name: string;
  telegramUrl: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="absolute"
      style={{ 
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(false);
      }}
    >
      {/* Profile Image */}
      <a 
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block transform -translate-x-1/2 -translate-y-1/2 rounded-3xl overflow-hidden hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl ${!isActive ? 'opacity-40' : ''}`}
        style={{ 
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        <div className="relative w-full h-full">
          <img 
            src={imageUrl} 
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0 : 1
            }}
          />
          <img 
            src={alternateImageUrl} 
            alt={`${name} alternate`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0
            }}
          />
        </div>
      </a>

      {/* Member Name */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-1/2 w-[40rem] text-center pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: `translate(-50%, ${isHovered ? '-50%' : '-30%'})`,
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="text-members-small relative" data-content={name}>
          <span className="block text-white text-[8rem] font-black tracking-tighter leading-none select-none">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMusicControlsOpen, setIsMusicControlsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  useDocumentTitle(['B', 'BA', 'BAY', 'BAYC'], 500);

/**
henny bayc pfp: https://files.catbox.moe/utc5w1.PNG
ryan bayc pfp: https://files.catbox.moe/ixqebw.PNG
kaleb bayc pfp: https://files.catbox.moe/dex7lj.PNG
*/
  
  const profiles = [
    {
      name: "HENNY",
      imageUrl: "https://files.catbox.moe/utc5w1.PNG",
      alternateImageUrl: "https://files.catbox.moe/ph1pqd.png",
      position: { x: 45, y: 40 },
      mobilePosition: { x: 30, y: 30 },
      size: 200,
      telegramUrl: "https://t.me/+88803976962"
    },
    {
      name: "RYAN",
      imageUrl: "https://files.catbox.moe/ygc6oc.PNG",
      alternateImageUrl: "https://files.catbox.moe/7qyxgx.jpg",
      position: { x: 65, y: 55 },
      mobilePosition: { x: 70, y: 60 },
      size: 160,
      telegramUrl: "https://t.me/baycboys"
    },
    {
      name: "KALEB",
      imageUrl: "https://files.catbox.moe/vb4x7y.PNG",
      alternateImageUrl: "https://files.catbox.moe/xq2f4d.png",
      position: { x: 35, y: 60 },
      mobilePosition: { x: 40, y: 90 },
      size: 180,
      telegramUrl: "https://t.me/kalebwestnft"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = -(e.clientX / window.innerWidth - 0.5) * 50;
      const y = -(e.clientY / window.innerHeight - 0.5) * 50;
      setMousePosition({ x, y });
    };

    const handleClickOutside = () => {
      setIsMusicControlsOpen(false);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    handleResize();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const transformStyle = {
    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
    transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
  };

  const textRotationStyle = {
    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) rotate(${mousePosition.x * 0.02}deg)`,
    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background container with extended size */}
      <div className="absolute" style={{
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
      }}>
        {/* Chalkboard background */}
        <div 
          className="w-full h-full chalkboard-background"
          style={transformStyle}
        />
      </div>

      {/* Background Text */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={textRotationStyle}
      >
        <div className="text-members relative">
          <span className="block text-white/[0.0001] text-[12vw] font-black tracking-tighter leading-none select-none text-center">
            BAYC.GROUP
          </span>
        </div>
      </div>

      {/* Profile Buttons Container */}
      <div 
        className={`absolute inset-0 ${isMobile ? 'overflow-auto' : ''}`}
        style={{
          perspective: '1000px'
        }}
      >
        <div
          className={`relative ${isMobile ? 'min-h-[200vh] w-full' : 'absolute'}`}
          style={isMobile ? undefined : {
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            ...transformStyle
          }}
        >
          {profiles.map((profile, index) => (
            <ProfileButton
              key={index}
              {...profile}
              position={isMobile ? profile.mobilePosition : profile.position}
              isActive={activeCard === null || activeCard === index}
              onHover={(active) => setActiveCard(active ? index : null)}
            />
          ))}
        </div>
      </div>

      {/* Logos */}
      <div className="fixed top-8 left-8 z-50">
        <a 
          href="https://t.me/baycboys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <img 
            src="https://files.catbox.moe/m4wbr6.png" 
            alt="BAYC" 
            className="w-14 h-14 object-contain opacity-60 hover:opacity-80 transition-opacity"
          />
        </a>
      </div>
      <div className="fixed top-8 right-8 z-50">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMusicControlsOpen(!isMusicControlsOpen);
            }}
          >
            <img 
              src="https://files.catbox.moe/304hhq.png" 
              alt="Controls" 
              className="w-12 h-12 object-cover rounded-lg opacity-80 hover:opacity-100 transition-opacity"
            />
          </button>
          <MusicControls 
            isOpen={isMusicControlsOpen} 
            onClose={() => setIsMusicControlsOpen(false)} 
          />
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      {isMobile && showScrollIndicator && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none scroll-indicator">
          <img 
            src="https://files.catbox.moe/d77tkw.png" 
            alt="Scroll"
            className="w-12 h-12 object-contain opacity-40"
          />
        </div>
      )}
    </div>
  );
}

export default App;
