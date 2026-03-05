import React, { useState, useEffect, useRef, useMemo } from 'react';
import Phaser from 'phaser';
import MainScene from './game/MainScene';
import { analyzeDream } from './services/geminiService';
import { AppScreen, DreamAnalysis, LevelConfig, ScenarioId, CharacterOption, TransformationRecord, DeepAnalysis, GameSummary } from './types';
import { Loader2, Mic, ChevronRight, RefreshCw, Save, Play, ArrowLeft, Link, Settings, User, History, Users, Home, Trash2 } from 'lucide-react';

// Scenario Configurations
const SCENARIO_CONFIGS: Record<ScenarioId, LevelConfig> = {
  [ScenarioId.A]: { // Abandoned Classroom
    scenarioId: ScenarioId.A,
    gravity: 1,
    lightColor: 0x887766,
    obstacleTag: 'desk',
    backgroundColors: [0x2c3e50, 0x34495e, 0x4a6fa5] // Blues/Greys
  },
  [ScenarioId.B]: { // Endless Forest
    scenarioId: ScenarioId.B,
    gravity: 1,
    lightColor: 0x228822,
    obstacleTag: 'thorns',
    backgroundColors: [0x051405, 0x0a290a, 0x143d14] // Dark Greens
  },
  [ScenarioId.C]: { // Abyss
    scenarioId: ScenarioId.C,
    gravity: 0.5, // Low gravity
    lightColor: 0x330000,
    obstacleTag: 'rubble',
    backgroundColors: [0x1a0505, 0x330a0a, 0x4d1414] // Dark Reds
  },
  [ScenarioId.D]: { // Lonely Room
    scenarioId: ScenarioId.D,
    gravity: 1.2, // Heavy feel
    lightColor: 0x444455,
    obstacleTag: 'toy',
    backgroundColors: [0x101015, 0x20202a, 0x303040] // Desaturated Blues
  }
};

// --- Sub-Components ---

