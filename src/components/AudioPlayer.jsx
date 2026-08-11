import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AudioPlayer.css';

const AudioPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/api/tracks')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
        } else {
          setTracks([]);
        }
      })
      .catch(() => setTracks([]));
  }, []);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, currentTrack]);

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  if (!isVisible || tracks.length === 0 || !currentTrack) return null;

  return (
    <div className="audio-player-wrapper">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <AnimatePresence>
        <motion.div
          className={`audio-player-card glass ${isMinimized ? 'minimized' : ''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Progress bar line */}
          <div className="audio-progress-bar" style={{ width: `${progress}%` }} />

          <div className="audio-player-inner">
            {/* Equalizer icon / Album Art */}
            <div className={`audio-disc ${isPlaying ? 'spinning' : ''}`}>
              <Music size={18} />
            </div>

            {/* Track Metadata */}
            {!isMinimized && (
              <div className="audio-info">
                <span className="audio-track-title">{currentTrack.title}</span>
                <span className="audio-artist-name">{currentTrack.artistName}</span>
              </div>
            )}

            {/* Controls */}
            <div className="audio-controls">
              <button className="audio-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Pausar' : 'Tocar'}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
              </button>

              {!isMinimized && (
                <button className="audio-btn mute-btn" onClick={toggleMute} title={isMuted ? 'Ativar som' : 'Mudar para mudo'}>
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              )}

              <button
                className="audio-btn toggle-min-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <button className="audio-btn close-btn" onClick={() => setIsVisible(false)} title="Fechar Player">
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AudioPlayer;
