import React, { useState } from 'react';
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

function App() {
  const path = window.location.pathname;
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  React.useEffect(() => {
    if (path !== '/admin') {
      fetch('/api/stats/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: window.location.pathname }),
      }).catch(() => {});
    }
  }, [path]);

  if (path === '/admin') {
    return <Admin />;
  }

  if (selectedArtistId) {
    return (
      <div className="app">
        <Header onSelectArtist={(id) => { setSelectedEventId(null); setSelectedArtistId(id); }} onSelectEvent={(id) => { setSelectedArtistId(null); setSelectedEventId(id); }} />
        <ArtistPage artistId={selectedArtistId} onBack={() => setSelectedArtistId(null)} />
        <Footer />
        <AudioPlayer />
      </div>
    );
  }

  if (selectedEventId) {
    return (
      <div className="app">
        <Header onSelectArtist={(id) => { setSelectedEventId(null); setSelectedArtistId(id); }} onSelectEvent={(id) => { setSelectedArtistId(null); setSelectedEventId(id); }} />
        <EventPage eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />
        <Footer />
        <AudioPlayer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header onSelectArtist={(id) => setSelectedArtistId(id)} onSelectEvent={(id) => setSelectedEventId(id)} />
      <main>
        <Hero />
        <Artists onSelectArtist={(id) => setSelectedArtistId(id)} />
        <Events onSelectEvent={(id) => setSelectedEventId(id)} />
        <Gallery />
        <Community />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <AudioPlayer />
    </div>
  );
}

export default App;