const CharacterSelectScreen = ({
  characters,
  onSelect,
  onHome,
  onRegenerate
}: {
  characters: CharacterOption[];
  onSelect: (characterId: string) => void;
  onHome: () => void;
  onRegenerate: () => void;
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    if (selectedCharacter) {
      onSelect(selectedCharacter);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden font-lato bg-black">
      {/* Background image (fallback overlay if missing) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(./assets/ui/splash/CharacterSelect.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/65 to-black" />

      {/* Top-left actions */}
      <div className="absolute top-6 left-6 z-20 flex gap-3">
        <button
          type="button"
          onClick={onHome}
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 backdrop-blur-md shadow-[0_0_24px_rgba(92,255,212,0.18)] transition-transform duration-200 hover:scale-[1.03] hover:bg-black/70 active:scale-[0.98]"
          aria-label="Home"
          title="Home"
          style={{ width: 'clamp(42px, 6vh, 56px)', height: 'clamp(42px, 6vh, 56px)' }}
        >
          <Home size={20} />
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center justify-center rounded-full border border-[rgba(92,255,212,0.7)] bg-black/50 text-white/90 backdrop-blur-md shadow-[0_0_24px_rgba(92,255,212,0.18)] transition-transform duration-200 hover:scale-[1.03] hover:bg-black/70 active:scale-[0.98]"
          aria-label="Regenerate"
          title="Regenerate"
          style={{ width: 'clamp(42px, 6vh, 56px)', height: 'clamp(42px, 6vh, 56px)' }}
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      {/* Content */}
      <div 
        className="relative z-10 w-full h-full flex flex-col items-center justify-center transition-all duration-1000 ease-out"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          opacity: isVisible ? 1 : 0,
          padding: 'clamp(10px, 2.2vh, 24px) clamp(11px, 2.9vw, 29px)' // 1.2x larger
        }}
      >
        {/* Title */}
        <h2 
          className="text-white text-center italic font-cinzel drop-shadow-2xl"
          style={{ fontSize: 'clamp(14px, 2vh, 24px)', marginBottom: 'clamp(6px, 0.9vh, 11px)' }} // 1.2x larger
        >
          "Choose Your Form in This Dream..."
        </h2>

        <p 
          className="text-white/60 text-center italic"
          style={{ fontSize: 'clamp(11px, 1.35vh, 14px)', marginBottom: 'clamp(11px, 1.8vh, 24px)' }} // 1.2x larger
        >
          Based on your dream, these forms resonate with your journey
        </p>

        {/* Character Selection Grid */}
        <div 
          className="grid grid-cols-3 w-full"
          style={{ 
            gap: 'clamp(7px, 1.2vw, 14px)', // 1.2x larger
            maxWidth: 'clamp(432px, 63vw, 756px)', // 1.2x larger
            marginBottom: 'clamp(11px, 1.8vh, 24px)' // 1.2x larger
          }}
        >
          {characters.map((char, index) => (
            <button
              key={char.id}
              onClick={() => setSelectedCharacter(char.id)}
              className={`relative bg-black/50 backdrop-blur-lg border-2 transition-all duration-300 hover:scale-105 ${
                selectedCharacter === char.id
                  ? 'border-[rgba(92,255,212,0.7)] shadow-[0_0_30px_rgba(92,255,212,0.35)]'
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{
                borderRadius: 'clamp(7px, 1.2vh, 14px)', // 1.2x larger
                padding: 'clamp(6px, 1.2vh, 14px)' // 1.2x larger
              }}
            >
              {/* Recommendation Badge */}
              {index === 0 && (
                <div className="absolute -top-2 -left-2 bg-[rgba(92,255,212,0.7)] text-white text-xs font-bold rounded-full shadow-lg z-10"
                     style={{ fontSize: 'clamp(10px, 1.26vh, 13px)', padding: 'clamp(4px, 0.54vh, 7px) clamp(7px, 0.9vw, 11px)' }}> {/* 1.2x larger */}
                  ⭐ BEST FIT
        </div>
              )}
              
              {/* Character Image */}
              <div className="aspect-square flex items-center justify-center bg-white/5 rounded-lg overflow-hidden" style={{ marginBottom: 'clamp(6px, 0.9vh, 11px)' }}> {/* 1.2x larger */}
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-contain"
                />
        </div>
              
              {/* Character Name */}
              <p 
                className="text-white text-center font-bold"
                style={{ fontSize: 'clamp(11px, 1.26vh, 14px)', marginBottom: 'clamp(4px, 0.45vh, 6px)' }} // 1.2x larger
              >
                {char.name}
              </p>
              
              {/* AI Reason */}
              <p 
                className="text-[rgba(92,255,212,0.7)] text-center italic leading-tight"
                style={{ fontSize: 'clamp(7px, 1.1vh, 13px)' }} // 1.2x larger
              >
                {char.reason}
              </p>
              
              {/* Selected Indicator */}
              {selectedCharacter === char.id && (
                <div className="absolute -top-2 -right-2 bg-[rgba(92,255,212,0.7)] rounded-full flex items-center justify-center shadow-lg z-10" style={{ width: 'clamp(29px, 4.5vh, 40px)', height: 'clamp(29px, 4.5vh, 40px)' }}> {/* 1.2x larger */}
                  <span className="text-white" style={{ fontSize: 'clamp(14px, 2.16vh, 22px)' }}>✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedCharacter}
          className={`group flex items-center justify-center font-bold hover:scale-[1.02] disabled:scale-100 transition-all shadow-lg disabled:cursor-not-allowed ${
            selectedCharacter
              ? 'bg-[rgba(92,255,212,0.18)] hover:bg-[rgba(92,255,212,0.26)] text-white border border-[rgba(92,255,212,0.7)] shadow-[0_0_30px_rgba(92,255,212,0.18)]'
              : 'bg-gray-700 opacity-50 text-gray-400'
          }`}
          style={{
            padding: 'clamp(7px, 1.2vh, 14px) clamp(24px, 2.9vw, 42px)', // 1.2x larger
            borderRadius: 'clamp(6px, 0.72vh, 11px)', // 1.2x larger
            fontSize: 'clamp(13px, 1.5vh, 18px)', // 1.2x larger
            gap: 'clamp(7px, 0.9vw, 11px)'
          }}
        >
          <span>Continue</span>
          <ChevronRight style={{ width: 'clamp(18px, 2.16vh, 24px)', height: 'clamp(18px, 2.16vh, 24px)' }} className="group-hover:translate-x-1 transition-transform" />
        </button>
    </div>
  </div>
);
};

const SplashScreen = ({
  onBuildNewDream,
  onOpenHistory,
  onOpenConnect,
  onOpenSettings,
  onOpenProfile,
  onOpenCommunity
}: {
  onBuildNewDream: () => void;
  onOpenHistory: () => void;
  onOpenConnect: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenCommunity: () => void;
}) => {
  const [fadeIn, setFadeIn] = useState(false);
  const [fireflies, setFireflies] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    // Start fade in animation after component mounts
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    // Generate fireflies with random positions and animations
    const generateFireflies = () => {
      const flies = [];
      for (let i = 0; i < 20; i++) {
        flies.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4
        });
      }
      setFireflies(flies);
    };

    generateFireflies();
    return () => clearTimeout(timer);
  }, []);

  const handleBuildNewDream = () => {
    onBuildNewDream();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Black overlay that fades out - covers everything */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-4000 z-50 pointer-events-none ${fadeIn ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* All content together - no individual animations */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(./assets/ui/splash/Enter-background.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Fireflies Layer */}
        <div className="absolute inset-0">
          {fireflies.map((firefly) => (
            <div
              key={firefly.id}
              className="firefly"
              style={{
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                animationDelay: `${firefly.delay}s`,
                animationDuration: `${firefly.duration}s`
              }}
            />
          ))}
        </div>

        {/* Corner Action Buttons */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button
            type="button"
            onClick={onOpenConnect}
            className="menu-icon-btn"
            aria-label="Connect"
            title="Connect"
          >
            <Link size={20} />
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="menu-icon-btn"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
        <div className="absolute bottom-6 left-6 z-20 flex gap-3">
          <button
            type="button"
            onClick={onOpenProfile}
            className="menu-icon-btn"
            aria-label="Profile"
            title="Profile"
          >
            <User size={20} />
          </button>
          <button
            type="button"
            onClick={onOpenCommunity}
            className="menu-icon-btn"
            aria-label="Community"
            title="Community"
          >
            <Users size={20} />
          </button>
        </div>

        {/* Main Buttons (Bottom Center) */}
        <div
          className="absolute left-1/2 z-20 flex flex-col items-center"
          style={{
            transform: 'translateX(-50%) translateY(-50px)',
            bottom: 'clamp(48px, 10vh, 120px)',
            gap: 'clamp(10px, 1.6vh, 18px)'
          }}
        >
          <button
            type="button"
            onClick={handleBuildNewDream}
            className="menu-primary-btn"
          >
            Build a New Dream
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="menu-secondary-btn"
          >
            <span className="inline-flex items-center gap-2">
              <History size={18} />
              Dream History
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ padding: '14vh 7vw' }}>
          {/* Title - fade in from top */}
          <div 
            className={`flex-1 flex items-center justify-center transition-all duration-2000 ease-out ${
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div className="dreamaialchemy-title-wrap" style={{ marginTop: '-50px' }}>
              <div
                className="dreamaialchemy-title font-pixel animate-float select-none"
                aria-label="DreamAIchemy"
              >
                DreamAIchemy
              </div>
            </div>
          </div>
        </div>
    </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes firefly-float {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate(30px, -50px);
            opacity: 0.8;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(-20px, -100px);
            opacity: 0;
          }
        }
        @keyframes firefly-glow {
          0%, 100% {
            box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.6),
                        0 0 10px 4px rgba(255, 255, 255, 0.4),
                        0 0 15px 6px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.9),
                        0 0 20px 8px rgba(255, 255, 255, 0.6),
                        0 0 30px 12px rgba(255, 255, 255, 0.3);
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.01);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .firefly {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          animation: firefly-float 7s infinite ease-in-out, 
                     firefly-glow 2s infinite ease-in-out;
          pointer-events: none;
          z-index: 5;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .dreamaialchemy-title {
          font-size: clamp(42px, 6.2vw, 96px);
          line-height: 1.1;
          letter-spacing: 0.04em;
          color: #ffffff;
          text-align: center;
          /* Subtle glow (no outline) */
          text-shadow:
            0 0 18px rgba(92, 255, 212, 0.48),
            0 0 36px rgba(92, 255, 212, 0.22);
        }
        .dreamaialchemy-title-wrap {
          display: inline-block;
          transform-origin: center;
          transition: transform 180ms ease;
          cursor: pointer;
        }
        .dreamaialchemy-title-wrap:hover {
          transform: scale(1.06);
        }
        .dreamaialchemy-title-wrap:hover .dreamaialchemy-title {
          text-shadow:
            0 0 22px rgba(92, 255, 212, 0.83),
            0 0 44px rgba(92, 255, 212, 0.58),
            0 0 72px rgba(92, 255, 212, 0.10);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.08));
        }
        .duration-1500 {
          transition-duration: 1.5s;
        }
        .duration-2000 {
          transition-duration: 2s;
        }
        .duration-4000 {
          transition-duration: 4s;
        }
        .delay-500 {
          transition-delay: 0.5s;
        }
        .delay-1000 {
          transition-delay: 1s;
        }
        .delay-1500 {
          transition-delay: 1.5s;
        }
        .delay-2500 {
          transition-delay: 2.5s;
        }
        .delay-2000 {
          transition-delay: 2s;
        }

        .menu-icon-btn {
          width: clamp(42px, 6vh, 56px);
          height: clamp(42px, 6vh, 56px);
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 24px rgba(92, 255, 212, 0.14);
          backdrop-filter: blur(8px);
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }
        .menu-icon-btn:hover {
          transform: translateY(-1px) scale(1.03);
          background: rgba(0, 0, 0, 0.62);
          box-shadow: 0 0 34px rgba(92, 255, 212, 0.22);
        }
        .menu-icon-btn:active {
          transform: scale(0.98);
        }

        .menu-primary-btn,
        .menu-secondary-btn {
          width: clamp(260px, 34vw, 460px);
          padding: clamp(12px, 1.8vh, 16px) clamp(18px, 2.4vw, 28px);
          border-radius: clamp(14px, 1.8vh, 18px);
          font-size: clamp(16px, 2.0vh, 22px);
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: transform 180ms ease, box-shadow 220ms ease, background 220ms ease, border-color 220ms ease;
        }
        .menu-primary-btn {
          background: rgba(0, 0, 0, 0.38);
          border: 1px solid rgba(92, 255, 212, 0.62);
          box-shadow: 0 0 34px rgba(92, 255, 212, 0.20);
        }
        .menu-primary-btn:hover {
          transform: translateY(-1px);
          background: rgba(0, 0, 0, 0.56);
          box-shadow: 0 0 44px rgba(92, 255, 212, 0.28);
        }
        .menu-secondary-btn {
          background: rgba(0, 0, 0, 0.34);
          border: 1px solid rgba(255, 255, 255, 0.20);
          box-shadow: 0 0 26px rgba(255, 255, 255, 0.10);
        }
        .menu-secondary-btn:hover {
          transform: translateY(-1px);
          background: rgba(0, 0, 0, 0.54);
          border-color: rgba(92, 255, 212, 0.30);
          box-shadow: 0 0 40px rgba(92, 255, 212, 0.18);
        }
        .menu-primary-btn:active,
        .menu-secondary-btn:active {
          transform: translateY(0px) scale(0.99);
        }
      `}} />
  </div>
);
};

const MenuScreenLayout = ({
  title,
  onBack,
  children
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-screen relative overflow-hidden font-lato bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(./assets/ui/splash/Enter-background.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 z-20 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 backdrop-blur-md shadow-[0_0_24px_rgba(92,255,212,0.18)] transition-transform duration-200 hover:scale-[1.03] hover:bg-black/70 active:scale-[0.98]"
        aria-label="Back"
        title="Back"
        style={{ width: 'clamp(42px, 6vh, 56px)', height: 'clamp(42px, 6vh, 56px)' }}
      >
        <ArrowLeft size={20} />
      </button>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ padding: 'clamp(18px, 4vh, 36px) clamp(18px, 4vw, 48px)' }}>
        <div
          className="w-full max-w-2xl bg-black/45 backdrop-blur-xl border border-white/15"
          style={{
            borderRadius: 'clamp(16px, 2vh, 20px)',
            padding: 'clamp(16px, 2.4vh, 24px)'
          }}
        >
          <h2
            className="text-white font-cinzel"
            style={{ fontSize: 'clamp(18px, 2.4vh, 28px)', marginBottom: 'clamp(10px, 1.6vh, 16px)' }}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

const HistoryDreamsScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <MenuScreenLayout title="Dream History" onBack={onBack}>
      <div className="text-white/80 leading-relaxed">
        <p className="mb-3">This screen will show your saved dream entries (can be wired to local storage or account sync later).</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/70">No dream history yet.</p>
          <p className="text-white/50 text-sm mt-2">Start by clicking “Build a New Dream” on the home screen.</p>
        </div>
      </div>
    </MenuScreenLayout>
  );
};

const ConnectScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <MenuScreenLayout title="Connect" onBack={onBack}>
      <div className="text-white/80 leading-relaxed">
        <p className="mb-3">Connect external devices/services (e.g., sensors, accounts, realtime data sources).</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/70">Connection setup coming soon.</p>
        </div>
      </div>
    </MenuScreenLayout>
  );
};

const SettingsScreen = ({
  onBack,
  musicVolume,
  setMusicVolume
}: {
  onBack: () => void;
  musicVolume: number;
  setMusicVolume: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <MenuScreenLayout title="Settings" onBack={onBack}>
      <div className="text-white/80 leading-relaxed">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white">Background music volume</p>
              <p className="text-white/50 text-sm mt-1">Affects only the music played on menu/input screens.</p>
            </div>
            <div className="text-white/70 text-sm tabular-nums" style={{ minWidth: 48, textAlign: 'right' }}>
              {Math.round(musicVolume * 100)}%
            </div>
          </div>
          <input
            className="w-full mt-3"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </MenuScreenLayout>
  );
};

const ProfileScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <MenuScreenLayout title="Profile" onBack={onBack}>
      <div className="text-white/80 leading-relaxed">
        <p className="mb-3">Your profile, preferences, and dream stats can live here.</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/70">Profile coming soon.</p>
        </div>
      </div>
    </MenuScreenLayout>
  );
};

const CommunityScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <MenuScreenLayout title="Community" onBack={onBack}>
      <div className="text-white/80 leading-relaxed">
        <p className="mb-3">Explore shared dreams, stories, and healing moments from others.</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/70">Community coming soon.</p>
        </div>
      </div>
    </MenuScreenLayout>
  );
};

const InputScreen = ({ onAnalyze, onBack }: { onAnalyze: (text: string) => void; onBack: () => void }) => {
    const [userInput, setUserInput] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [fireflies, setFireflies] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);
    const [mode, setMode] = useState<'decompression' | 'comfort'>('decompression');

    useEffect(() => {
      // Trigger fade-in animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      
      // Generate fireflies with random positions and animations
      const generateFireflies = () => {
        const flies = [];
        for (let i = 0; i < 20; i++) {
          flies.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4
          });
        }
        setFireflies(flies);
      };
      
      generateFireflies();
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-full h-screen relative overflow-hidden font-lato">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 z-20 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 backdrop-blur-md shadow-[0_0_24px_rgba(92,255,212,0.18)] transition-transform duration-200 hover:scale-[1.03] hover:bg-black/70 active:scale-[0.98]"
          aria-label="Back"
          title="Back"
          style={{ width: 'clamp(42px, 6vh, 56px)', height: 'clamp(42px, 6vh, 56px)' }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            backgroundImage: 'url(./assets/ui/splash/build-ask.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Moon (x=40%, y=25%) */}
        <img
          src="./assets/ui/splash/moon.png"
          alt=""
          className="absolute pointer-events-none select-none transition-opacity duration-1000 ease-out"
          style={{
            left: '40%',
            top: '25%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(240px*1.5, 27vw*1.5, 390px*1.5)',
            height: 'auto',
            opacity: isVisible ? 0.92 : 0,
            filter: 'drop-shadow(0 0 22px rgba(92, 255, 212, 0.10))'
          }}
        />

        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 transition-opacity duration-1000 ease-out"
          style={{ opacity: isVisible ? 1 : 0 }}
        />

        {/* Firefly particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {fireflies.map((firefly) => (
            <div
              key={firefly.id}
              className="firefly"
              style={{
                left: `${firefly.x}%`,
                top: `${firefly.y}%`,
                animationDelay: `${firefly.delay}s`,
                animationDuration: `${firefly.duration}s`,
                opacity: isVisible ? 1 : 0,
                transition: `opacity 1.5s ease-out ${0.8 + firefly.id * 0.05}s`
              }}
            />
          ))}
        </div>

        {/* Content - positioned lower to not cover the witch */}
        <div 
          className="relative z-10 w-full h-full flex items-end justify-center transition-all duration-1000 ease-out"
          style={{
            paddingBottom: 'clamp(29px, 7.2vh, 86px)', // 1.2x larger
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0
          }}
        >
          <div className="w-full" style={{ maxWidth: 'clamp(540px, 70vw, 1100px)', padding: '0 5.8vw' }}> {/* slightly wider */}
            {/* Prompt Text */}
            <p 
              className="text-white text-center italic drop-shadow-2xl font-cinzel transition-all duration-1000 ease-out"
              style={{
                fontSize: 'clamp(14px, 2vh, 24px)', // 1.2x larger
                marginBottom: 'clamp(11px, 2.2vh, 24px)', // 1.2x larger
                transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: '200ms'
              }}
            >
              "Tell me about your dream..."
            </p>

            {/* Mode Buttons (aligned with dialog, above it) */}
            <div
              className="flex items-center justify-start gap-3"
              style={{
                marginBottom: 'clamp(8px, 1.4vh, 14px)',
                transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 700ms ease-out 300ms, transform 700ms ease-out 300ms'
              }}
            >
              <button
                type="button"
                onClick={() => setMode('decompression')}
                className="border text-white/90 transition-all hover:scale-[1.01] active:scale-[0.99] inline-flex items-center justify-center"
                style={{
                  width: 'clamp(160px, 18vw, 220px)',
                  height: 'clamp(28px, 3.2vh, 34px)',
                  padding: '0 clamp(10px, 1.4vw, 14px)',
                  borderRadius: 'clamp(10px, 1.2vh, 14px)',
                  fontSize: 'clamp(12px, 1.4vh, 14px)',
                  lineHeight: 1,
                  background: mode === 'decompression' ? 'rgba(92, 255, 212, 0.12)' : 'rgba(0, 0, 0, 0.30)',
                  borderColor: mode === 'decompression' ? 'rgba(92, 255, 212, 0.55)' : 'rgba(255, 255, 255, 0.18)',
                  boxShadow: mode === 'decompression' ? '0 0 24px rgba(92, 255, 212, 0.16)' : 'none',
                  backdropFilter: 'blur(10px)'
                }}
                aria-label="Stress Relief mode"
                title="Stress Relief mode"
              >
                Stress Relief Mode
              </button>

              <button
                type="button"
                onClick={() => setMode('comfort')}
                className="border text-white/90 transition-all hover:scale-[1.01] active:scale-[0.99] inline-flex items-center justify-center"
                style={{
                  width: 'clamp(160px, 18vw, 220px)',
                  height: 'clamp(28px, 3.6vh, 34px)',
                  padding: '0 clamp(10px, 1.4vw, 14px)',
                  borderRadius: 'clamp(10px, 1.2vh, 14px)',
                  fontSize: 'clamp(12px, 1.4vh, 14px)',
                  lineHeight: 1,
                  background: mode === 'comfort' ? 'rgba(92, 255, 212, 0.12)' : 'rgba(0, 0, 0, 0.30)',
                  borderColor: mode === 'comfort' ? 'rgba(92, 255, 212, 0.55)' : 'rgba(255, 255, 255, 0.18)',
                  boxShadow: mode === 'comfort' ? '0 0 24px rgba(92, 255, 212, 0.16)' : 'none',
                  backdropFilter: 'blur(10px)'
                }}
                aria-label="Comfort mode"
                title="Comfort mode"
              >
                Comfort Mode
              </button>
            </div>

            {/* Input Box - smaller and compact with glow effect */}
            <div 
              className="bg-black/50 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-1000 ease-out relative"
              style={{
                borderRadius: 'clamp(14px, 2.5vh, 29px)', // 1.2x larger
                padding: 'clamp(12px, 2.0vh, 22px) clamp(14px, 2.5vw, 29px)', // narrower (shorter) dialog
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: '400ms',
                boxShadow: isVisible ? '0 0 30px rgba(92, 255, 212, 0.06), 0 20px 60px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              {/* Breathing glow effect */}
              <div 
                className="absolute -z-10 blur-sm"
                style={{
                  inset: 'clamp(-4px, -0.45vh, -6px)',
                  borderRadius: 'clamp(14px, 2.5vh, 29px)',
                  background: 'linear-gradient(90deg, rgba(92, 255, 212, 0.07), rgba(92, 255, 212, 0.02), rgba(92, 255, 212, 0.01))',
                  animation: isVisible ? 'pulse-glow 3s ease-in-out infinite' : 'none',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: '600ms'
                }}
              />
              {/* Textarea with Voice Button */}
              <div className="relative">
            <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Allow space key in textarea
                    if (e.key === ' ') {
                      e.stopPropagation();
                    }
                  }}
            placeholder="I was trapped in a room with no doors..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 resize-none"
                  style={{
                    height: 'clamp(52px, 8vh, 98px)', // narrower (shorter) textarea
                    borderRadius: 'clamp(10px, 1.1vh, 14px)', // 1.2x larger
                    padding: 'clamp(10px, 1.8vh, 18px) clamp(10px, 1.8vw, 18px)', // 1.2x larger
                    paddingRight: 'clamp(50px, 5.8vw, 72px)',
                    fontSize: 'clamp(14px, 1.8vh, 20px)' // 1.2x larger
                  }}
                />
                
                {/* Voice Input Button */}
                <button
                  onClick={() => {
                    alert('Voice input feature coming soon!');
                  }}
                  className="absolute bg-white/10 hover:bg-white/20 transition-colors"
                  style={{
                    right: 'clamp(7px, 1.1vw, 14px)',
                    top: 'clamp(7px, 1.1vh, 14px)',
                    padding: 'clamp(7px, 1.1vh, 11px)',
                    borderRadius: 'clamp(7px, 0.9vh, 11px)'
                  }}
                  title="Voice Input"
                >
                  <Mic className="text-white/70" style={{ width: 'clamp(20px, 3.2vh, 29px)', height: 'clamp(20px, 3.2vh, 29px)' }} />
                </button>
        </div>

              {/* Analyze Button - Changes color when typing */}
            <button
            onClick={() => { if(userInput.trim()) onAnalyze(userInput); }}
            disabled={!userInput.trim()}
                className={`group flex items-center justify-center w-full font-bold hover:scale-[1.02] disabled:scale-100 transition-all shadow-lg disabled:cursor-not-allowed ${
                  userInput.trim() 
                    ? 'bg-[#102B55] hover:bg-[#1B4AA3] text-white shadow-[0_0_30px_rgba(16,43,85,0.35)]' 
                    : 'bg-gray-700 opacity-50 text-gray-400'
                }`}
                style={{
                  marginTop: 'clamp(11px, 2.2vh, 24px)', // 1.2x larger
                  height: 'clamp(38px, 4.8vh, 46px)',
                  padding: '0 clamp(12px, 1.6vw, 18px)', // narrower (shorter) button
                  borderRadius: 'clamp(10px, 1.1vh, 14px)', // 1.2x larger
                  fontSize: 'clamp(14px, 1.8vh, 20px)', // 1.2x larger
                  gap: 'clamp(7px, 0.9vw, 11px)'
                }}
            >
                <span>Analyze</span> 
                <ChevronRight style={{ width: 'clamp(18px, 2.5vh, 24px)', height: 'clamp(18px, 2.5vh, 24px)' }} className="group-hover:translate-x-1 transition-transform" />
            </button>
            </div>
          </div>
        </div>
      </div>
    );
};

const LoadingScreen = ({ userInput, onComplete }: { userInput: string, onComplete: (analysis: DreamAnalysis) => void }) => {
    const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);

    useEffect(() => {
        let mounted = true;
        const process = async () => {
            const result = await analyzeDream(userInput);
            if(mounted) {
                setAnalysis(result);
                // Fake delay for "Building Dreamscape"
                setTimeout(() => onComplete(result), 2500);
            }
        };
        process();
        return () => { mounted = false; };
    }, [userInput, onComplete]);

    return (
       <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center font-mono relative overflow-hidden" style={{ padding: 'clamp(14px, 3.6vh, 36px)' }}>
         <div className="absolute inset-0 bg-blue-900/10 animate-pulse"></div>
         <Loader2 className="text-white animate-spin relative z-10" style={{ width: 'clamp(43px, 7.2vh, 72px)', height: 'clamp(43px, 7.2vh, 72px)', marginBottom: 'clamp(22px, 3.6vh, 43px)' }} />
         <div className="text-gray-400 text-center relative z-10" style={{ fontSize: 'clamp(13px, 1.6vh, 20px)', padding: '0 3.6vw' }}>
            <p className="animate-pulse" style={{ marginBottom: 'clamp(11px, 1.8vh, 18px)' }}>Parsing Subconscious Symbols...</p>
            {analysis && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(7px, 1.4vh, 14px)' }}>
                    <p className="text-green-400 font-bold tracking-widest" style={{ fontSize: 'clamp(11px, 1.5vh, 18px)' }}>ARCHETYPE DETECTED: {SCENARIO_CONFIGS[analysis.scenarioId].scenarioId}</p>
                    <p className="text-blue-400" style={{ fontSize: 'clamp(11px, 1.35vh, 17px)' }}>Constructing Physics Layer...</p>
                    <p className="text-blue-300" style={{ fontSize: 'clamp(11px, 1.35vh, 17px)' }}>Generating Atmospheric Lighting...</p>
                </div>
            )}
         </div>
       </div>
    );
};

const ResultLoadingScreen = ({
  originalDream,
  transformationRecords,
  scenarioId,
  selectedCharacterId,
  gameSummary,
  onComplete,
}: {
  originalDream: string;
  transformationRecords: TransformationRecord[];
  scenarioId?: ScenarioId;
  selectedCharacterId?: string;
  gameSummary?: GameSummary | null;
  onComplete: (deep: DeepAnalysis) => void;
}) => {
  useEffect(() => {
    let mounted = true;
    const timeoutMs = 12000;

    // Always produce a report (never blank)
    const fallback: DeepAnalysis = {
      psychologicalInsight:
        "Your journey through this dreamscape shows courage and willingness to transform pain into healing.",
      emotionalPattern:
        "You've shown resilience in facing your inner struggles and seeking positive change.",
      healingGuidance:
        "Continue to explore your emotions and give yourself permission to heal at your own pace.",
      transformationSummary: `Through ${transformationRecords.length} transformation${
        transformationRecords.length !== 1 ? "s" : ""
      }, you've demonstrated active engagement in your healing process.`,
    };

    const run = async () => {
      // Small pause so the black-screen transition feels intentional
      const startAt = Date.now();

      try {
        const { analyzeJourney } = await import("./services/geminiService");
        const deep = await Promise.race([
          analyzeJourney(originalDream, transformationRecords, {
            scenarioId,
            selectedCharacterId,
            gameSummary: gameSummary || undefined
          }),
          new Promise<DeepAnalysis>((_resolve, reject) =>
            setTimeout(() => reject(new Error("Deep analysis timeout")), timeoutMs)
          ),
        ]);

        if (!mounted) return;
        // Ensure at least ~2.5s on the black screen (cinematic pacing)
        const elapsed = Date.now() - startAt;
        const remaining = Math.max(0, 2500 - elapsed);
        setTimeout(() => mounted && onComplete(deep), remaining);
      } catch (e) {
        console.error("Result deep analysis failed, using fallback:", e);
        if (!mounted) return;
        const elapsed = Date.now() - startAt;
        const remaining = Math.max(0, 2500 - elapsed);
        setTimeout(() => mounted && onComplete(fallback), remaining);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [originalDream, transformationRecords, onComplete]);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0b0f1a]" />
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-6">
        <Loader2 className="text-white/80 animate-spin" style={{ width: 56, height: 56 }} />
        <div className="text-center">
          <p className="text-white/90 tracking-widest text-sm">GENERATING FINAL ANALYSIS</p>
          <p className="text-white/50 text-xs mt-2 animate-pulse">
            Calibrating meaning from your choices...
          </p>
        </div>
        <div className="w-[260px] h-1 bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full w-1/2 bg-gradient-to-r from-purple-400 to-amber-300 animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

const GameplayScreen = ({ config, onGameOver, onScoreUpdate, transformationRecords, setTransformationRecords }: { 
    config: LevelConfig, 
    onGameOver: (success: boolean) => void, 
    onScoreUpdate: (score: number) => void,
    transformationRecords: TransformationRecord[],
    setTransformationRecords: React.Dispatch<React.SetStateAction<TransformationRecord[]>>
}) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<MainScene | null>(null);
    const gameRef = useRef<Phaser.Game | null>(null); // 🔧 Track game instance
    const [score, setScore] = useState(0);
    const [starCount, setStarCount] = useState(3); // Start with 3 stars
    const [showTransformDialog, setShowTransformDialog] = useState(false);
    const [transformInput, setTransformInput] = useState('');
    // Simplified: Single input for transformation
    const [selectedObstacleId, setSelectedObstacleId] = useState<string | null>(null);
    const [currentBadItem, setCurrentBadItem] = useState<string>('');
    const [isTransforming, setIsTransforming] = useState(false);

    // Initialise Phaser
    useEffect(() => {
        if (!gameContainerRef.current) return;
        
        // 🔧 Prevent duplicate game creation
        if (gameRef.current) {
            console.log('⚠️ Game instance already exists, skipping creation');
            return;
        }

        if (window.innerWidth === 0 || window.innerHeight === 0) {
            console.warn('⚠️ Window dimensions are 0, skipping game creation');
            return;
        }

        const gameConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#000000',
            scale: {
                mode: Phaser.Scale.RESIZE, // Important for Mobile Landscape
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'matter',
                matter: {
                    gravity: { x: 0, y: config.gravity },
                    debug: false 
                }
            },
            scene: [] // Initialise empty
        };

        const game = new Phaser.Game(gameConfig);
        gameRef.current = game; // 🔧 Store reference
        console.log('🎮 Created new Phaser game instance');
        
        game.scene.add('MainScene', MainScene, true, {
            config: config,
            onGameOver: onGameOver,
            onScoreUpdate: (newScore: number) => {
                setScore(newScore);
                onScoreUpdate(newScore);
            },
            onStarCollected: (count: number) => {
                setStarCount(count);
            },
            onObstacleClick: (obstacleId: string, badItemName: string) => {
                setSelectedObstacleId(obstacleId);
                setCurrentBadItem(badItemName);
                setShowTransformDialog(true);
            }
        });

        game.events.on('ready', () => {
             const scene = game.scene.getScene('MainScene') as MainScene;
             if (scene) {
                sceneRef.current = scene;
                // Parkour: auto-run to the right
                sceneRef.current.setAutoRun(true);
             }
        });

        return () => {
            // 🔧 CRITICAL FIX: Properly cleanup Phaser game to prevent Framebuffer errors
            if (!gameRef.current) {
                console.log('⚠️ No game instance to cleanup');
                return;
            }
            
            try {
                console.log('🎮 Cleaning up Phaser game instance...');
                
                const gameToDestroy = gameRef.current;
                
                // Clear scene reference first
                sceneRef.current = null;
                
                // 🔧 IMPORTANT: Let Phaser handle its own cleanup
                // Don't manually destroy renderer or clear container - causes "Core Plugins missing" error
                
                // Just destroy the game instance - it will handle everything internally
                gameToDestroy.destroy(true);
                
                // Clear reference
                gameRef.current = null;
                
                console.log('✅ Phaser game destroyed');
            } catch (error) {
                console.error('❌ Error destroying game:', error);
                gameRef.current = null;
            }
        };
    }, [config]); 

    // Notify scene when dialog opens/closes
    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.setUIDialogOpen(showTransformDialog);
        }
    }, [showTransformDialog]); 

    // --- Phone sensor (UDP→WS bridge) → shake to BREAK (NO keyboard injection) ---
    const sensorEnv = (import.meta as any)?.env?.VITE_SENSOR_ENABLED as string | undefined;
    const SENSOR_ENABLED =
        sensorEnv != null ? sensorEnv === 'true' : Boolean((import.meta as any)?.env?.DEV);
    // Force localhost: this is a local-only pipeline (avoid hostname/network/IP mismatch)
    const sensorWsUrl = typeof window !== 'undefined' ? 'ws://localhost:5174' : '';

    const sensorShakeStateRef = useRef<{
        avgX: number;
        avgY: number;
        avgZ: number;
        absHpAvg: number;
        phase: 'idle' | 'pos' | 'neg';
        wentNeutral: boolean;
        phaseTs: number;
        lastFireMs: number;
        axis: 'x' | 'y' | 'z' | null;
        lastLogMs: number;
    }>({
        avgX: 0,
        avgY: 0,
        avgZ: 0,
        absHpAvg: 0,
        phase: 'idle',
        wentNeutral: false,
        phaseTs: 0,
        lastFireMs: 0,
        axis: null,
        lastLogMs: 0
    });

    useEffect(() => {
        if (!SENSOR_ENABLED) return;

        // Connect to the local sensor bridge (run: npm run sensor)
        const wsUrl = sensorWsUrl;
        let ws: WebSocket | null = null;
        let closed = false;

        const extractAccel = (payload: any): { x: number; y: number; z: number } | null => {
            const toNum = (v: any): number | null => {
                const n = Number(v);
                return Number.isFinite(n) ? n : null;
            };

            const xyzFrom = (obj: any): { x: number; y: number; z: number } | null => {
                if (!obj) return null;
                // {x,y,z}
                if (typeof obj === 'object' && !Array.isArray(obj)) {
                    const x = toNum((obj as any).x);
                    const y = toNum((obj as any).y);
                    const z = toNum((obj as any).z);
                    if (x != null && y != null && z != null) return { x, y, z };
                }
                // [x,y,z]
                if (Array.isArray(obj) && obj.length >= 3) {
                    const x = toNum(obj[0]);
                    const y = toNum(obj[1]);
                    const z = toNum(obj[2]);
                    if (x != null && y != null && z != null) return { x, y, z };
                }
                return null;
            };

            const keyLooksAccel = (k: string) => {
                const s = (k || '').toLowerCase();
                return (
                    s.includes('accel') ||
                    s.includes('accelerometer') ||
                    s.includes('acceleration') ||
                    s.includes('linearacceleration') ||
                    s.includes('linear_acceleration')
                );
            };

            // Common direct shapes
            const sens = payload?.sensordata ?? payload?.sensor ?? payload ?? {};
            const direct =
                xyzFrom(sens?.accel) ??
                xyzFrom(sens?.acceleration) ??
                xyzFrom(sens?.linearAcceleration) ??
                xyzFrom(payload?.accel) ??
                xyzFrom(payload?.acceleration) ??
                xyzFrom(payload?.linearAcceleration) ??
                xyzFrom(sens?.Accel) ??
                xyzFrom(payload?.Accel);
            if (direct) return direct;

            // ZigSim sometimes uses nested groups or arrays; do a bounded BFS scan.
            const queue: Array<{ v: any; depth: number; hintKey?: string }> = [{ v: payload, depth: 0 }];
            const maxDepth = 6;
            let seen = 0;
            const maxNodes = 1200;

            while (queue.length > 0) {
                const { v, depth, hintKey } = queue.shift()!;
                if (!v || depth > maxDepth) continue;
                if (seen++ > maxNodes) break;

                // If we arrived via an accel-looking key, try parse xyz from this value.
                if (hintKey && keyLooksAccel(hintKey)) {
                    const c = xyzFrom(v);
                    if (c) return c;
                }

                if (Array.isArray(v)) {
                    for (const item of v) queue.push({ v: item, depth: depth + 1 });
                    continue;
                }

                if (typeof v === 'object') {
                    // Special: array-like sensor packets {name/type: 'gyro', ...}
                    const name = typeof (v as any).name === 'string' ? (v as any).name.toLowerCase() : '';
                    const type = typeof (v as any).type === 'string' ? (v as any).type.toLowerCase() : '';
                    if (name.includes('accel') || name.includes('acceleration') || type.includes('accel') || type.includes('acceleration')) {
                        const c =
                            xyzFrom((v as any).value) ??
                            xyzFrom((v as any).data) ??
                            xyzFrom(v);
                        if (c) return c;
                    }

                    for (const [k, vv] of Object.entries(v as any)) {
                        if (vv == null) continue;
                        queue.push({ v: vv, depth: depth + 1, hintKey: k });
                    }
                }
            }

            return null;
        };

        const onMessage = (ev: MessageEvent) => {
            if (closed) return;
            let msg: any;
            try {
                msg = JSON.parse(String(ev.data));
            } catch {
                return;
            }
            if (!msg) return;

            const nowMs = Date.now();

            if (msg.type !== 'sensor') return;

            const a = extractAccel(msg.payload);
            if (!a) return;

            // Only use accel waveform (high-pass) to trigger BREAK.
            // Gesture: hold phone vertically, shake up-down (~10cm) → clear up/down waveform.
            const COOLDOWN_MS = 650;
            const WINDOW_MS = 900;
            const MIN_THRESHOLD = 0.35;  // avoid micro-jitters (units depend on sender)
            const THRESH_FACTOR = 2.2;   // adaptive gain
            const MAX_THRESHOLD = 2.5;   // cap so it won't "blow up" and never trigger
            const NEUTRAL_FACTOR = 0.35;

            const s = sensorShakeStateRef.current;
            if (nowMs - s.lastFireMs <= COOLDOWN_MS) return;

            // EWMA for per-axis baseline removal
            if (s.avgX === 0 && s.avgY === 0 && s.avgZ === 0) {
                s.avgX = a.x;
                s.avgY = a.y;
                s.avgZ = a.z;
            }
            s.avgX = s.avgX * 0.9 + a.x * 0.1;
            s.avgY = s.avgY * 0.9 + a.y * 0.1;
            s.avgZ = s.avgZ * 0.9 + a.z * 0.1;

            const hpX = a.x - s.avgX;
            const hpY = a.y - s.avgY;
            const hpZ = a.z - s.avgZ;

            // Pick the axis with the strongest current "wave" when idle, then lock during a cycle.
            const axisNow: 'x' | 'y' | 'z' =
                s.axis ??
                (Math.abs(hpY) >= Math.abs(hpX) && Math.abs(hpY) >= Math.abs(hpZ)
                    ? 'y'
                    : Math.abs(hpX) >= Math.abs(hpZ)
                      ? 'x'
                      : 'z');

            const hp = axisNow === 'x' ? hpX : axisNow === 'y' ? hpY : hpZ;

            // Track typical amplitude (adaptive) + clamp threshold
            s.absHpAvg = s.absHpAvg * 0.9 + Math.abs(hp) * 0.1;
            const threshold = Math.min(MAX_THRESHOLD, Math.max(MIN_THRESHOLD, s.absHpAvg * THRESH_FACTOR));
            const neutral = Math.max(MIN_THRESHOLD * 0.5, threshold * NEUTRAL_FACTOR);

            // Optional low-rate log (dev only) to help tune without UI
            if ((import.meta as any)?.env?.DEV && nowMs - s.lastLogMs > 1200) {
                s.lastLogMs = nowMs;
                // eslint-disable-next-line no-console
                console.log('[sensor accel]', { axis: axisNow, hp: Number(hp.toFixed(3)), threshold: Number(threshold.toFixed(3)), phase: s.phase });
            }

            if (Math.abs(hp) < neutral) s.wentNeutral = true;

            const reset = () => {
                s.phase = 'idle';
                s.wentNeutral = false;
                s.phaseTs = 0;
                s.axis = null;
            };

            const fire = () => {
                s.lastFireMs = nowMs;
                reset();
                sceneRef.current?.triggerDestroy();
            };

            if (s.phase === 'idle') {
                if (hp > threshold) {
                    s.phase = 'pos';
                    s.phaseTs = nowMs;
                    s.wentNeutral = false;
                    s.axis = axisNow;
                } else if (hp < -threshold) {
                    s.phase = 'neg';
                    s.phaseTs = nowMs;
                    s.wentNeutral = false;
                    s.axis = axisNow;
                }
                return;
            }

            if (nowMs - s.phaseTs > WINDOW_MS) {
                reset();
                return;
            }

            if (s.phase === 'pos') {
                if (s.wentNeutral && hp < -threshold) fire();
            } else if (s.phase === 'neg') {
                if (s.wentNeutral && hp > threshold) fire();
            }
        };

        try {
            ws = new WebSocket(wsUrl);
            // Keep logs (no in-UI debug overlay)
            ws.addEventListener('open', () => console.log('[sensor] ws open', wsUrl));
            ws.addEventListener('close', () => console.log('[sensor] ws closed', wsUrl));
            ws.addEventListener('error', () => console.log('[sensor] ws error', wsUrl));
            ws.addEventListener('message', onMessage);
        } catch {
            ws = null;
        }

        return () => {
            closed = true;
            try {
                if (ws) {
                    ws.removeEventListener('message', onMessage);
                    ws.close();
                }
            } catch {}
        };
    }, [SENSOR_ENABLED]);

    const handleJump = (e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        sceneRef.current?.triggerJump();
    };
    const handleDash = (e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        sceneRef.current?.triggerDash();
    };

    const handleClearAllItems = (e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        sceneRef.current?.clearAllItems();
    };

    const handleTransform = async () => {
        // Validate all required inputs
        if (!transformInput.trim() || !selectedObstacleId) {
            console.log('⚠️ Missing required input fields');
            alert('Please tell us what you would like to transform this into.');
            return;
        }
        
        console.log('🎮 Transform initiated:', { 
            input: transformInput,
            obstacleId: selectedObstacleId,
            starCount: starCount 
        });
        setIsTransforming(true);
        
        try {
            // Use AI to select appropriate good item based on user input
            console.log('🤖 Step 1: Importing AI service...');
            const { selectGoodItem, getGoodItemName } = await import('./services/geminiService');
            
            console.log('🤖 Step 2: Calling AI to select item for input:', transformInput);
            const goodItemId = await selectGoodItem(transformInput);
            const goodItemName = getGoodItemName(goodItemId);
            console.log('✅ AI selected good item:', goodItemId, '->', goodItemName);
            
            // Record the transformation
            const transformRecord: TransformationRecord = {
                badItem: currentBadItem,
                goodItem: goodItemName,  // Store friendly name for display
                reason: transformInput, // Use the single input as the reason/description
                recentEvent: "User transformation", // Placeholder
                timestamp: Date.now()
            };
            
            setTransformationRecords(prev => [...prev, transformRecord]);
            console.log('📝 Transformation recorded:', transformRecord);
            
            // Trigger transformation in game scene
            console.log('🎯 Step 3: Checking scene ref...');
            if (!sceneRef.current) {
                throw new Error('Scene ref not available');
            }
            
            console.log('✅ Scene ref exists');
            console.log('🎯 Step 4: Calling transformObstacle with:', {
                obstacleId: selectedObstacleId,
                goodItem: goodItemId
            });
            
            try {
                sceneRef.current.transformObstacle(selectedObstacleId, goodItemId);
                console.log('✅ transformObstacle completed without throwing');
            } catch (transformError) {
                console.error('❌ Error inside transformObstacle:', transformError);
                throw transformError;
            }
            
            // Close dialog and reset
            console.log('🎯 Step 5: Closing dialog...');
            setShowTransformDialog(false);
            setTransformInput('');
            setSelectedObstacleId(null);
            setCurrentBadItem('');
            console.log('✅ Dialog closed');
        } catch (error) {
            console.error('❌❌❌ Transform error caught:', error);
            console.error('Error details:', {
                message: (error as Error).message,
                stack: (error as Error).stack
            });
            alert('Transformation failed: ' + (error as Error).message);
        } finally {
            setIsTransforming(false);
        }
    };

    const handleCancelTransform = () => {
        setShowTransformDialog(false);
        setTransformInput('');
        setSelectedObstacleId(null);
        setCurrentBadItem('');
    };

    return (
        <div className="w-full h-screen relative bg-black overflow-hidden select-none">
            {/* Phaser Container */}
            <div ref={gameContainerRef} className="absolute inset-0" />

            {/* Top-right: one-click clear items */}
            <div
              className="absolute z-20 pointer-events-auto flex"
              style={{ top: 'clamp(12px, 2vh, 24px)', right: 'clamp(12px, 2vw, 30px)', gap: 'clamp(8px, 1vw, 14px)' }}
            >
              <button
                type="button"
                onClick={(e) => handleClearAllItems(e)}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 backdrop-blur-md shadow-[0_0_24px_rgba(92,255,212,0.18)] transition-transform duration-200 hover:scale-[1.03] hover:bg-black/70 active:scale-[0.98]"
                aria-label="Clear all items"
                title="Clear all items"
                style={{ width: 'clamp(42px, 6vh, 56px)', height: 'clamp(42px, 6vh, 56px)' }}
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* HUD */}
            <div className="absolute z-20 pointer-events-none" style={{ top: 'clamp(12px, 2vh, 24px)', left: 'clamp(12px, 2vw, 30px)' }}> {/* Position adjusted */}
                {/* Lucidity Meter */}
                <div className="flex items-center" style={{ gap: 'clamp(8px, 1vw, 16px)', marginBottom: 'clamp(12px, 2vh, 20px)' }}> {/* Gap increased */}
                    <div className={`rounded-full transition-all duration-500 ${score > 5 ? 'bg-white shadow-[0_0_15px_white]' : 'bg-gray-800 border border-gray-600'}`} style={{ width: 'clamp(12px, 2vh, 18px)', height: 'clamp(12px, 2vh, 18px)' }}></div> {/* Dot larger */}
                <div className="flex flex-col">
                        <span className="text-white font-mono tracking-widest font-bold shadow-black drop-shadow-md" style={{ fontSize: 'clamp(12px, 1.5vh, 16px)' }}>LUCIDITY</span> {/* Font larger */}
                        <div className="bg-gray-800 rounded-full overflow-hidden" style={{ width: 'clamp(100px, 13vw, 150px)', height: 'clamp(4px, 0.6vh, 7px)', marginTop: 'clamp(3px, 0.5vh, 6px)' }}> {/* Bar larger */}
                        <div className="h-full bg-white transition-all duration-500" style={{ width: `${Math.min(score * 10, 100)}%` }}></div>
                    </div>
                    </div>
                </div>

                {/* Star Counter */}
                <div className="flex items-center bg-black/30 backdrop-blur-sm border border-yellow-500/30" style={{ gap: 'clamp(8px, 1vw, 16px)', padding: 'clamp(4px, 1vh, 10px) clamp(10px, 1.5vw, 16px)', borderRadius: 'clamp(6px, 1vh, 12px)' }}> {/* Padding/gap larger */}
                    <svg className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,230,100,0.8)]" fill="currentColor" viewBox="0 0 20 20" style={{ width: 'clamp(18px, 3vh, 28px)', height: 'clamp(18px, 3vh, 28px)' }}> {/* Icon larger */}
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-yellow-400 font-mono font-bold drop-shadow-md" style={{ fontSize: 'clamp(16px, 2.2vh, 22px)' }}>{starCount}</span> {/* Text larger */}
                </div>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute text-white/50 font-mono text-right z-20 pointer-events-none" style={{ top: 'clamp(70px, 9vh, 88px)', right: 'clamp(9px, 1.5vw, 23px)', fontSize: 'clamp(8px, 1vh, 11px)' }}>
                <p>OBJ: BREAK OBSTACLES</p>
                <p>EXIT: {'>>>>'}</p>
            </div>

            {/* Virtual Controls - Optimized for Thumbs */}
            
            {/* Right Hand: Actions */}
            <div className="absolute z-20 flex items-end pointer-events-auto" style={{ bottom: 'clamp(12px, 2.4vh, 23px)', right: 'clamp(12px, 2.4vw, 29px)', gap: 'clamp(8px, 1.2vw, 15px)' }}>
                <button 
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseUp={(e) => {
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        sceneRef.current?.triggerDestroy();
                    }}
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        // preventDefault removed to avoid passive event listener warning
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        sceneRef.current?.triggerDestroy();
                    }}
                    className="rounded-full bg-red-500/20 border-2 border-red-500/40 backdrop-blur-sm active:bg-red-500/40 active:scale-95 transition-all flex items-center justify-center touch-manipulation"
                    style={{ width: 'clamp(57px, 8.25vh, 83px)', height: 'clamp(57px, 8.25vh, 83px)' }}
                >
                    <span className="text-red-200 font-bold tracking-wider pointer-events-none" style={{ fontSize: 'clamp(11px, 1.5vh, 15px)' }}>
                        💥<br/>BREAK
                    </span>
                </button>
                <button 
                    onClick={(e) => handleDash(e)}
                    className="rounded-full bg-orange-500/10 border-2 border-orange-500/30 backdrop-blur-sm active:bg-orange-500/30 active:scale-95 transition-all flex items-center justify-center text-orange-200/70 font-bold tracking-wider touch-manipulation"
                    style={{ width: 'clamp(57px, 8.25vh, 83px)', height: 'clamp(57px, 8.25vh, 83px)', marginBottom: 'clamp(5px, 0.75vh, 9px)', fontSize: 'clamp(12px, 1.65vh, 17px)' }}
                >
                    DASH
                </button>
                <button 
                    onClick={(e) => handleJump(e)}
                    className="rounded-full bg-blue-500/10 border-2 border-blue-500/30 backdrop-blur-sm active:bg-blue-500/30 active:scale-95 transition-all flex items-center justify-center touch-manipulation"
                    style={{ width: 'clamp(53px, 7.8vh, 72px)', height: 'clamp(53px, 7.8vh, 72px)' }}
                >
                    <span className="text-blue-200/70 font-bold tracking-wider" style={{ fontSize: 'clamp(9px, 1.2vh, 12px)' }}>JUMP</span>
                </button>
            </div>

            {/* Transform Dialog */}
            {showTransformDialog && (
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 flex items-end justify-center animate-fade-in"
                    style={{ paddingBottom: 'clamp(48px, 12vh, 144px)' }} // ⬆️ Raised up significantly
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCancelTransform();
                    }}
                >
                    <div 
                        className="w-full"
                        style={{ maxWidth: 'clamp(550px, 70vw, 1000px)', padding: '0 4vw' }} // 🔍 Larger max width
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Star Cost Info */}
                        <div className="flex items-center justify-center flex-wrap" style={{ gap: 'clamp(8px, 1.5vw, 16px)', marginBottom: 'clamp(8px, 1.5vh, 16px)' }}>
                            <div className="flex items-center bg-black/50 backdrop-blur-sm border border-yellow-400/30" style={{ gap: 'clamp(6px, 0.8vw, 10px)', padding: 'clamp(6px, 0.8vh, 10px) clamp(10px, 1.5vw, 16px)', borderRadius: 'clamp(6px, 1vh, 10px)' }}>
                                <svg className="text-yellow-400" fill="currentColor" viewBox="0 0 20 20" style={{ width: 'clamp(14px, 2vh, 20px)', height: 'clamp(14px, 2vh, 20px)' }}> {/* Larger icon */}
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-white/90" style={{ fontSize: 'clamp(11px, 1.5vh, 18px)' }}> {/* Larger text */}
                                    You have: <span className="text-yellow-400 font-bold">{starCount}</span>
                                </span>
                            </div>
                            <div className="flex items-center bg-black/50 backdrop-blur-sm border border-amber-500/30" style={{ gap: 'clamp(6px, 0.8vw, 10px)', padding: 'clamp(6px, 0.8vh, 10px) clamp(10px, 1.5vw, 16px)', borderRadius: 'clamp(6px, 1vh, 10px)' }}>
                                <span className="text-white/90" style={{ fontSize: 'clamp(11px, 1.5vh, 18px)' }}> {/* Larger text */}
                                    Cost: <span className="text-amber-300 font-bold">3 ⭐</span>
                                </span>
                            </div>
                        </div>

                        {/* Prompt Text */}
                        <p className="text-white text-center italic drop-shadow-2xl font-cinzel" style={{ marginBottom: 'clamp(8px, 1.5vh, 16px)', fontSize: 'clamp(14px, 1.8vh, 20px)' }}> {/* Larger text */}
                            "Let's transform this together..."
                        </p>

                        {/* Input Box - Simplified to Single Question */}
                        <div className="bg-black/50 backdrop-blur-lg border border-white/20 shadow-2xl" style={{ borderRadius: 'clamp(12px, 2vh, 24px)', padding: 'clamp(12px, 2vh, 24px) clamp(12px, 2vw, 24px)', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vh, 20px)' }}> {/* Larger padding/gap */}
                            
                            {/* Question 1: What to transform into */}
                            <div>
                                <label className="block text-amber-300/90 font-semibold" style={{ marginBottom: 'clamp(6px, 1vh, 10px)', fontSize: 'clamp(12px, 1.5vh, 18px)' }}> {/* Larger text */}
                                    💫 What do you need to light yourself up?
                                </label>
                                <textarea
                                    value={transformInput}
                                    onChange={(e) => setTransformInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ') e.stopPropagation();
                                    }}
                                    placeholder="e.g., a comfortable bed, a warm hug, a safe place..."
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 resize-none"
                                    style={{
                                        height: 'clamp(70px, 11vh, 130px)', // Larger height
                                        borderRadius: 'clamp(8px, 1vh, 12px)',
                                        padding: 'clamp(8px, 1.5vh, 12px) clamp(8px, 1.5vw, 12px)',
                                        fontSize: 'clamp(12px, 1.5vh, 18px)' // Larger font
                                    }}
                                    disabled={isTransforming}
                                    autoFocus
                                />
                            </div>

                            <p className="text-white/50 text-center italic" style={{ fontSize: 'clamp(10px, 1.3vh, 15px)' }}> {/* Larger text */}
                                🌟 Your journey towards healing is deeply personal. AI will help guide your transformation.
                            </p>

                            {/* Buttons */}
                            <div className="flex" style={{ gap: 'clamp(10px, 1.5vw, 16px)', marginTop: 'clamp(8px, 1.5vh, 16px)' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelTransform();
                                    }}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/30"
                                    style={{
                                        padding: 'clamp(10px, 1.5vh, 18px)',
                                        borderRadius: 'clamp(8px, 1vh, 12px)',
                                        fontSize: 'clamp(12px, 1.5vh, 18px)'
                                    }}
                                    disabled={isTransforming}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTransform();
                                    }}
                                    disabled={!transformInput.trim() || isTransforming}
                                    className={`group flex items-center justify-center flex-1 font-bold hover:scale-[1.02] disabled:scale-100 transition-all shadow-lg disabled:cursor-not-allowed ${
                                        transformInput.trim() && !isTransforming
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/50' 
                                            : 'bg-gray-700 opacity-50 text-gray-400'
                                    }`}
                                    style={{
                                        padding: 'clamp(10px, 1.5vh, 18px)',
                                        borderRadius: 'clamp(8px, 1vh, 12px)',
                                        fontSize: 'clamp(12px, 1.5vh, 18px)',
                                        gap: 'clamp(6px, 0.8vw, 10px)'
                                    }}
                                >
                                    {isTransforming ? (
                                        <>
                                            <Loader2 className="animate-spin" style={{ width: 'clamp(14px, 2vh, 20px)', height: 'clamp(14px, 2vh, 20px)' }} />
                                            <span>Transforming...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Transform</span>
                                            <ChevronRight className="group-hover:translate-x-1 transition-transform" style={{ width: 'clamp(14px, 2vh, 20px)', height: 'clamp(14px, 2vh, 20px)' }} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ResultScreen = ({
  analysis,
  score,
  onRetry,
  deepAnalysis,
  gameSummary,
  transformationRecords
}: {
    analysis: DreamAnalysis | null, 
    score: number, 
    onRetry: () => void,
    deepAnalysis: DeepAnalysis | null,
    gameSummary?: GameSummary | null,
    transformationRecords?: TransformationRecord[]
}) => {
    const isAnalyzing = !deepAnalysis;
    
    const scenarioNames: { [key: string]: string } = {
        A: "Abandoned Classroom",
        B: "Endless Forest", 
        C: "Falling Abyss",
        D: "Lonely Room"
    };

    const isWorkspace = gameSummary?.sceneMode === 'workspace';
    const archetypeName = isWorkspace ? 'Workplace' : (analysis?.scenarioId ? scenarioNames[analysis.scenarioId] : 'Unknown');
    const archetypeKeywords = isWorkspace
      ? ['work', 'routine', 'pressure', 'transition', 'control']
      : (analysis?.keywords ?? []);

    // Prefer the newest backgrounds: if the run was workspace, use workspace outdoor.
    // Otherwise, fall back to the legacy home stage4 (keeps page stable even if other folders are missing).
    const resultBgUrl =
      gameSummary?.sceneMode === 'workspace'
        ? './assets/backgrounds/workspace/workspace-%20outdoor.jpg'
        : './assets/backgrounds/home/stage4.png';

    return (
        <div className="w-full h-screen relative overflow-hidden animate-fade-in font-lato flex items-center justify-center">
            {/* Background - Bright game scene (stage4) */}
            <div 
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${resultBgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Dark overlay for consistency */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

            {/* Main Content Container - Centered with max height */}
            <div 
                className="relative z-10 w-full flex flex-col items-center justify-center" 
                style={{ 
                    maxWidth: 'clamp(500px, 85vw, 1100px)', 
                    maxHeight: '92vh',
                    padding: '0 2vw',
                    transform: 'scale(0.8)', // 🔍 Scale down entire UI to 0.8x
                    transformOrigin: 'center'
                }}
            >
                {/* Fixed Header: Title */}
                <div className="shrink-0 text-center mb-2">
                    <p className="text-white italic drop-shadow-2xl font-cinzel" style={{ fontSize: 'clamp(16px, 2.5vh, 22px)' }}>
                        "Waking up from your dream..."
                    </p>
                </div>

                {/* Scrollable Content Card */}
                <div 
                    className="bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar" 
                    style={{ 
                        borderRadius: '16px', 
                        padding: 'clamp(16px, 2.5vh, 24px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(12px, 2vh, 20px)'
                    }}
                >
                    {/* Top Row: Archetype & Stats & Keywords (Grid Layout) */}
                    <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
                        
                        {/* Left: Dream Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white/50 text-xs uppercase tracking-wider">Dream Archetype</span>
                                <div className="h-[1px] bg-white/10 flex-1"></div>
                            </div>
                            <h3 className="font-bold text-white leading-tight mb-2" style={{ fontSize: 'clamp(18px, 3vh, 24px)' }}>
                                {archetypeName}
                            </h3>
                            
                            {/* Keywords */}
                            <div className="flex flex-wrap gap-1.5">
                                {archetypeKeywords.map(k => (
                                    <span 
                                        key={k} 
                                        className="bg-amber-500/10 text-amber-200 rounded-md border border-amber-500/20"
                                        style={{ padding: '2px 8px', fontSize: '11px' }}
                                    >
                                        #{k}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: Score Stats */}
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center p-2">
                                <span className="font-bold text-white leading-none" style={{ fontSize: 'clamp(20px, 4vh, 32px)' }}>{score}</span>
                                <span className="text-white/40 text-[9px] uppercase tracking-wider mt-1">Cleared</span>
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center p-2">
                                <span className="font-bold text-green-400 leading-none" style={{ fontSize: 'clamp(20px, 4vh, 32px)' }}>✓</span>
                                <span className="text-white/40 text-[9px] uppercase tracking-wider mt-1">Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Insight Box (Highlighted) */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-l-2 border-blue-400 rounded-r-lg p-3">
                        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">💫 Insight</p>
                        <p className="text-white/90 italic text-sm leading-relaxed">
                            "{analysis?.healingMessage}"
                        </p>
                    </div>

                    {/* Transformation Records List */}
                    {transformationRecords && transformationRecords.length > 0 && (
                        <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg p-3">
                            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-2">🔄 Your Transformations</p>
                            <div className="flex flex-col gap-2">
                                {transformationRecords.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-white/5 rounded-md p-2">
                                        <span className="text-blue-400 text-xs font-bold shrink-0 mt-0.5">#{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-white/50 text-[11px] line-through">{rec.badItem}</span>
                                                <span className="text-blue-400/60 text-[11px]">→</span>
                                                <span className="text-blue-200 text-[11px] font-semibold">{rec.goodItem}</span>
                                            </div>
                                            {rec.reason && (
                                                <p className="text-white/40 text-[10px] mt-0.5 italic">"{rec.reason}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Deep Analysis Grid (2x2) */}
                    {isAnalyzing ? (
                        <div className="bg-white/5 rounded-lg p-6 flex flex-col items-center justify-center gap-3 border border-dashed border-white/10">
                            <Loader2 className="animate-spin text-blue-300 w-6 h-6" />
                            <p className="text-blue-200 text-xs animate-pulse">Analyzing your subconscious journey...</p>
                        </div>
                    ) : deepAnalysis && (
                        <div className="grid grid-cols-2 gap-3">
                            {/* 1. Psychological Insight */}
                            <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">💡 Psychological</p>
                                <p className="text-white/80 text-xs leading-relaxed">{deepAnalysis.psychologicalInsight}</p>
                            </div>
                            
                            {/* 2. Emotional Pattern */}
                            <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-lg p-3">
                                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1">💗 Emotional</p>
                                <p className="text-white/80 text-xs leading-relaxed">{deepAnalysis.emotionalPattern}</p>
                            </div>
                            
                            {/* 3. Transformation Summary */}
                            <div className="bg-sky-900/10 border border-sky-500/20 rounded-lg p-3">
                                <p className="text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-1">✨ Transformations</p>
                                <p className="text-white/80 text-xs leading-relaxed">{deepAnalysis.transformationSummary}</p>
                            </div>
                            
                            {/* 4. Healing Guidance */}
                            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-lg p-3">
                                <p className="text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-1">🌱 Guidance</p>
                                <p className="text-white/80 text-xs leading-relaxed">{deepAnalysis.healingGuidance}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex gap-3 mt-1 pt-2 border-t border-white/10">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm py-3 rounded-lg border border-white/20 transition-all">
                            <Save size={16} /> 
                            <span>Save</span>
                        </button>
                        <button 
                            onClick={onRetry}
                            className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3 rounded-lg shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.01]"
                        >
                            <RefreshCw size={16} /> 
                            <span>Dream Again</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `}} />
        </div>
    );
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('chair'); // Default character
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [transformationRecords, setTransformationRecords] = useState<TransformationRecord[]>([]);
  const [finalDeepAnalysis, setFinalDeepAnalysis] = useState<DeepAnalysis | null>(null);
  const [lastGameSummary, setLastGameSummary] = useState<GameSummary | null>(null);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const navStackRef = useRef<AppScreen[]>([]);
  
  // Background music management
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const musicStartedRef = useRef<boolean>(false);

  const goToScreen = (next: AppScreen) => {
    navStackRef.current.push(screen);
    setScreen(next);
  };

  const goBack = () => {
    const prev = navStackRef.current.pop();
    setScreen(prev ?? AppScreen.SPLASH);
  };

  const goHome = () => {
    navStackRef.current = [];
    setScreen(AppScreen.SPLASH);
  };

  // Function to start background music (called on user interaction)
  const startBackgroundMusic = () => {
    if (!musicStartedRef.current && !bgMusicRef.current) {
      // Create audio element
      const audio = new Audio('./assets/sounds/enter+analysis.mp3');
      audio.loop = true;
      audio.volume = musicVolume;
      bgMusicRef.current = audio;
      
      // Play audio
      audio.play().then(() => {
        console.log('🎵 Background music started');
        musicStartedRef.current = true;
      }).catch(error => {
        console.warn('Background music play failed:', error);
      });
    }
  };

  // Handle background music based on screen changes
  useEffect(() => {
    const musicAllowedScreens = new Set<AppScreen>([
      AppScreen.SPLASH,
      AppScreen.INPUT,
      AppScreen.HISTORY,
      AppScreen.CONNECT,
      AppScreen.SETTINGS,
      AppScreen.PROFILE,
      AppScreen.COMMUNITY
    ]);
    // On LOADING screen (analysis started), fade out over 3 seconds
    if (screen === AppScreen.LOADING) {
      if (bgMusicRef.current) {
        const audio = bgMusicRef.current;
        const startVolume = audio.volume;
        const fadeOutDuration = 3000; // 3 seconds
        const fadeStep = 50; // Update every 50ms
        const volumeDecrement = startVolume / (fadeOutDuration / fadeStep);
        
        console.log('🎵 Background music fading out (3s)...');
        
        const fadeInterval = setInterval(() => {
          if (audio.volume > volumeDecrement) {
            audio.volume = Math.max(0, audio.volume - volumeDecrement);
          } else {
            audio.volume = 0;
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fadeInterval);
            bgMusicRef.current = null;
            musicStartedRef.current = false;
            console.log('🎵 Background music stopped');
          }
        }, fadeStep);
      }
    }
    // Stop immediately when leaving menu/input screens
    else if (!musicAllowedScreens.has(screen)) {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
        bgMusicRef.current = null;
        musicStartedRef.current = false;
        console.log('🎵 Background music stopped immediately');
      }
    }
  }, [screen]);

  // Live-update volume while music is playing
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  const handleAnalysisComplete = (result: DreamAnalysis) => {
      setAnalysis(result);
      // After analysis, go to character selection (AI has recommended characters)
      setScreen(AppScreen.CHARACTER_SELECT);
  };

  const handleCharacterSelect = (characterId: string) => {
      setSelectedCharacter(characterId);
      setScreen(AppScreen.GAMEPLAY);
  };

  const handleGameOver = (_success?: boolean, summary?: GameSummary) => {
      if (summary) setLastGameSummary(summary);
      // After finishing (outdoor end-zone hold), show a black-screen analysis transition.
      setScreen(AppScreen.RESULT_LOADING);
  };

  const handleRetry = () => {
      setGameScore(0);
      setUserInput('');
      setAnalysis(null);
      setTransformationRecords([]); // Reset transformation records
      setFinalDeepAnalysis(null);
      goToScreen(AppScreen.INPUT);
  };

  const gameplayConfig = useMemo(() => ({
    ...SCENARIO_CONFIGS[analysis?.scenarioId || ScenarioId.D],
    playerCharacter: selectedCharacter
  }), [analysis?.scenarioId, selectedCharacter]);

  switch (screen) {
    case AppScreen.SPLASH:
      return (
        <SplashScreen
          onBuildNewDream={() => {
            startBackgroundMusic(); // Start music on user interaction
            goToScreen(AppScreen.INPUT);
          }}
          onOpenHistory={() => {
            startBackgroundMusic();
            goToScreen(AppScreen.HISTORY);
          }}
          onOpenConnect={() => {
            startBackgroundMusic();
            goToScreen(AppScreen.CONNECT);
          }}
          onOpenSettings={() => {
            startBackgroundMusic();
            goToScreen(AppScreen.SETTINGS);
          }}
          onOpenProfile={() => {
            startBackgroundMusic();
            goToScreen(AppScreen.PROFILE);
          }}
          onOpenCommunity={() => {
            startBackgroundMusic();
            goToScreen(AppScreen.COMMUNITY);
          }}
        />
      );

    case AppScreen.HISTORY:
      return <HistoryDreamsScreen onBack={goBack} />;

    case AppScreen.CONNECT:
      return <ConnectScreen onBack={goBack} />;

    case AppScreen.SETTINGS:
      return (
        <SettingsScreen
          onBack={goBack}
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
        />
      );

    case AppScreen.PROFILE:
      return <ProfileScreen onBack={goBack} />;

    case AppScreen.COMMUNITY:
      return <CommunityScreen onBack={goBack} />;
    
    case AppScreen.INPUT:
      return <InputScreen onBack={goBack} onAnalyze={(text) => { setUserInput(text); setScreen(AppScreen.LOADING); }} />;
    
    case AppScreen.LOADING:
      return <LoadingScreen userInput={userInput} onComplete={handleAnalysisComplete} />;
    
    case AppScreen.CHARACTER_SELECT:
      return (
        <CharacterSelectScreen 
          characters={analysis?.recommendedCharacters || []} 
          onSelect={handleCharacterSelect} 
          onHome={goHome}
          onRegenerate={() => {
            setAnalysis(null);
            setScreen(AppScreen.LOADING);
          }}
        />
      );
    
    case AppScreen.GAMEPLAY:
      return (
        <GameplayScreen 
            config={gameplayConfig} 
            onGameOver={handleGameOver}
            onScoreUpdate={setGameScore}
            transformationRecords={transformationRecords}
            setTransformationRecords={setTransformationRecords}
        />
      );
    
    case AppScreen.RESULT_LOADING:
      return (
        <ResultLoadingScreen
          originalDream={userInput}
          transformationRecords={transformationRecords}
          scenarioId={analysis?.scenarioId}
          selectedCharacterId={selectedCharacter}
          gameSummary={lastGameSummary}
          onComplete={(deep) => {
            setFinalDeepAnalysis(deep);
            setScreen(AppScreen.RESULT);
          }}
        />
      );
    
    case AppScreen.RESULT:
      return (
        <ResultScreen
          analysis={analysis}
          score={gameScore}
          onRetry={handleRetry}
          deepAnalysis={finalDeepAnalysis}
          gameSummary={lastGameSummary}
          transformationRecords={transformationRecords}
        />
      );
    
    default:
      return null;
  }
}