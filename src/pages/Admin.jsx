import React, { useState, useEffect, useCallback } from 'react';
import { Mic2, Calendar, LogOut, Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';
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

// ─── Main Admin Page ──────────────────────────────────────────
const Admin = () => {
  const [pw, setPw] = useState(() => sessionStorage.getItem(ADMIN_PASSWORD_KEY) || '');
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('artists');
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [artistModal, setArtistModal] = useState(null); // null | {} | {artist}
  const [eventModal, setEventModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!pw;

  const fetchAll = useCallback(async () => {
    if (!pw) return;
    setLoading(true);
    try {
      const [a, e] = await Promise.all([fetch('/api/artists').then(r => r.json()), fetch('/api/events').then(r => r.json())]);
      setArtists(Array.isArray(a) ? a : []);
      setEvents(Array.isArray(e) ? e : []);
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

  // ── Login screen ──
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
          <button className={tab === 'artists' ? 'active' : ''} onClick={() => setTab('artists')}><Mic2 size={18}/> Artistas</button>
          <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}><Calendar size={18}/> Eventos</button>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}><LogOut size={16}/> Sair</button>
      </aside>

      {/* Main */}
      <main className="admin-main">
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
                    <tr><th>Nome</th><th>Género</th><th>Destaque</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {artists.length === 0 ? (
                      <tr><td colSpan={4} className="empty-row">Nenhum artista. Clique em "Novo Artista".</td></tr>
                    ) : artists.map(a => (
                      <tr key={a._id}>
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
                    <tr><th>Título</th><th>Data</th><th>Local</th><th>Estado</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr><td colSpan={5} className="empty-row">Nenhum evento. Clique em "Novo Evento".</td></tr>
                    ) : events.map(ev => (
                      <tr key={ev._id}>
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
    </div>
  );
};

export default Admin;
