import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, ArrowLeft, Play, Pause, Disc, Share2, Check } from 'lucide-react';
import { InstagramIcon, TiktokIcon, YoutubeIcon, SpotifyIcon, FacebookIcon } from '../components/SocialIcons';
import './ArtistPage.css';

const ArtistPage = ({ artistId, onBack }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [audioObj, setAudioObj] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?artist=${artist._id}`;
    const shareData = {
      title: `${artist.name} — Mabrinhenhe Entretenimento`,
      text: `Confira o perfil oficial de ${artist.name} na Mabrinhenhe Entretenimento!`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    fetch(`/api/artists/${artistId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setArtist(data);
          setLoading(false);
        } else {
          // Fallback: fetch all artists and find by _id or name
          return fetch('/api/artists')
            .then((r) => r.json())
            .then((all) => {
              if (Array.isArray(all)) {
                const found = all.find(
                  (a) =>
                    a._id === artistId ||
                    a.name?.toLowerCase() === String(artistId).toLowerCase()
                );
                setArtist(found || null);
              }
              setLoading(false);
            });
        }
      })
      .catch(() => {
        // Fallback catch
        fetch('/api/artists')
          .then((r) => r.json())
          .then((all) => {
            if (Array.isArray(all)) {
              const found = all.find(
                (a) =>
                  a._id === artistId ||
                  a.name?.toLowerCase() === String(artistId).toLowerCase()
              );
              setArtist(found || null);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });

    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []));

    fetch('/api/tracks')
      .then((r) => r.json())
      .then((data) => setTracks(Array.isArray(data) ? data : []));
  }, [artistId]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioObj) {
        audioObj.pause();
      }
    };
  }, [audioObj]);

  const togglePlayTrack = (track) => {
    if (playingTrackId === track._id) {
      audioObj.pause();
      setPlayingTrackId(null);
    } else {
      if (audioObj) audioObj.pause();
      const newAudio = new Audio(track.audioUrl);
      newAudio.play();
      setAudioObj(newAudio);
      setPlayingTrackId(track._id);
      newAudio.onended = () => setPlayingTrackId(null);
    }
  };

  const artistEvents = events.filter((e) =>
    Array.isArray(e.artists)
      ? e.artists.some((a) => a.toLowerCase().includes(artist?.name?.toLowerCase() || ''))
      : typeof e.artists === 'string' && e.artists.toLowerCase().includes(artist?.name?.toLowerCase() || '')
  );

  const artistTracks = tracks.filter((t) =>
    t.artistName?.toLowerCase().includes(artist?.name?.toLowerCase() || '') ||
    artist?.name?.toLowerCase().includes(t.artistName?.toLowerCase() || '')
  );

  if (loading)
    return (
      <div className="artist-page-loading">
        <div className="spinner"></div>
        <p>A carregar perfil do artista...</p>
      </div>
    );

  if (!artist || artist.error)
    return (
      <div className="artist-page-loading">
        <p>Artista não encontrado.</p>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Voltar
        </button>
      </div>
    );

  return (
    <div className="artist-page">
      {/* Fixed top back bar */}
      <div className="artist-page-topbar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar aos Artistas
        </button>
      </div>

      {/* Hero Banner */}
      <motion.div
        className="artist-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="artist-hero-bg"
          style={artist.imageUrl ? { backgroundImage: `url(${artist.imageUrl})` } : {}}
        />
        <div className="artist-hero-overlay" />
        <div className="container artist-hero-content">
          <div className="artist-hero-info">
            {artist.imageUrl ? (
              <motion.img
                src={artist.imageUrl}
                alt={artist.name}
                className="artist-page-photo"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            ) : (
              <div className="artist-page-photo-placeholder">
                <Mic2 size={48} />
              </div>
            )}
            <div>
              {artist.featured && <span className="featured-tag">⭐ ARTISTA EM DESTAQUE</span>}
              <h1>{artist.name}</h1>
              <p className="artist-page-genre">{artist.genre}</p>

              {/* Social Links & Share */}
              <div className="social-links">
                <button
                  type="button"
                  className={`social-link share-btn ${copied ? 'copied' : ''}`}
                  onClick={handleShare}
                  title="Partilhar perfil do artista"
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                  <span>{copied ? 'Link Copiado!' : 'Partilhar Perfil'}</span>
                </button>
                {artist.instagram && (
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link instagram"
                    aria-label="Instagram"
                  >
                    <InstagramIcon size={16} /> Instagram
                  </a>
                )}
                {artist.tiktok && (
                  <a
                    href={artist.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link tiktok"
                    aria-label="TikTok"
                  >
                    <TiktokIcon size={16} /> TikTok
                  </a>
                )}
                {artist.youtube && (
                  <a
                    href={artist.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link youtube"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon size={16} /> YouTube
                  </a>
                )}
                {artist.spotify && (
                  <a
                    href={artist.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link spotify"
                    aria-label="Spotify"
                  >
                    <SpotifyIcon size={16} /> Spotify
                  </a>
                )}
                {artist.facebook && (
                  <a
                    href={artist.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="social-link facebook"
                    aria-label="Facebook"
                  >
                    <FacebookIcon size={16} /> Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Body */}
      <div className="container artist-page-body">
        <div className="artist-page-grid">
          {/* Left: Bio & Music Player */}
          <motion.div
            className="artist-bio-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>SOBRE O ARTISTA</h2>
            <p className="artist-short-desc">{artist.description}</p>
            {artist.bio && (
              <div className="artist-full-bio">
                {artist.bio.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
              </div>
            )}

            {/* Artist Tracks Player Section */}
            {artistTracks.length > 0 && (
              <div className="artist-tracks-section">
                <h3><Disc size={20} /> Faixas & Músicas</h3>
                <div className="artist-tracks-list">
                  {artistTracks.map((track) => (
                    <div
                      key={track._id}
                      className={`artist-track-item glass ${playingTrackId === track._id ? 'playing' : ''}`}
                    >
                      <button
                        className="track-play-btn"
                        onClick={() => togglePlayTrack(track)}
                        title={playingTrackId === track._id ? 'Pausar' : 'Ouvir'}
                      >
                        {playingTrackId === track._id ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <div className="track-details">
                        <h4>{track.title}</h4>
                        <span>{track.artistName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spotify Embed */}
            {artist.spotify && artist.spotify.includes('spotify.com') && (
              <div className="artist-spotify-embed">
                <h3>🎵 Player Spotify</h3>
                <iframe
                  src={`https://open.spotify.com/embed/artist/${
                    artist.spotify.split('/artist/')[1]?.split('?')[0]
                  }`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`Spotify - ${artist.name}`}
                ></iframe>
              </div>
            )}
          </motion.div>

          {/* Right: Events */}
          <motion.div
            className="artist-events-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>EVENTOS PARTICIPANTES</h2>
            {artistEvents.length === 0 ? (
              <div className="no-events glass">
                <p>Nenhum evento agendado para este artista de momento.</p>
              </div>
            ) : (
              <div className="artist-event-list">
                {artistEvents.map((ev) => (
                  <div key={ev._id} className={`artist-event-card glass ${ev.status}`}>
                    {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} className="artist-event-img" />}
                    <div className="artist-event-info">
                      <span className={`status-dot ${ev.status}`}>
                        {ev.status === 'upcoming' ? '● Próximo' : '● Passado'}
                      </span>
                      <h4>{ev.title}</h4>
                      <p>{ev.date} · {ev.time}</p>
                      <p>{ev.location}</p>
                      {ev.status === 'upcoming' && ev.ticketUrl && (
                        <a href={ev.ticketUrl} target="_blank" rel="noreferrer" className="btn-tickets">
                          Bilhetes →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
