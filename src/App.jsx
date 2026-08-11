import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Artists from './components/Artists';
import Events from './components/Events';
import Community from './components/Community';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Newsletter from './components/Newsletter';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import ArtistPage from './pages/ArtistPage';
import EventPage from './pages/EventPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const path = window.location.pathname;
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Read URL query params on initial load
  useEffect(() => {
    if (path !== '/admin') {
      const searchParams = new URLSearchParams(window.location.search);
      const artistParam = searchParams.get('artist');
      const eventParam = searchParams.get('event');

      if (artistParam) {
        setSelectedArtistId(artistParam);
      } else if (eventParam) {
        setSelectedEventId(eventParam);
      }

      fetch('/api/stats/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: window.location.pathname }),
      }).catch(() => {});
    }
  }, [path]);

  const handleSelectArtist = (id) => {
    setSelectedEventId(null);
    setSelectedArtistId(id);
    if (id) {
      const url = new URL(window.location);
      url.searchParams.set('artist', id);
      url.searchParams.delete('event');
      window.history.pushState({}, '', url);
    } else {
      const url = new URL(window.location);
      url.searchParams.delete('artist');
      url.searchParams.delete('event');
      window.history.pushState({}, '', url.pathname);
    }
  };

  const handleSelectEvent = (id) => {
    setSelectedArtistId(null);
    setSelectedEventId(id);
    if (id) {
      const url = new URL(window.location);
      url.searchParams.set('event', id);
      url.searchParams.delete('artist');
      window.history.pushState({}, '', url);
    } else {
      const url = new URL(window.location);
      url.searchParams.delete('artist');
      url.searchParams.delete('event');
      window.history.pushState({}, '', url.pathname);
    }
  };

  if (path === '/admin') {
    return <Admin />;
  }

  if (selectedArtistId) {
    return (
      <div className="app">
        <Header onSelectArtist={handleSelectArtist} onSelectEvent={handleSelectEvent} />
        <ArtistPage artistId={selectedArtistId} onBack={() => handleSelectArtist(null)} />
        <Footer />
        <AudioPlayer />
        <ScrollToTop />
      </div>
    );
  }

  if (selectedEventId) {
    return (
      <div className="app">
        <Header onSelectArtist={handleSelectArtist} onSelectEvent={handleSelectEvent} />
        <EventPage eventId={selectedEventId} onBack={() => handleSelectEvent(null)} />
        <Footer />
        <AudioPlayer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="app">
      <Header onSelectArtist={handleSelectArtist} onSelectEvent={handleSelectEvent} />
      <main>
        <Hero />
        <Artists onSelectArtist={handleSelectArtist} />
        <Events onSelectEvent={handleSelectEvent} />
        <Gallery />
        <Community />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <AudioPlayer />
      <ScrollToTop />
    </div>
  );
}

export default App;
