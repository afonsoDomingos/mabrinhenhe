import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, ArrowLeft, Music, Globe, Video, Share2 } from 'lucide-react';
import './ArtistPage.css';

const ArtistPage = ({ artistId, onBack }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch(`/api/artists/${artistId}`)
      .then(r => r.json())
      .then(data => { setArtist(data); setLoading(false); })
      .catch(() => setLoading(false));

    fetch('/api/events')
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []));
  }, [artistId]);

  const artistEvents = events.filter(e =>
    Array.isArray(e.artists) && e.artists.some(a =>
      a.toLowerCase().includes(artist?.name?.toLowerCase() || '')
    )
  );

  if (loading) return (
    <div className="artist-page-loading">
      <div className="spinner"></div>
      <p>A carregar perfil...</p>
    </div>
  );

  if (!artist || artist.error) return (
    <div className="artist-page-loading">
      <p>Artista não encontrado.</p>
      <button className="back-btn" onClick={onBack}><ArrowLeft size={18}/> Voltar</button>
    </div>
  );

  return (
    <div className="artist-page">
      {/* Hero Banner */}
      <motion.div
        className="artist-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="artist-hero-bg" style={artist.imageUrl ? { backgroundImage: `url(${artist.imageUrl})` } : {}} />
        <div className="artist-hero-overlay" />
        <div className="container artist-hero-content">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={18}/> Todos os Artistas
          </button>
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
              {/* Social Links */}
              <div className="social-links">
                {artist.instagram && (
                  <a href={artist.instagram} target="_blank" rel="noreferrer" className="social-link instagram" aria-label="Instagram">
                    <Globe size={18}/> Instagram
                  </a>
                )}
                {artist.tiktok && (
                  <a href={artist.tiktok} target="_blank" rel="noreferrer" className="social-link tiktok" aria-label="TikTok">
                    <Music size={18}/> TikTok
                  </a>
                )}
                {artist.youtube && (
                  <a href={artist.youtube} target="_blank" rel="noreferrer" className="social-link youtube" aria-label="YouTube">
                    <Video size={18}/> YouTube
                  </a>
                )}
                {artist.spotify && (
                  <a href={artist.spotify} target="_blank" rel="noreferrer" className="social-link spotify" aria-label="Spotify">
                    <Music size={18}/> Spotify
                  </a>
                )}
                {artist.facebook && (
                  <a href={artist.facebook} target="_blank" rel="noreferrer" className="social-link facebook" aria-label="Facebook">
                    <Share2 size={18}/> Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container artist-page-body">
        <div className="artist-page-grid">
          {/* Left: Bio */}
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

            {/* Spotify Embed */}
            {artist.spotify && artist.spotify.includes('spotify.com') && (
              <div className="artist-spotify-embed">
                <h3>🎵 Ouvir no Spotify</h3>
                <iframe
                  src={`https://open.spotify.com/embed/artist/${artist.spotify.split('/artist/')[1]?.split('?')[0]}`}
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`Spotify - ${artist.name}`}
                ></iframe>
              </div>
            )}

            {/* YouTube Embed */}
            {artist.youtube && artist.youtube.includes('youtube.com/channel') && (
              <div className="artist-youtube-embed">
                <h3>▶ Canal no YouTube</h3>
                <a href={artist.youtube} target="_blank" rel="noreferrer" className="youtube-link-btn">
                  <Video size={20}/> Abrir Canal no YouTube
                </a>
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
            <h2>EVENTOS</h2>
            {artistEvents.length === 0 ? (
              <div className="no-events glass">
                <p>Nenhum evento associado a este artista.</p>
              </div>
            ) : (
              <div className="artist-event-list">
                {artistEvents.map(ev => (
                  <div key={ev._id} className={`artist-event-card glass ${ev.status}`}>
                    {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} className="artist-event-img" />}
                    <div className="artist-event-info">
                      <span className={`status-dot ${ev.status}`}>{ev.status === 'upcoming' ? '● Próximo' : '● Passado'}</span>
                      <h4>{ev.title}</h4>
                      <p>{ev.date} · {ev.time}</p>
                      <p>{ev.location}</p>
                      {ev.status === 'upcoming' && ev.ticketUrl && (
                        <a href={ev.ticketUrl} target="_blank" rel="noreferrer" className="btn-tickets">Bilhetes →</a>
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
