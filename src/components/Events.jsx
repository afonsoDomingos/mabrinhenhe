import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Calendar, Eye } from 'lucide-react';
import './Events.css';

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
        ) : filter === 'past' ? (
          /* ── Past events: Vertical poster GRID ── */
          <div className="past-events-grid">
            {filtered.map((event, i) => {
              const { day, month, year } = dateParts(event.date);
              return (
                <motion.div
                  key={event._id}
                  className="past-event-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  onClick={() => onSelectEvent && onSelectEvent(event._id)}
                >
                  {/* Poster */}
                  <div className="past-event-poster-wrap">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="past-event-poster" />
                    ) : (
                      <div className="past-event-poster-placeholder">
                        <Calendar size={32} />
                        <span>{day} {month}</span>
                        <span className="past-event-no-img-year">{year}</span>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="past-event-overlay">
                      <Eye size={24} />
                      <span>Ver Detalhes</span>
                    </div>
                    {/* Past badge */}
                    <div className="past-badge">Passado</div>
                    {/* Date chip */}
                    <div className="past-date-chip">
                      <span className="chip-day">{day}</span>
                      <span className="chip-month">{month} {year}</span>
                    </div>
                  </div>

                  {/* Info below poster */}
                  <div className="past-event-info">
                    <h3>{event.title}</h3>
                    <div className="past-event-meta">
                      {event.location && <span><MapPin size={12} /> {event.location}</span>}
                      {event.time && <span><Clock size={12} /> {event.time}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── Upcoming events: horizontal list ── */
          <div className="events-list">
            {filtered.map((event) => {
              const { day, month, year } = dateParts(event.date);
              return (
                <motion.div
                  key={event._id}
                  className="event-card glass"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
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
