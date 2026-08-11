import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Calendar } from 'lucide-react';
import './Events.css';

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const Events = ({ onSelectEvent }) => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => e.status === filter);

  const dateParts = (dateStr) => {
    const parts = dateStr ? dateStr.split(' ') : [];
    return { day: parts[0] || '??', month: parts[1] || '???', year: parts[2] || '' };
  };

  return (
    <section className="events-section" id="eventos">
      <div className="container">
        <div className="section-header">
          <h2>EVENTOS</h2>
          <p>Shows e experiências criados pela Mabrinhenhe Entretenimento</p>
        </div>

        <div className="events-tabs">
          <button className={`tab-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Próximos</button>
          <button className={`tab-btn ${filter === 'past' ? 'active' : ''}`} onClick={() => setFilter('past')}>Passados</button>
        </div>

        {loading ? (
          <div className="loading-state">A carregar eventos...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">Nenhum evento nesta categoria. Adicione no painel de admin.</div>
        ) : (
          <div className="events-list">
            {filtered.map((event) => {
              const { day, month, year } = dateParts(event.date);
              return (
                <motion.div
                  key={event._id}
                  className="event-card glass"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  onClick={() => onSelectEvent && onSelectEvent(event._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="event-poster-img" />
                  ) : (
                    <div className="event-date-badge">
                      <span className="day">{day}</span>
                      <span className="month">{month}</span>
                      <span className="year">{year}</span>
                    </div>
                  )}
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-desc">{event.description}</p>
                    <div className="event-meta">
                      <span><Clock size={14} /> {event.time}</span>
                      <span><MapPin size={14} /> {event.location}</span>
                      <span><Calendar size={14} /> {Array.isArray(event.artists) ? event.artists.join(', ') : event.artists}</span>
                    </div>
                  </div>
                  <div className="event-btn">
                    Ver Detalhes <ChevronRight size={16} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
