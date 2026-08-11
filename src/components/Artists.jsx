import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic2 } from 'lucide-react';
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
        <div className="section-header">
          <h2>NOSSOS ARTISTAS</h2>
          <p>Talentos únicos promovidos pela Mabrinhenhe Entretenimento</p>
        </div>

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
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                onClick={() => onSelectArtist && onSelectArtist(artist._id)}
                style={{ cursor: 'pointer' }}
              >
                {artist.featured && <span className="featured-badge">DESTAQUE</span>}
                {artist.imageUrl ? (
                  <img src={artist.imageUrl} alt={artist.name} className="artist-img" />
                ) : (
                  <div className="artist-avatar-placeholder">
                    <Mic2 size={40} />
                  </div>
                )}
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <span className="artist-genre">{artist.genre}</span>
                  <p className="artist-desc">{artist.description}</p>
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
