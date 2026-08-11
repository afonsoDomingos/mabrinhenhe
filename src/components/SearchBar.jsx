import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, X, Mic2, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchBar.css';

const SearchBar = ({ onSelectArtist, onSelectEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ artists: [], events: [] });
  const inputRef = useRef(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      setQuery('');
      setResults({ artists: [], events: [] });
    }
  }, [isModalOpen]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Fetch & Filter Results
  useEffect(() => {
    if (!query.trim()) {
      setResults({ artists: [], events: [] });
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      const q = query.toLowerCase().trim();

      Promise.all([
        fetch('/api/artists').then((r) => r.json()),
        fetch('/api/events').then((r) => r.json()),
      ])
        .then(([artistsData, eventsData]) => {
          const matchedArtists = (Array.isArray(artistsData) ? artistsData : []).filter(
            (a) =>
              a.name?.toLowerCase().includes(q) ||
              a.genre?.toLowerCase().includes(q) ||
              a.description?.toLowerCase().includes(q)
          );

          const matchedEvents = (Array.isArray(eventsData) ? eventsData : []).filter(
            (e) =>
              e.title?.toLowerCase().includes(q) ||
              e.location?.toLowerCase().includes(q) ||
              e.description?.toLowerCase().includes(q) ||
              (Array.isArray(e.artists)
                ? e.artists.some((artistName) => artistName.toLowerCase().includes(q))
                : typeof e.artists === 'string' && e.artists.toLowerCase().includes(q))
          );

          setResults({ artists: matchedArtists, events: matchedEvents });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = results.artists.length + results.events.length;

  const handleSelectArtist = (id) => {
    setIsModalOpen(false);
    if (onSelectArtist) onSelectArtist(id);
  };

  const handleSelectEvent = (id) => {
    setIsModalOpen(false);
    if (onSelectEvent) onSelectEvent(id);
  };

  const handleQuickTag = (tag) => {
    setQuery(tag);
  };

  return (
    <>
      {/* Search trigger button in Header */}
      <button
        className="header-search-trigger-btn"
        onClick={() => setIsModalOpen(true)}
        title="Pesquisar artistas, eventos..."
        aria-label="Abrir pesquisa"
      >
        <Search size={18} />
        <span className="search-btn-label">Pesquisar</span>
      </button>

      {/* Fullscreen Modal — rendered via Portal directly into document.body
          to escape the Header's framer-motion transform stacking context */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="search-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="search-modal-container glass"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header inside Modal */}
                <div className="search-modal-header">
                  <div className="search-modal-input-wrap">
                    <Search size={22} className="search-input-icon" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Pesquise por artista, evento, género musical ou local..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (results.artists.length > 0) handleSelectArtist(results.artists[0]._id);
                          else if (results.events.length > 0) handleSelectEvent(results.events[0]._id);
                        }
                      }}
                    />
                    {query && (
                      <button className="search-clear-btn" onClick={() => setQuery('')}>
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <button
                    className="search-modal-close-btn"
                    onClick={() => setIsModalOpen(false)}
                    title="Fechar"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Quick Suggestion Tags */}
                {!query.trim() && (
                  <div className="search-quick-tags">
                    <span className="quick-tags-title">
                      <Sparkles size={14} /> Sugestões rápidas:
                    </span>
                    <div className="tags-list">
                      {['Hip-Hop', 'Afrobeat', 'Marrabenta', 'Pandza', 'Passada', 'Xai-Xai'].map((tag) => (
                        <button key={tag} className="tag-btn" onClick={() => handleQuickTag(tag)}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body / Results */}
                <div className="search-modal-body">
                  {loading && <div className="search-status-text">A procurar conteúdos...</div>}

                  {!loading && query.trim() && totalResults === 0 && (
                    <div className="search-status-text empty">
                      Nenhum resultado para "<strong>{query}</strong>". Tente outro nome ou género.
                    </div>
                  )}

                  {!loading && totalResults > 0 && (
                    <div className="search-results-grid">
                      {/* Artists Section */}
                      {results.artists.length > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">
                            <Mic2 size={16} /> Artistas ({results.artists.length})
                          </div>
                          <div className="search-items-list">
                            {results.artists.map((artist) => (
                              <div
                                key={artist._id}
                                className="search-card-item"
                                onClick={() => handleSelectArtist(artist._id)}
                              >
                                {artist.imageUrl ? (
                                  <img src={artist.imageUrl} alt={artist.name} className="search-card-img circle" />
                                ) : (
                                  <div className="search-card-placeholder circle">
                                    <Mic2 size={20} />
                                  </div>
                                )}
                                <div className="search-card-details">
                                  <h4>{artist.name}</h4>
                                  <span className="search-card-sub">{artist.genre}</span>
                                </div>
                                <ArrowRight size={16} className="search-card-arrow" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Events Section */}
                      {results.events.length > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">
                            <Calendar size={16} /> Eventos ({results.events.length})
                          </div>
                          <div className="search-items-list">
                            {results.events.map((event) => (
                              <div
                                key={event._id}
                                className="search-card-item"
                                onClick={() => handleSelectEvent(event._id)}
                              >
                                {event.imageUrl ? (
                                  <img src={event.imageUrl} alt={event.title} className="search-card-img square" />
                                ) : (
                                  <div className="search-card-placeholder square">
                                    <Calendar size={20} />
                                  </div>
                                )}
                                <div className="search-card-details">
                                  <h4>{event.title}</h4>
                                  <span className="search-card-sub">{event.date} · {event.location}</span>
                                </div>
                                <ArrowRight size={16} className="search-card-arrow" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default SearchBar;
