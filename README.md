# Mabrinhenhe Entretenimento 🎵

Plataforma oficial da **Mabrinhenhe Entretenimento**, produtora musical e promovora de eventos da Província de Gaza, Moçambique.

## 🚀 Tecnologias

- **Frontend:** React, Vite, Framer Motion, Lucide React, Custom CSS (Black & White Theme)
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose)

## 📁 Estrutura do Projeto

```
Mabrinhenhe Entretenimento/
├── src/                 # Frontend React (Artistas, Eventos, Comunidade)
├── server/              # Backend API Express + MongoDB (Modelos, Rotas, Seed)
│   ├── models/          # Artist.js, Event.js
│   ├── routes/          # artists.js, events.js
│   ├── seed.js          # Script de povoamento de dados
│   └── server.js        # Servidor principal
└── package.json
```

## 🛠️ Como Executar

### 1. Frontend
```bash
npm install
npm run dev
```

### 2. Backend
```bash
cd server
npm install
# Crie o ficheiro .env baseado no .env.example
node server.js
```

### 3. Seed da Base de Dados
```bash
cd server
node seed.js
```

## 🔐 Painel Admin
Aceda a `http://localhost:5173/admin` para gerir os artistas e eventos em tempo real.
