import React, { useState, useEffect, useCallback } from 'react';
import { Mic2, Calendar, LogOut, Plus, Pencil, Trash2, X, Check, Star, Mail, CheckCircle, Clock, XCircle, Home, Image as ImageIcon, LayoutDashboard, Eye, MessageSquare, Bell, Music } from 'lucide-react';
import './Admin.css';

const ADMIN_PASSWORD_KEY = 'mabrinhenhe_admin_pw';

const emptyArtist = { name: '', genre: '', description: '', featured: false, imageUrl: '' };
const emptyEvent = { title: '', date: '', time: '', location: '', artists: '', status: 'upcoming', description: '', ticketUrl: '', imageUrl: '' };

// ─── API helpers ──────────────────────────────────────────────
const api = (url, options = {}, pw) =>
  fetch(url, { ...options, headers: { 'Content-Type': 'application/json', 'x-admin-password': pw, ...(options.headers || {}) } }).then((r) => r.json());

// ─── Artist Form Modal ────────────────────────────────────────
const ArtistModal = ({ initial, onSave, onClose, pw }) => {
  const [form, setForm] = useState(initial || emptyArtist);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError('Erro no upload da imagem: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const method = form._id ? 'PUT' : 'POST';
      const url = form._id ? `/api/artists/${form._id}` : '/api/artists';
      const result = await api(url, { method, body: JSON.stringify(form) }, pw);
      if (result.error) throw new Error(result.error);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form._id ? 'Editar Artista' : 'Novo Artista'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}
          <label>Nome *<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nome do artista" /></label>
          <label>Género *<input required value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} placeholder="Hip-Hop • Afrobeat" /></label>
          <label>Descrição *<textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} placeholder="Breve bio do artista..." /></label>
          
          <label>Foto do Artista (Cloudinary)
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <small style={{ color: '#aaa', marginTop: '0.2rem' }}>A carregar foto para o Cloudinary...</small>}
            {form.imageUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={form.imageUrl} alt="Preview" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '1px solid #444' }} />
                <small style={{ color: '#888', wordBreak: 'break-all' }}>{form.imageUrl}</small>
              </div>
            )}
          </label>

          <label className="checkbox-label">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
            <span>Artista em Destaque</span>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving || uploading}>{saving ? 'A guardar...' : <><Check size={16}/> Guardar</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Event Form Modal ─────────────────────────────────────────
const EventModal = ({ initial, onSave, onClose, pw }) => {
  const [form, setForm] = useState(
    initial ? { ...initial, artists: Array.isArray(initial.artists) ? initial.artists.join(', ') : initial.artists } : emptyEvent
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError('Erro no upload do cartaz: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, artists: typeof form.artists === 'string' ? form.artists.split(',').map(a => a.trim()).filter(Boolean) : form.artists };
      const method = form._id ? 'PUT' : 'POST';
      const url = form._id ? `/api/events/${form._id}` : '/api/events';
      const result = await api(url, { method, body: JSON.stringify(payload) }, pw);
      if (result.error) throw new Error(result.error);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{form._id ? 'Editar Evento' : 'Novo Evento'}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}
          <label>Título *<input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="NOITE AFRO — GAZA SOUNDS" /></label>
          <div className="form-row">
            <label>Data *<input required value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="28 SET 2026" /></label>
            <label>Hora *<input required value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="21:00" /></label>
          </div>
          <label>Local *<input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Praça Central de Xai-Xai" /></label>
          <label>Artistas (separados por vírgula)<input value={form.artists} onChange={e => setForm({...form, artists: e.target.value})} placeholder="MC Xindza, DJ Nyanga" /></label>
          <label>Descrição *<textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></label>
          
          <label>Cartaz / Foto do Evento (Cloudinary)
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <small style={{ color: '#aaa', marginTop: '0.2rem' }}>A carregar cartaz para o Cloudinary...</small>}
            {form.imageUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={form.imageUrl} alt="Preview" style={{ width: 80, height: 50, borderRadius: '4px', objectFit: 'cover', border: '1px solid #444' }} />
                <small style={{ color: '#888', wordBreak: 'break-all' }}>{form.imageUrl}</small>
              </div>
            )}
          </label>

          <label>Link de Bilhetes<input value={form.ticketUrl} onChange={e => setForm({...form, ticketUrl: e.target.value})} placeholder="https://..." /></label>
          <label>Estado
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="upcoming">Próximo</option>
              <option value="past">Passado</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving || uploading}>{saving ? 'A guardar...' : <><Check size={16}/> Guardar</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Gallery Form Modal ────────────────────────────────────────
const emptyGallery = { title: '', eventDate: '', imageUrl: '', category: 'Concertos' };
const GalleryModal = ({ initial, onSave, onClose, pw }) => {
  const [form, setForm] = useState(initial || emptyGallery);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError('Erro no upload da foto: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      setError('Por favor, carregue uma foto.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await api('/api/gallery', { method: 'POST', body: JSON.stringify(form) }, pw);
      if (result.error) throw new Error(result.error);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nova Foto da Galeria</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}
          <label>Título / Descrição da Foto *<input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: MC Xindza no Mabrinhenhe Show" /></label>
          <label>Data do Evento<input value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} placeholder="Ex: 12 AGO 2026" /></label>
          <label>Categoria
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="Concertos">Concertos</option>
              <option value="Festivais">Festivais</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="Bastidores">Bastidores</option>
              <option value="Geral">Geral</option>
            </select>
          </label>
          
          <label>Foto do Evento (Cloudinary) *
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <small style={{ color: '#aaa', marginTop: '0.2rem' }}>A carregar foto para o Cloudinary...</small>}
            {form.imageUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={form.imageUrl} alt="Preview" style={{ width: 80, height: 60, borderRadius: '4px', objectFit: 'cover', border: '1px solid #444' }} />
                <small style={{ color: '#888', wordBreak: 'break-all' }}>{form.imageUrl}</small>
              </div>
            )}
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving || uploading}>{saving ? 'A guardar...' : <><Check size={16}/> Guardar</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ─── Track Form Modal ──────────────────────────────────────────
const emptyTrack = { title: '', artistName: '', audioUrl: '' };
const TrackModal = ({ onSave, onClose, pw }) => {
  const [form, setForm] = useState(emptyTrack);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm((prev) => ({ ...prev, audioUrl: data.url }));
    } catch (err) {
      setError('Erro no upload do áudio: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.audioUrl) {
      setError('Por favor, introduza o link do áudio ou faça upload do ficheiro.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await api('/api/tracks', { method: 'POST', body: JSON.stringify(form) }, pw);
      if (result.error) throw new Error(result.error);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nova Música (Player Flutuante)</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}
          <label>Título da Música *<input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Ex: Gaza Beats (Afrobeat Mix)" /></label>
          <label>Nome do Artista *<input required value={form.artistName} onChange={e => setForm({...form, artistName: e.target.value})} placeholder="Ex: MC Xindza" /></label>
          
          <label>Ficheiro de Áudio MP3 (Cloudinary ou Link MP3) *
            <input type="file" accept="audio/*" onChange={handleAudioUpload} disabled={uploading} />
            {uploading && <small style={{ color: '#aaa', marginTop: '0.2rem' }}>A carregar áudio para o Cloudinary...</small>}
            <input
              style={{ marginTop: '0.5rem' }}
              value={form.audioUrl}
              onChange={e => setForm({...form, audioUrl: e.target.value})}
              placeholder="https://.../musica.mp3"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={saving || uploading}>{saving ? 'A guardar...' : <><Check size={16}/> Guardar</>}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Admin Page ──────────────────────────────────────────
const Admin = () => {
  const [pw, setPw] = useState(() => sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '');
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [trackModal, setTrackModal] = useState(null);
  const [stats, setStats] = useState({ artists: 0, events: 0, posts: 0, contacts: 0, gallery: 0, visits: 0, recentVisits: [] });
  const [artistModal, setArtistModal] = useState(null); // null | {} | {artist}
  const [eventModal, setEventModal] = useState(null);
  const [galleryModal, setGalleryModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!pw;

  const fetchAll = useCallback(async () => {
    if (!pw) return;
    setLoading(true);
    try {
      const [a, e, c, g, st, sb, tr] = await Promise.all([
        fetch('/api/artists').then(r => r.json()),
        fetch('/api/events').then(r => r.json()),
        fetch('/api/contact', { headers: { 'x-admin-password': pw } }).then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/stats', { headers: { 'x-admin-password': pw } }).then(r => r.json()),
        fetch('/api/subscribers', { headers: { 'x-admin-password': pw } }).then(r => r.json()),
        fetch('/api/tracks').then(r => r.json()),
      ]);
      setArtists(Array.isArray(a) ? a : []);
      setEvents(Array.isArray(e) ? e : []);
      setContacts(Array.isArray(c) ? c : []);
      setGallery(Array.isArray(g) ? g : []);
      if (st && !st.error) setStats(st);
      setSubscribers(Array.isArray(sb) ? sb : []);
      setTracks(Array.isArray(tr) ? tr : []);
    } finally {
      setLoading(false);
    }
  }, [pw]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Verify against server by attempting a POST with the password
    const res = await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': loginInput },
      body: JSON.stringify({ name: '__test__', genre: '__test__', description: '__test__' }),
    });
    if (res.status === 401) {
      setLoginError('Senha incorrecta. Tente novamente.');
      return;
    }
    // Login ok — delete the test record if created
    const data = await res.json();
    if (data._id) {
      await fetch(`/api/artists/${data._id}`, { method: 'DELETE', headers: { 'x-admin-password': loginInput } });
    }
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, loginInput);
    setPw(loginInput);
  };

  const handleLogout = () => { sessionStorage.removeItem(ADMIN_PASSWORD_KEY); setPw(''); };

  const deleteArtist = async (id) => {
    if (!window.confirm('Apagar este artista?')) return;
    await api(`/api/artists/${id}`, { method: 'DELETE' }, pw);
    fetchAll();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Apagar este evento?')) return;
    await api(`/api/events/${id}`, { method: 'DELETE' }, pw);
    fetchAll();
  };

  const deleteGalleryPhoto = async (id) => {
    if (!window.confirm('Apagar esta foto da galeria?')) return;
    await api(`/api/gallery/${id}`, { method: 'DELETE' }, pw);
    fetchAll();
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm('Remover este subscritor?')) return;
    await api(`/api/subscribers/${id}`, { method: 'DELETE' }, pw);
    fetchAll();
  };

  const deleteTrack = async (id) => {
    if (!window.confirm('Apagar esta música?')) return;
    await api(`/api/tracks/${id}`, { method: 'DELETE' }, pw);
    fetchAll();
  };
  const deleteContact = async (id) => {
    if (!window.confirm('Apagar esta candidatura?')) return;
    await api(`/api/contact/${id}`, { method: 'DELETE' }, pw);
    fetchAll();
  };

  const updateContactStatus = async (id, status) => {
    await api(`/api/contact/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }, pw);
    fetchAll();
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-box glass">
          <img src="/MABRILOGO.png" alt="Mabrinhenhe Logo" className="admin-login-logo" />
          <h1>MABRINHENHE</h1>
          <p>Painel de Administração</p>
          <form onSubmit={handleLogin}>
            {loginError && <div className="form-error">{loginError}</div>}
            <input
              type="password"
              placeholder="Senha de administrador"
              value={loginInput}
              onChange={e => { setLoginInput(e.target.value); setLoginError(''); }}
              autoFocus
            />
            <button type="submit" className="btn-save" style={{width:'100%', marginTop:'1rem'}}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="sidebar-brand">
          <img src="/MABRILOGO.png" alt="Mabrinhenhe Logo" className="admin-sidebar-logo" />
          <div>
            <span>ADMIN</span>
            <small>Mabrinhenhe</small>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a href="/" className="sidebar-home-link"><Home size={18}/> Ver Site Principal</a>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }} />
          <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}><LayoutDashboard size={18}/> Dashboard</button>
          <button className={tab === 'artists' ? 'active' : ''} onClick={() => setTab('artists')}><Mic2 size={18}/> Artistas</button>
          <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}><Calendar size={18}/> Eventos</button>
          <button className={tab === 'tracks' ? 'active' : ''} onClick={() => setTab('tracks')}><Music size={18}/> Músicas ({tracks.length})</button>
          <button className={tab === 'gallery' ? 'active' : ''} onClick={() => setTab('gallery')}><ImageIcon size={18}/> Galeria</button>
          <button className={tab === 'contacts' ? 'active' : ''} onClick={() => setTab('contacts')}>
            <Mail size={18}/> Candidaturas
            {contacts.filter(c => c.status === 'pendente').length > 0 && (
              <span style={{ marginLeft: 'auto', background: 'white', color: 'black', borderRadius: '20px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 700 }}>
                {contacts.filter(c => c.status === 'pendente').length}
              </span>
            )}
          </button>
          <button className={tab === 'subscribers' ? 'active' : ''} onClick={() => setTab('subscribers')}>
            <Bell size={18}/> Subscritores ({subscribers.length})
          </button>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}><LogOut size={16}/> Sair</button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {tab === 'dashboard' && (
          <>
            <div className="admin-topbar">
              <h2><LayoutDashboard size={22}/> Visão Geral / Estatísticas</h2>
            </div>
            {loading ? <p className="admin-loading">A carregar estatísticas...</p> : (
              <div className="dashboard-content">
                <div className="stats-grid">
                  <div className="stat-card glass">
                    <div className="stat-icon"><Eye size={24}/></div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.visits || 0}</span>
                      <span className="stat-label">Visitas ao Site</span>
                    </div>
                  </div>
                  <div className="stat-card glass">
                    <div className="stat-icon"><Mic2 size={24}/></div>
                    <div className="stat-info">
                      <span className="stat-value">{artists.length || stats.artists || 0}</span>
                      <span className="stat-label">Artistas Cadastrados</span>
                    </div>
                  </div>
                  <div className="stat-card glass">
                    <div className="stat-icon"><Calendar size={24}/></div>
                    <div className="stat-info">
                      <span className="stat-value">{events.length || stats.events || 0}</span>
                      <span className="stat-label">Eventos Registados</span>
                    </div>
                  </div>
                  <div className="stat-card glass">
                    <div className="stat-icon"><ImageIcon size={24}/></div>
                    <div className="stat-info">
                      <span className="stat-value">{gallery.length || stats.gallery || 0}</span>
                      <span className="stat-label">Fotos na Galeria</span>
                    </div>
                  </div>
                  <div className="stat-card glass">
                    <div className="stat-icon"><Mail size={24}/></div>
                    <div className="stat-info">
                      <span className="stat-value">{contacts.length || stats.contacts || 0}</span>
                      <span className="stat-label">Candidaturas / Contactos</span>
                    </div>
                  </div>
                  <div className="stat-card glass">
                    <div className="stat-icon"><MessageSquare size={24}/></div>
                    <div className="stat-info">
                      <span className="stat-value">{stats.posts || 0}</span>
                      <span className="stat-label">Posts na Comunidade</span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="admin-quick-actions glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', letterSpacing: '1px' }}>⚡ Ações Rápidas</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button className="btn-add" onClick={() => { setTab('artists'); setArtistModal({}); }}><Plus size={16}/> Adicionar Artista</button>
                    <button className="btn-add" onClick={() => { setTab('events'); setEventModal({}); }}><Plus size={16}/> Criar Evento</button>
                    <button className="btn-add" onClick={() => { setTab('gallery'); setGalleryModal({}); }}><Plus size={16}/> Adicionar Foto</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'artists' && (
          <>
            <div className="admin-topbar">
              <h2><Mic2 size={22}/> Artistas <span className="count">{artists.length}</span></h2>
              <button className="btn-add" onClick={() => setArtistModal({})}><Plus size={18}/> Novo Artista</button>
            </div>
            {loading ? <p className="admin-loading">A carregar...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Foto</th><th>Nome</th><th>Género</th><th>Destaque</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {artists.length === 0 ? (
                      <tr><td colSpan={5} className="empty-row">Nenhum artista. Clique em "Novo Artista".</td></tr>
                    ) : artists.map(a => (
                      <tr key={a._id}>
                        <td>
                          {a.imageUrl
                            ? <img src={a.imageUrl} alt={a.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid #444' }} />
                            : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666' }}>N/A</div>
                          }
                        </td>
                        <td><strong>{a.name}</strong></td>
                        <td>{a.genre}</td>
                        <td>{a.featured ? <Star size={16} fill="white"/> : '—'}</td>
                        <td className="actions-cell">
                          <button className="icon-btn edit" onClick={() => setArtistModal(a)}><Pencil size={15}/></button>
                          <button className="icon-btn delete" onClick={() => deleteArtist(a._id)}><Trash2 size={15}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'events' && (
          <>
            <div className="admin-topbar">
              <h2><Calendar size={22}/> Eventos <span className="count">{events.length}</span></h2>
              <button className="btn-add" onClick={() => setEventModal({})}><Plus size={18}/> Novo Evento</button>
            </div>
            {loading ? <p className="admin-loading">A carregar...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Cartaz</th><th>Título</th><th>Data</th><th>Local</th><th>Estado</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr><td colSpan={6} className="empty-row">Nenhum evento. Clique em "Novo Evento".</td></tr>
                    ) : events.map(ev => (
                      <tr key={ev._id}>
                        <td>
                          {ev.imageUrl
                            ? <img src={ev.imageUrl} alt={ev.title} style={{ width: 56, height: 40, borderRadius: '4px', objectFit: 'cover', border: '1px solid #444' }} />
                            : <div style={{ width: 56, height: 40, borderRadius: '4px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#666' }}>S/FOTO</div>
                          }
                        </td>
                        <td><strong>{ev.title}</strong></td>
                        <td>{ev.date}</td>
                        <td>{ev.location}</td>
                        <td><span className={`status-badge ${ev.status}`}>{ev.status === 'upcoming' ? 'Próximo' : 'Passado'}</span></td>
                        <td className="actions-cell">
                          <button className="icon-btn edit" onClick={() => setEventModal(ev)}><Pencil size={15}/></button>
                          <button className="icon-btn delete" onClick={() => deleteEvent(ev._id)}><Trash2 size={15}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {tab === 'contacts' && (
          <>
            <div className="admin-topbar">
              <h2><Mail size={22}/> Candidaturas <span className="count">{contacts.length}</span></h2>
            </div>
            {loading ? <p className="admin-loading">A carregar...</p> : (
              <div className="admin-table-wrap">
                {contacts.length === 0 ? (
                  <p className="empty-row" style={{ padding: '2rem', textAlign: 'center' }}>Nenhuma candidatura ainda.</p>
                ) : (
                  <div className="contacts-list">
                    {contacts.map(c => (
                      <div key={c._id} className={`contact-card glass contact-${c.status}`}>
                        <div className="contact-card-header">
                          <div>
                            <strong>{c.name}</strong>
                            <span className={`contact-badge ${c.status}`}>
                              {c.status === 'pendente' ? <><Clock size={11}/> Pendente</> :
                               c.status === 'lido' ? <><CheckCircle size={11}/> Lido</> :
                               c.status === 'aprovado' ? <><CheckCircle size={11}/> Aprovado</> :
                               <><XCircle size={11}/> Rejeitado</>}
                            </span>
                          </div>
                          <button className="icon-btn delete" onClick={() => deleteContact(c._id)}><Trash2 size={15}/></button>
                        </div>
                        <div className="contact-card-meta">
                          <span>{c.email}</span>
                          {c.phone && <span style={{ color: '#4ade80' }}>WhatsApp: {c.phone}</span>}
                          <span className="contact-type-badge">{c.type}</span>
                          {c.genre && <span>{c.genre}</span>}
                        </div>
                        <p className="contact-message">{c.message}</p>
                        {(c.instagram || c.tiktok || c.musicLink || c.portfolioLink) && (
                          <div className="contact-socials">
                            {c.phone && <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#000', fontWeight: 'bold' }}>WhatsApp 💬</a>}
                            {c.musicLink && <a href={c.musicLink} target="_blank" rel="noreferrer">🎵 Músicas ↗</a>}
                            {c.portfolioLink && <a href={c.portfolioLink} target="_blank" rel="noreferrer">📁 Portfólio ↗</a>}
                            {c.instagram && <a href={c.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}
                            {c.tiktok && <a href={c.tiktok} target="_blank" rel="noreferrer">TikTok ↗</a>}
                          </div>
                        )}
                        <div className="contact-actions">
                          <span style={{ fontSize: '0.72rem', color: '#666' }}>{new Date(c.createdAt).toLocaleDateString('pt-PT')}</span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {c.status !== 'lido' && <button className="btn-status lido" onClick={() => updateContactStatus(c._id, 'lido')}>Marcar Lido</button>}
                            {c.status !== 'aprovado' && <button className="btn-status aprovado" onClick={() => updateContactStatus(c._id, 'aprovado')}>Aprovar</button>}
                            {c.status !== 'rejeitado' && <button className="btn-status rejeitado" onClick={() => updateContactStatus(c._id, 'rejeitado')}>Rejeitar</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {tab === 'gallery' && (
          <>
            <div className="admin-topbar">
              <h2><ImageIcon size={22}/> Galeria de Fotos <span className="count">{gallery.length}</span></h2>
              <button className="btn-add" onClick={() => setGalleryModal({})}><Plus size={18}/> Nova Foto</button>
            </div>
            {loading ? <p className="admin-loading">A carregar...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Foto</th><th>Título / Descrição</th><th>Data do Evento</th><th>Categoria</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {gallery.length === 0 ? (
                      <tr><td colSpan={5} className="empty-row">Nenhuma foto na galeria. Clique em "Nova Foto".</td></tr>
                    ) : gallery.map(item => (
                      <tr key={item._id}>
                        <td>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} style={{ width: 60, height: 45, borderRadius: '4px', objectFit: 'cover', border: '1px solid #444' }} />
                          ) : (
                            <div style={{ width: 60, height: 45, borderRadius: '4px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#666' }}>S/FOTO</div>
                          )}
                        </td>
                        <td><strong>{item.title}</strong></td>
                        <td>{item.eventDate || '—'}</td>
                        <td><span className="contact-type-badge">{item.category || 'Geral'}</span></td>
                        <td className="actions-cell">
                          <button className="icon-btn delete" onClick={() => deleteGalleryPhoto(item._id)}><Trash2 size={15}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {tab === 'subscribers' && (
          <>
            <div className="admin-topbar">
              <h2><Bell size={22}/> Lista de Subscritores <span className="count">{subscribers.length}</span></h2>
            </div>
            {loading ? <p className="admin-loading">A carregar...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Email</th><th>Data de Inscrição</th><th>Estado</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr><td colSpan={4} className="empty-row">Nenhum subscritor inscrito ainda.</td></tr>
                    ) : subscribers.map(sub => (
                      <tr key={sub._id}>
                        <td><strong>{sub.email}</strong></td>
                        <td>{new Date(sub.createdAt).toLocaleDateString('pt-PT')}</td>
                        <td><span className="contact-badge aprovado">Ativo</span></td>
                        <td className="actions-cell">
                          <button className="icon-btn delete" onClick={() => deleteSubscriber(sub._id)}><Trash2 size={15}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {tab === 'tracks' && (
          <>
            <div className="admin-topbar">
              <h2><Music size={22}/> Músicas do Player <span className="count">{tracks.length}</span></h2>
              <button className="btn-add" onClick={() => setTrackModal({})}><Plus size={18}/> Nova Música</button>
            </div>
            {loading ? <p className="admin-loading">A carregar...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Título</th><th>Artista</th><th>Ficheiro de Áudio</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {tracks.length === 0 ? (
                      <tr><td colSpan={4} className="empty-row">Nenhuma música no player. Clique em "Nova Música".</td></tr>
                    ) : tracks.map(t => (
                      <tr key={t._id}>
                        <td><strong>{t.title}</strong></td>
                        <td>{t.artistName}</td>
                        <td><small style={{ color: '#888', wordBreak: 'break-all' }}>{t.audioUrl}</small></td>
                        <td className="actions-cell">
                          <button className="icon-btn delete" onClick={() => deleteTrack(t._id)}><Trash2 size={15}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {artistModal !== null && (
        <ArtistModal
          initial={artistModal._id ? artistModal : null}
          pw={pw}
          onClose={() => setArtistModal(null)}
          onSave={() => { setArtistModal(null); fetchAll(); }}
        />
      )}
      {eventModal !== null && (
        <EventModal
          initial={eventModal._id ? eventModal : null}
          pw={pw}
          onClose={() => setEventModal(null)}
          onSave={() => { setEventModal(null); fetchAll(); }}
        />
      )}
      {galleryModal !== null && (
        <GalleryModal
          initial={galleryModal._id ? galleryModal : null}
          pw={pw}
          onClose={() => setGalleryModal(null)}
          onSave={() => { setGalleryModal(null); fetchAll(); }}
        />
      )}
      {trackModal !== null && (
        <TrackModal
          pw={pw}
          onClose={() => setTrackModal(null)}
          onSave={() => { setTrackModal(null); fetchAll(); }}
        />
      )}
    </div>
  );
};

export default Admin;
