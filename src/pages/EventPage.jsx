import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket, ArrowLeft, Share2, Users, CheckCircle } from 'lucide-react';
import './EventPage.css';

const EventPage = ({ eventId, onBack }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((e) => e._id === eventId);
          setEvent(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Confere este evento da Mabrinhenhe: ${event?.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="event-page-loading">
        <div className="spinner"></div>
        <p>A carregar detalhes do evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-page-loading">
        <p>Evento não encontrado.</p>
        <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /> Voltar</button>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

  return (
    <div className="event-page">
      {/* Hero Banner */}
      <motion.div
        className="event-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="event-hero-bg"
          style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : {}}
        />
        <div className="event-hero-overlay" />
        <div className="container event-hero-content">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={18} /> Todos os Eventos
          </button>
          
          <div className="event-hero-badge">
            <span className={`event-status-tag ${event.status}`}>
              {event.status === 'upcoming' ? '● Próximo Evento' : '● Evento Realizado'}
            </span>
          </div>

          <h1>{event.title}</h1>

          <div className="event-quick-meta">
            <span><Calendar size={18} /> {event.date}</span>
            {event.time && <span><Clock size={18} /> {event.time}</span>}
            <span><MapPin size={18} /> {event.location}</span>
          </div>
        </div>
      </motion.div>

      {/* Main Body */}
      <div className="container event-body">
        <div className="event-grid">
          {/* Left Column: Poster & Details */}
          <motion.div
            className="event-main-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>SOBRE O EVENTO</h2>
            <p className="event-description">{event.description}</p>

            {/* Lineup */}
            {event.artists && (
              <div className="event-lineup-section">
                <h3><Users size={20} /> LINEUP / ARTISTAS</h3>
                <div className="lineup-tags">
                  {(Array.isArray(event.artists)
                    ? event.artists
                    : typeof event.artists === 'string'
                    ? event.artists.split(',')
                    : []
                  ).map((artist, idx) => (
                    <span key={idx} className="lineup-chip glass">
                      🎵 {artist.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map Box */}
            <div className="event-map-box glass">
              <div className="map-info">
                <MapPin size={24} color="white" />
                <div>
                  <h4>Local do Evento</h4>
                  <p>{event.location}</p>
                </div>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-open-map"
              >
                Abrir no Google Maps ↗
              </a>
            </div>
          </motion.div>

          {/* Right Column: Poster & Action Card */}
          <motion.div
            className="event-sidebar-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="event-poster-card glass">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="event-poster-img" />
              ) : (
                <div className="event-poster-placeholder">
                  <Calendar size={48} />
                  <span>Sem cartaz oficial</span>
                </div>
              )}

              <div className="poster-card-body">
                {event.status === 'upcoming' ? (
                  <>
                    <div className="ticket-price-badge">
                      <span>Entrada / Bilhetes</span>
                    </div>

                    {event.ticketUrl ? (
                      <a
                        href={event.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-buy-ticket"
                      >
                        <Ticket size={20} /> Comprar Bilhetes
                      </a>
                    ) : (
                      <a
                        href="#contacto"
                        onClick={onBack}
                        className="btn-buy-ticket secondary"
                      >
                        Reservar com a Organização
                      </a>
                    )}
                  </>
                ) : (
                  <div className="past-event-notice">
                    <CheckCircle size={20} />
                    <span>Este evento já foi realizado.</span>
                  </div>
                )}

                <button className="btn-share-event" onClick={handleShare}>
                  <Share2 size={18} /> {copied ? 'Link Copiado!' : 'Partilhar Evento'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
