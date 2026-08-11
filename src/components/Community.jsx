import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, Users, TrendingUp } from 'lucide-react';
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});

  const fetchPosts = () => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    const isLiked = likedPosts[id];
    const action = isLiked ? 'unlike' : 'like';

    setLikedPosts((prev) => ({ ...prev, [id]: !isLiked }));
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 } : p
      )
    );

    try {
      await fetch(`/api/posts/${id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
    } catch (err) {
      console.error('Erro ao atualizar gostos:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const contentText = newPost;
    setNewPost('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentText,
          user: 'Membro Comunidade',
          initials: 'MC',
        }),
      });
      const createdPost = await res.json();
      if (createdPost._id) {
        setPosts([createdPost, ...posts]);
      } else {
        fetchPosts();
      }
    } catch (err) {
      console.error('Erro ao publicar:', err);
    }
  };

  return (
    <section className="community-section" id="comunidade">
      <div className="container">
        <div className="section-header">
          <h2>COMUNIDADE</h2>
          <p>Um espaço de diversão, crescimento e socialização saudável</p>
        </div>

        <div className="community-layout">
          {/* Feed */}
          <div className="feed-col">
            {/* Post composer */}
            <motion.form
              className="composer glass"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="composer-avatar">MC</div>
              <div className="composer-input">
                <textarea
                  placeholder="Partilhe um pensamento, um momento musical..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <button type="submit" className="submit-btn">
                  <Send size={18} /> Publicar
                </button>
              </div>
            </motion.form>

            {/* Posts */}
            {loading ? (
              <div className="loading-state">A carregar publicações da comunidade...</div>
            ) : posts.length === 0 ? (
              <div className="empty-state">Seja o primeiro a publicar algo na comunidade!</div>
            ) : (
              <div className="posts-list">
                {posts.map((post, i) => {
                  const isLiked = likedPosts[post._id];
                  return (
                    <motion.div
                      key={post._id}
                      className="post-card glass"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="post-header">
                        <div className="post-avatar">{post.initials || 'MM'}</div>
                        <div>
                          <strong>{post.user || 'Membro Mabrinhenhe'}</strong>
                          <span className="post-time">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-PT') : 'recente'}
                          </span>
                        </div>
                      </div>
                      <p className="post-content">{post.content}</p>
                      <div className="post-actions">
                        <button
                          className={`action-btn ${isLiked ? 'liked' : ''}`}
                          onClick={() => handleLike(post._id)}
                        >
                          <Heart size={16} fill={isLiked ? 'white' : 'none'} /> {post.likes || 0}
                        </button>
                        <button className="action-btn">
                          <MessageCircle size={16} /> {post.comments || 0}
                        </button>
                        <button className="action-btn">
                          <Share2 size={16} /> Partilhar
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="community-sidebar">
            <div className="sidebar-widget glass">
              <h4><Users size={18} /> Comunidade Activa</h4>
              <div className="stat-row"><span>Publicações</span><strong>{posts.length}</strong></div>
              <div className="stat-row"><span>Online agora</span><strong>128</strong></div>
              <div className="stat-row"><span>Membros</span><strong>2 340</strong></div>
            </div>
            <div className="sidebar-widget glass">
              <h4><TrendingUp size={18} /> Em Destaque</h4>
              <p className="trend">#GazaSounds</p>
              <p className="trend">#MabrinhenheLive</p>
              <p className="trend">#MarrabentaViva</p>
              <p className="trend">#MCXindza</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
