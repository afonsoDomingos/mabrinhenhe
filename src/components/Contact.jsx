import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic2, Star, Newspaper, HelpCircle, CheckCircle } from 'lucide-react';
import './Contact.css';

const types = [
  { value: 'artista', label: 'Artista', icon: <Mic2 size={18}/>, desc: 'Quero ser promovido pela Mabrinhenhe' },
  { value: 'patrocinador', label: 'Patrocinador', icon: <Star size={18}/>, desc: 'Quero patrocinar eventos' },
  { value: 'imprensa', label: 'Imprensa', icon: <Newspaper size={18}/>, desc: 'Pedido de imprensa ou entrevista' },
  { value: 'outro', label: 'Outro', icon: <HelpCircle size={18}/>, desc: 'Outra razão de contacto' },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: '', email: '', type: 'artista',
    genre: '', message: '', instagram: '', tiktok: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar.');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) return (
    <section className="contact-section" id="contacto">
      <div className="container contact-success">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="success-box glass"
        >
          <CheckCircle size={56} strokeWidth={1.5} />
          <h2>Candidatura Enviada!</h2>
          <p>Recebemos a tua mensagem. A equipa Mabrinhenhe irá entrar em contacto em breve.</p>
          <button className="btn-retry" onClick={() => { setSent(false); setForm({ name:'', email:'', type:'artista', genre:'', message:'', instagram:'', tiktok:'' }); }}>
            Enviar outra
          </button>
        </motion.div>
      </div>
    </section>
  );

  return (
    <section className="contact-section" id="contacto">
      <div className="container">
        <div className="section-header">
          <h2>TRABALHA CONNOSCO</h2>
          <p>Artistas, patrocinadores ou imprensa — fala connosco</p>
        </div>

        <div className="contact-layout">
          {/* Left: Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Mabrinhenhe Entretenimento</h3>
            <p className="contact-tagline">Promovemos talentos e criamos experiências musicais únicas na Província de Gaza.</p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="detail-label">LOCALIZAÇÃO</span>
                <span>Xai-Xai, Província de Gaza, Moçambique</span>
              </div>
              <div className="contact-detail-item">
                <span className="detail-label">ARTISTAS REPRESENTADOS</span>
                <span>6 artistas activos</span>
              </div>
              <div className="contact-detail-item">
                <span className="detail-label">EVENTOS POR ANO</span>
                <span>+12 eventos</span>
              </div>
            </div>
            <div className="contact-apply-note glass">
              <Mic2 size={20} />
              <p>Se és artista e queres ser promovido pela Mabrinhenhe, preenche o formulário com os teus dados e links de redes sociais.</p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.form
            className="contact-form glass"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {error && <div className="form-error">{error}</div>}

            {/* Type selector */}
            <div className="type-selector">
              {types.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`type-btn ${form.type === t.value ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, type: t.value })}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            <p className="type-desc">{types.find(t => t.value === form.type)?.desc}</p>

            <div className="form-row-2">
              <label>
                Nome *
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="O teu nome / Nome Artístico" />
              </label>
              <label>
                Email *
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
              </label>
            </div>

            <div className="form-row-2">
              <label>
                WhatsApp / Contacto Telefónico
                <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+258 84/86/87..." />
              </label>
              {form.type === 'artista' && (
                <label>
                  Género Musical
                  <input value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Hip-Hop, Afrobeat, Gospel..." />
                </label>
              )}
            </div>

            {form.type === 'artista' && (
              <>
                <div className="form-row-2">
                  <label>
                    Link das Músicas (YouTube / Spotify / Audiomack)
                    <input value={form.musicLink || ''} onChange={e => setForm({ ...form, musicLink: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                  </label>
                  <label>
                    Página Artística / Portfólio (Website / Facebook)
                    <input value={form.portfolioLink || ''} onChange={e => setForm({ ...form, portfolioLink: e.target.value })} placeholder="https://facebook.com/..." />
                  </label>
                </div>
                <div className="form-row-2">
                  <label>
                    Instagram
                    <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
                  </label>
                  <label>
                    TikTok
                    <input value={form.tiktok || ''} onChange={e => setForm({ ...form, tiktok: e.target.value })} placeholder="https://tiktok.com/@..." />
                  </label>
                </div>
              </>
            )}

            <label>
              Mensagem *
              <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={form.type === 'artista' ? 'Fala-nos sobre ti, a tua música e os teus objectivos...' : 'A tua mensagem...'} />
            </label>

            <button type="submit" className="btn-submit" disabled={sending}>
              {sending ? 'A enviar...' : <><Send size={18} /> Enviar Candidatura</>}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
