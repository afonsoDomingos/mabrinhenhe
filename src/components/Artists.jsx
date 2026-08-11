import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2, ArrowRight } from 'lucide-react';
import { InstagramIcon, TiktokIcon, YoutubeIcon, SpotifyIcon, FacebookIcon } from './SocialIcons';
import './Artists.css';

const Artists = ({ onSelectArtist }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artists')
      .then((r) => r.json())
      .then((data) => {
        setArtists(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="artists-section" id="artistas">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2>NOSSOS ARTISTAS</h2>
          <p>Talentos únicos promovidos pela Mabrinhenhe Entretenimento</p>
        </motion.div>

        {loading ? (
          <div className="loading-state">A carregar artistas...</div>
        ) : artists.length === 0 ? (
          <div className="empty-state">Nenhum artista adicionado ainda. Adicione no painel de admin.</div>
        ) : (
          <motion.div
            className="artists-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {artists.map((artist) => (
              <motion.div
                key={artist._id}
                className={`artist-card glass ${artist.featured ? 'featured' : ''}`}
                variants={cardVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                onClick={() => onSelectArtist && onSelectArtist(artist._id)}
                style={{ cursor: 'pointer' }}
              >
                {artist.featured && <span className="featured-badge">DESTAQUE</span>}
                <div className="artist-card-header">
                  {artist.imageUrl ? (
                    <img src={artist.imageUrl} alt={artist.name} className="artist-img" />
                  ) : (
                    <div className="artist-avatar-placeholder">
                      <Mic2 size={36} />
                    </div>
                  )}
                </div>

                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <span className="artist-genre">{artist.genre}</span>
                  <p className="artist-desc">{artist.description}</p>
                </div>

                <div className="artist-card-footer">
                  {/* Social Icons Quick Bar */}
                  <div className="artist-card-socials">
                    {artist.instagram && (
                      <a
                        href={artist.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-btn instagram"
                        title="Instagram"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <InstagramIcon size={14} />
                      </a>
                    )}
                    {artist.tiktok && (
                      <a
                        href={artist.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-btn tiktok"
                        title="TikTok"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TiktokIcon size={14} />
                      </a>
                    )}
                    {artist.youtube && (
                      <a
                        href={artist.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-btn youtube"
                        title="YouTube"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <YoutubeIcon size={14} />
                      </a>
                    )}
                    {artist.spotify && (
                      <a
                        href={artist.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-btn spotify"
                        title="Spotify"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SpotifyIcon size={14} />
                      </a>
                    )}
                    {artist.facebook && (
                      <a
                        href={artist.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-btn facebook"
                        title="Facebook"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FacebookIcon size={14} />
                      </a>
                    )}
                  </div>

                  <span className="view-profile-link">
                    Ver Perfil <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Artists;
