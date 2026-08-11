import React from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`header glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <button className="logo-btn logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/MABRILOGO.png" alt="Mabrinhenhe Logo" className="header-logo-img" />
          <div className="logo-text">
            MABRINHENHE <span>ENTRETENIMENTO</span>
          </div>
        </button>

        <nav className={`nav ${isOpen ? 'nav-open' : ''}`}>
          <button onClick={() => handleNav('inicio')} className="nav-link">Início</button>
          <button onClick={() => handleNav('artistas')} className="nav-link">Artistas</button>
          <button onClick={() => handleNav('eventos')} className="nav-link">Eventos</button>
          <button onClick={() => handleNav('comunidade')} className="nav-link">Comunidade</button>
          <button onClick={() => handleNav('contacto')} className="nav-link nav-cta">Candidatura</button>
          <a href="/admin" className="nav-link admin-nav-link" title="Painel Admin">Admin</a>
        </nav>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
