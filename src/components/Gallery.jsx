import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Calendar } from 'lucide-react';
import './Gallery.css';

const defaultPhotos = [
  { _id: '1', title: 'Mabrinhenhe Anniversary Show', eventDate: '12 AGO 2026', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', category: 'Concertos' },
  { _id: '2', title: 'Noite Afro — Gaza Sounds', eventDate: '28 SET 2026', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80', category: 'Festivais' },
  { _id: '3', title: 'Underground Flow', eventDate: '02 NOV 2026', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80', category: 'Hip-Hop' },
  { _id: '4', title: 'Backstage & Ensaio', eventDate: '2026', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80', category: 'Bastidores' },
];

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
        } else {
          setPhotos(defaultPhotos);
        }
      })
      .catch(() => setPhotos(defaultPhotos));
  }, []);

  const categories = ['Todos', ...new Set(photos.map((p) => p.category || 'Geral'))];

  const filteredPhotos = filter === 'Todos' ? photos : photos.filter((p) => p.category === filter);

  return (
    <section className="gallery-section" id="galeria">
      <div className="container">
        <div className="section-header">
          <h2>GALERIA DE FOTOS</h2>
          <p>Momentos inesquecíveis dos nossos eventos na Província de Gaza</p>
        </div>

        {/* Categories */}
        <div className="gallery-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`gallery-cat-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
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
