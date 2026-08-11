import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic2, Star, Newspaper, HelpCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import './Contact.css';

const types = [
  { value: 'artista', label: 'Artista', icon: <Mic2 size={18}/>, desc: 'Quero ser promovido pela Mabrinhenhe' },
  { value: 'patrocinador', label: 'Patrocinador', icon: <Star size={18}/>, desc: 'Quero patrocinar eventos' },
  { value: 'imprensa', label: 'Imprensa', icon: <Newspaper size={18}/>, desc: 'Pedido de imprensa ou entrevista' },
  { value: 'outro', label: 'Outro', icon: <HelpCircle size={18}/>, desc: 'Outra razão de contacto' },
];

const MOZ_GENRES = [
  'Marrabenta', 'Pandza', 'Passada', 'Hip-Hop', 'Afrobeat',
  'Amapiano', 'Kizomba', 'Gospel', 'Zouk', 'R&B', 'Trap', 'Tradicional'
];

const Contact = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', type: 'artista',
    phone: '', genre: '', message: '',
    musicLink: '', portfolioLink: '', instagram: '', tiktok: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!form.name.trim() || !form.email.trim()) {
        setError('Por favor preencha o Nome e o Email para continuar.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError('Por favor escreva a sua mensagem antes de enviar.');
      return;
    }

    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar candidatura.');
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
          <p>Recebemos a tua candidatura com sucesso. A equipa Mabrinhenhe irá analisar os teus dados e entrar em contacto pelo WhatsApp/Email em breve.</p>
          <button className="btn-retry" onClick={() => {
            setSent(false);
            setStep(1);
            setForm({ name:'', email:'', type:'artista', phone:'', genre:'', message:'', musicLink:'', portfolioLink:'', instagram:'', tiktok:'' });
          }}>
            Enviar outra candidatura
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
          <p>Artistas, patrocinadores ou imprensa — submeta a sua candidatura</p>
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
                <span>Talentos activos e novos lançamentos</span>
              </div>
              <div className="contact-detail-item">
                <span className="detail-label">EVENTOS POR ANO</span>
                <span>+12 grandes shows</span>
              </div>
            </div>
            <div className="contact-apply-note glass">
              <Mic2 size={20} />
              <p>Se és artista e queres ser promovido pela Mabrinhenhe, preenche a tua candidatura em 3 passos simples.</p>
            </div>
          </motion.div>

          {/* Right: Multi-Step Form */}
          <motion.form
            className="contact-form glass"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Step Indicator Progress Bar */}
            <div className="form-steps-indicator">
              <div className="steps-progress-bar">
                <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
              </div>
              <div className="steps-labels">
                <span className={step >= 1 ? 'active' : ''}>1. Identificação</span>
                <span className={step >= 2 ? 'active' : ''}>2. Perfil Artístico</span>
                <span className={step >= 3 ? 'active' : ''}>3. Mensagem</span>
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <AnimatePresence mode="wait">
              {/* STEP 1: Tipo & Identificação Básica */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <label className="step-section-title">Sou:</label>
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
                      Nome / Nome Artístico *
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Ex: Hélder Boy / Mr. X"
                      />
                    </label>
                    <label>
                      Email *
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="seuemail@exemplo.com"
                      />
                    </label>
                  </div>

                  <label style={{ marginTop: '0.8rem' }}>
                    WhatsApp / Telefone de Contacto
                    <input
                      value={form.phone || ''}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+258 84 / 86 / 87..."
                    />
                  </label>

                  <div className="step-actions">
                    <button type="button" className="btn-next" onClick={nextStep}>
                      Próximo Passo <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Perfil Artístico & Links (para Artistas e outros) */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  {form.type === 'artista' ? (
                    <>
                      <label>
                        Género Musical
                        <input
                          value={form.genre}
                          onChange={e => setForm({ ...form, genre: e.target.value })}
                          placeholder="Escreva ou selecione abaixo (ex: Marrabenta • Pandza)"
                        />
                        <div className="genre-selector-pills">
                          <div className="genre-pills-list">
                            {MOZ_GENRES.map((g) => {
                              const isSelected = form.genre?.includes(g);
                              return (
                                <button
                                  key={g}
                                  type="button"
                                  className={`genre-pill-btn ${isSelected ? 'selected' : ''}`}
                                  onClick={() => {
                                    if (!form.genre) setForm({ ...form, genre: g });
                                    else {
                                      const current = form.genre.split(' • ').map(s => s.trim()).filter(Boolean);
                                      if (current.includes(g)) setForm({ ...form, genre: current.filter(i => i !== g).join(' • ') });
                                      else setForm({ ...form, genre: [...current, g].join(' • ') });
                                    }
                                  }}
                                >
                                  {isSelected ? '✓ ' : '+ '}{g}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </label>

                      <div className="form-row-2" style={{ marginTop: '0.8rem' }}>
                        <label>
                          Link das Músicas (YouTube / Spotify / Audiomack)
                          <input
                            value={form.musicLink || ''}
                            onChange={e => setForm({ ...form, musicLink: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </label>
                        <label>
                          Página Artística / Portfólio
                          <input
                            value={form.portfolioLink || ''}
                            onChange={e => setForm({ ...form, portfolioLink: e.target.value })}
                            placeholder="https://facebook.com/..."
                          />
                        </label>
                      </div>

                      <div className="form-row-2" style={{ marginTop: '0.8rem' }}>
                        <label>
                          Instagram
                          <input
                            value={form.instagram || ''}
                            onChange={e => setForm({ ...form, instagram: e.target.value })}
                            placeholder="https://instagram.com/..."
                          />
                        </label>
                        <label>
                          TikTok
                          <input
                            value={form.tiktok || ''}
                            onChange={e => setForm({ ...form, tiktok: e.target.value })}
                            placeholder="https://tiktok.com/@..."
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="non-artist-step2">
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Opcional: Indique o seu website ou rede social se aplicável.
                      </p>
                      <label>
                        Website / Rede Social
                        <input
                          value={form.portfolioLink || ''}
                          onChange={e => setForm({ ...form, portfolioLink: e.target.value })}
                          placeholder="https://..."
                        />
                      </label>
                    </div>
                  )}

                  <div className="step-actions dual">
                    <button type="button" className="btn-prev" onClick={prevStep}>
                      <ArrowLeft size={18} /> Anterior
                    </button>
                    <button type="button" className="btn-next" onClick={nextStep}>
                      Próximo Passo <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Mensagem Final & Envio */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="step-content"
                >
                  <label>
                    Mensagem / Apresentação *
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={
                        form.type === 'artista'
                          ? 'Fala-nos sobre ti, a tua trajectória na música e os teus objectivos com a Mabrinhenhe Entretenimento...'
                          : 'Escreva a sua mensagem ou proposta...'
                      }
                    />
                  </label>

                  <div className="step-actions dual">
                    <button type="button" className="btn-prev" onClick={prevStep} disabled={sending}>
                      <ArrowLeft size={18} /> Anterior
                    </button>
                    <button type="submit" className="btn-submit" disabled={sending}>
                      {sending ? 'A enviar...' : <><Send size={18} /> Enviar Candidatura</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
