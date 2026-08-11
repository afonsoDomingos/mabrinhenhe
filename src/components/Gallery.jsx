import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Calendar } from 'lucide-react';
import './Gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data);
        }
      })
      .catch(() => setPhotos([]));
  }, []);

  const categories = ['Todos', ...new Set(photos.map((p) => p.category || 'Geral'))];

  const filteredPhotos = filter === 'Todos' ? photos : photos.filter((p) => p.category === filter);

  return (
    <section className="gallery-section" id="galeria">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2>GALERIA DE FOTOS</h2>
          <p>Momentos inesquecíveis dos nossos eventos na Província de Gaza</p>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="gallery-categories"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`gallery-cat-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Nenhuma foto disponível na galeria. Adicione fotos reais no painel de administração.
          </div>
        ) : (
          <motion.div className="gallery-grid" layout>
            <AnimatePresence>
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo._id}
                  className="gallery-item glass"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="gallery-img-wrap">
                    <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                    <div className="gallery-overlay">
                      <ImageIcon size={28} color="white" />
                    </div>
                  </div>
                  <div className="gallery-info">
                    <h4>{photo.title}</h4>
                    {photo.eventDate && (
                      <span className="gallery-date">
                        <Calendar size={12} /> {photo.eventDate}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="lightbox-content glass"
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
                  <X size={24} />
                </button>
                <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
                <div className="lightbox-caption">
                  <h3>{selectedPhoto.title}</h3>
                  {selectedPhoto.eventDate && <p>{selectedPhoto.eventDate}</p>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;
