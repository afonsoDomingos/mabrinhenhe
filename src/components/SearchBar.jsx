import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Mic2, Calendar, Music, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchBar.css';

const SearchBar = ({ onSelectArtist, onSelectEvent }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ artists: [], events: [] });
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch and filter results
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

  const handleSelectArtistItem = (id) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectArtist) onSelectArtist(id);
  };

  const handleSelectEventItem = (id) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectEvent) onSelectEvent(id);
  };

  return (
    <div className="search-bar-wrapper" ref={searchRef}>
      <div className={`search-input-box ${isOpen ? 'active' : ''}`}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Pesquisar artistas, eventos, géneros..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
        {query && (
          <button
            className="clear-search-btn"
            onClick={() => {
              setQuery('');
              setResults({ artists: [], events: [] });
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && query.trim().length > 0 && (
          <motion.div
            className="search-results-dropdown glass"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="search-loading">A pesquisar...</div>
            ) : totalResults === 0 ? (
              <div className="search-empty">
                Nenhum resultado encontrado para "<strong>{query}</strong>"
              </div>
            ) : (
              <div className="search-results-content">
                {/* Artists Results */}
                {results.artists.length > 0 && (
                  <div className="search-category">
                    <div className="search-category-title">
                      <Mic2 size={14} /> Artistas ({results.artists.length})
                    </div>
                    {results.artists.map((artist) => (
                      <div
                        key={artist._id}
                        className="search-result-item"
                        onClick={() => handleSelectArtistItem(artist._id)}
                      >
                        {artist.imageUrl ? (
                          <img src={artist.imageUrl} alt={artist.name} className="search-item-img" />
                        ) : (
                          <div className="search-item-placeholder"><Mic2 size={16} /></div>
                        )}
                        <div className="search-item-info">
                          <h4>{artist.name}</h4>
                          <span>{artist.genre}</span>
                        </div>
                        <ArrowRight size={14} className="search-arrow" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Events Results */}
                {results.events.length > 0 && (
                  <div className="search-category">
                    <div className="search-category-title">
                      <Calendar size={14} /> Eventos ({results.events.length})
                    </div>
                    {results.events.map((event) => (
                      <div
                        key={event._id}
                        className="search-result-item"
                        onClick={() => handleSelectEventItem(event._id)}
                      >
                        {event.imageUrl ? (
                          <img src={event.imageUrl} alt={event.title} className="search-item-img event" />
                        ) : (
                          <div className="search-item-placeholder event"><Calendar size={16} /></div>
                        )}
                        <div className="search-item-info">
                          <h4>{event.title}</h4>
                          <span>{event.date} · {event.location}</span>
                        </div>
                        <ArrowRight size={14} className="search-arrow" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
