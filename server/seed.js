require('dotenv').config();
const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Event = require('./models/Event');

const artists = [
  {
    name: 'MC Xindza',
    genre: 'Hip-Hop • Afrobeat',
    description: 'Voz marcante da Província de Gaza. Referência no hip-hop moçambicano com letras que tocam a realidade da juventude.',
    featured: true,
    imageUrl: '',
  },
  {
    name: 'Bella Maputo',
    genre: 'Afropop • R&B',
    description: 'Uma artista que mistura sons africanos com ritmos modernos de forma única. Conhecida pela sua voz suave e presença de palco.',
    featured: false,
    imageUrl: '',
  },
  {
    name: 'DJ Nyanga',
    genre: 'Electronic • House',
    description: 'Producer e DJ reconhecido por sets energéticos e sons inovadores. Já tocou nos maiores eventos de Gaza.',
    featured: false,
    imageUrl: '',
  },
  {
    name: 'Grupo Chibuto',
    genre: 'Marrabenta • Tradicional',
    description: 'Preservando a riqueza cultural de Gaza através da música tradicional moçambicana. Orgulho da Província.',
    featured: false,
    imageUrl: '',
  },
  {
    name: 'Simão Flow',
    genre: 'Rap • Soul',
    description: 'Letras profundas que refletem a realidade e a esperança da juventude moçambicana. Flow único e inconfundível.',
    featured: false,
    imageUrl: '',
  },
  {
    name: 'Ana Vilankulos',
    genre: 'Gospel • World Music',
    description: 'Voz poderosa que eleva o espírito e une comunidades através da música. Uma das vozes mais respeitadas da região.',
    featured: false,
    imageUrl: '',
  },
];

const events = [
  {
    title: 'NOITE AFRO — GAZA SOUNDS',
    date: '28 SET 2026',
    time: '21:00',
    location: 'Praça Central de Xai-Xai',
    artists: ['MC Xindza', 'DJ Nyanga', 'Bella Maputo'],
    status: 'upcoming',
    description: 'A grande noite do som africano. Três artistas numa noite histórica para Gaza. Uma experiência musical inesquecível.',
    ticketUrl: '',
  },
  {
    title: 'FESTIVAL MARRABENTA VIVA',
    date: '15 OUT 2026',
    time: '18:00',
    location: 'Estádio Municipal de Gaza',
    artists: ['Grupo Chibuto', 'Ana Vilankulos'],
    status: 'upcoming',
    description: 'Celebração da música tradicional moçambicana com os melhores artistas da região de Gaza.',
    ticketUrl: '',
  },
  {
    title: 'UNDERGROUND FLOW',
    date: '02 NOV 2026',
    time: '20:00',
    location: 'Club Flamingo, Xai-Xai',
    artists: ['Simão Flow', 'MC Xindza'],
    status: 'upcoming',
    description: 'Uma noite dedicada ao hip-hop e rap de produção moçambicana. Para os verdadeiros amantes da cultura urbana.',
    ticketUrl: '',
  },
  {
    title: 'MABRINHENHE ANNIVERSARY SHOW',
    date: '12 AGO 2026',
    time: '19:00',
    location: 'Jardim da Cidade, Xai-Xai',
    artists: ['MC Xindza', 'Bella Maputo', 'DJ Nyanga', 'Grupo Chibuto', 'Simão Flow', 'Ana Vilankulos'],
    status: 'past',
    description: 'Aniversário da produtora com uma noite histórica de música ao vivo. Todos os artistas da família Mabrinhenhe reunidos num só palco.',
    ticketUrl: '',
  },
];

async function seed() {
  console.log('🌱 A iniciar seed da base de dados...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Ligado ao MongoDB Atlas!\n');

    // Limpar dados existentes
    await Artist.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️  Dados anteriores removidos.\n');

    // Inserir artistas
    const insertedArtists = await Artist.insertMany(artists);
    console.log(`🎤 ${insertedArtists.length} artistas inseridos:`);
    insertedArtists.forEach(a => console.log(`   → ${a.name} (${a.genre})`));

    // Inserir eventos
    const insertedEvents = await Event.insertMany(events);
    console.log(`\n🎪 ${insertedEvents.length} eventos inseridos:`);
    insertedEvents.forEach(e => console.log(`   → ${e.title} [${e.status}]`));

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('🚀 Podes agora iniciar o servidor: node server.js\n');
  } catch (err) {
    console.error('❌ Erro durante o seed:', err.message);
    if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')) {
      console.error('\n👉 O teu IP não está na whitelist do MongoDB Atlas.');
      console.error('   Vai a: https://cloud.mongodb.com → Network Access → Add IP Address → 0.0.0.0/0\n');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Ligação encerrada.');
    process.exit(0);
  }
}

seed();
