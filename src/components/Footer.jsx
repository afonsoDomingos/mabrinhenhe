import React from 'react';
import { Globe, Music, Link, Star } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <img src="/MABRILOGO.png" alt="Mabrinhenhe Logo" className="footer-logo-img" />
        <h3>MABRINHENHE</h3>
        <p>ENTRETENIMENTO</p>
        <span>Província de Gaza, Moçambique</span>
      </div>
      <div className="footer-links">
        <div className="link-group">
          <h4>Plataforma</h4>
          <a href="#artistas">Artistas</a>
          <a href="#eventos">Eventos</a>
          <a href="#comunidade">Comunidade</a>
        </div>
        <div className="link-group">
          <h4>Empresa</h4>
          <a href="#">Sobre Nós</a>
          <a href="#">Contacto</a>
          <a href="#">Parcerias</a>
        </div>
      </div>
      <div className="footer-social">
        <h4>Seguir-nos</h4>
        <div className="social-icons">
          <a href="#" aria-label="Website"><Globe size={20} /></a>
          <a href="#" aria-label="Música"><Music size={20} /></a>
          <a href="#" aria-label="Link"><Link size={20} /></a>
          <a href="#" aria-label="Destaque"><Star size={20} /></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom container">
      <span>© 2026 Mabrinhenhe Entretenimento. Todos os direitos reservados.</span>
    </div>
  </footer>
);

export default Footer;
