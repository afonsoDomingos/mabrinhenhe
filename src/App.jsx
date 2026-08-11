import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Artists from './components/Artists';
import Events from './components/Events';
import Community from './components/Community';
import Footer from './components/Footer';
import Admin from './pages/Admin';

function App() {
  const isAdmin = window.location.pathname === '/admin';

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Artists />
        <Events />
        <Community />
      </main>
      <Footer />
    </div>
  );
}

export default App;
