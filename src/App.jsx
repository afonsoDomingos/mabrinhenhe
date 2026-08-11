import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Artists from './components/Artists';
import Events from './components/Events';
import Community from './components/Community';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './pages/Admin';

function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <Admin />;
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Artists />
        <Events />
        <Gallery />
        <Community />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
