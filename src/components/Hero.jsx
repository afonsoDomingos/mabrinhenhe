import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ['0%', '30%']);
  const textY = useTransform(scrollY, [0, 600], ['0%', '18%']);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="hero" id="inicio">
      {/* Parallax Background Layer */}
      <motion.div className="hero-bg-parallax" style={{ y: bgY }} />
      <div className="hero-overlay" />

      {/* Floating orbs */}
      <div className="hero-orbs">
        <motion.div className="orb orb-1"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="orb orb-2"
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div className="orb orb-3"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <motion.div className="container hero-content" style={{ y: textY, opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-text"
        >
          <motion.span
            className="hero-label"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            ★ MABRINHENHE ENTRETENIMENTO ★
          </motion.span>
          <h1>A VOZ DA PROVÍNCIA DE GAZA</h1>
          <p>
            Conectando pessoas, promovendo a cultura e elevando os artistas locais para os maiores palcos. Junte-se a nós para experiências inesquecíveis.
          </p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <button className="btn btn-primary">
              Ver Eventos <ChevronRight size={20} />
            </button>
            <button className="btn btn-secondary">
              Nossos Artistas
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="scroll-dot"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

