import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, Users, TrendingUp } from 'lucide-react';
import './Community.css';

const initialPosts = [
  {
    id: 1,
    user: 'Nomsa G.',
    initials: 'NG',
    time: 'há 2 horas',
    content: '🔥 O show de ontem com o MC Xindza foi incrível! Que energia! Gaza é cultura! Mal posso esperar pelo próximo evento da Mabrinhenhe!',
    likes: 34,
    comments: 8,
    liked: false,
  },
  {
    id: 2,
    user: 'Pedro F.',
    initials: 'PF',
    time: 'há 5 horas',
    content: 'Alguém sabe quando saem os bilhetes para o Festival Marrabenta Viva? Já marquei na agenda! 🎶',
    likes: 12,
    comments: 5,
    liked: false,
  },
  {
    id: 3,
    user: 'Lucia V.',
    initials: 'LV',
    time: 'há 1 dia',
    content: 'A Bella Maputo é uma das melhores vozes de Moçambique! Orgulho da nossa província! 🌟 #GazaSounds #Mabrinhenhe',
    likes: 57,
    comments: 14,
    liked: false,
  },
];

const Community = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      user: 'Você',
      initials: 'VC',
      time: 'agora mesmo',
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts([post, ...posts]);
    setNewPost('');
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
              <div className="composer-avatar">VC</div>
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
            <div className="posts-list">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  className="post-card glass"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="post-header">
                    <div className="post-avatar">{post.initials}</div>
                    <div>
                      <strong>{post.user}</strong>
                      <span className="post-time">{post.time}</span>
                    </div>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-actions">
                    <button
                      className={`action-btn ${post.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart size={16} fill={post.liked ? 'white' : 'none'} /> {post.likes}
                    </button>
                    <button className="action-btn">
                      <MessageCircle size={16} /> {post.comments}
                    </button>
                    <button className="action-btn">
                      <Share2 size={16} /> Partilhar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="community-sidebar">
            <div className="sidebar-widget glass">
              <h4><Users size={18} /> Comunidade Activa</h4>
              <div className="stat-row"><span>Membros</span><strong>2 340</strong></div>
              <div className="stat-row"><span>Online agora</span><strong>128</strong></div>
              <div className="stat-row"><span>Posts hoje</span><strong>47</strong></div>
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
