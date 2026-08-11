import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h1>A VOZ DA PROVÍNCIA DE GAZA</h1>
          <p>
            Mabrinhenhe Entretenimento. Conectando pessoas, promovendo a cultura e elevando os artistas locais para os maiores palcos. Junte-se a nós para experiências inesquecíveis.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">
              Ver Eventos <ChevronRight size={20} />
            </button>
            <button className="btn btn-secondary">
              Nossos Artistas
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
