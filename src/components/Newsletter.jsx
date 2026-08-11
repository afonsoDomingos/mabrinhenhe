import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Send } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao subscrever.');
      
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section" id="newsletter">
      <div className="container">
        <motion.div
          className="newsletter-box glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="newsletter-icon">
            <Bell size={32} />
          </div>

          <div className="newsletter-text">
            <h2>NÃO PERCAS NENHUM EVENTO</h2>
            <p>Subscreve a nossa lista de notificações para receber em primeira mão a agenda de shows, bilhetes e lançamentos da Mabrinhenhe.</p>
          </div>

          {success ? (
            <motion.div
              className="newsletter-success-state"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="success-icon"><Check size={24} /></div>
              <span>Obrigado! Inscrição confirmada. Notificaremos-te de novos eventos.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              {error && <div className="newsletter-error">{error}</div>}
              <div className="input-group">
                <input
                  type="email"
                  required
                  placeholder="Introduz o teu email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn-subscribe" disabled={loading}>
                  {loading ? 'A enviar...' : <><Send size={16} /> Subscrever</>}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
