const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  }
});
app.use('/api/', limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/bookings', require('./routes/bookings'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'رحلات الجنة API is running!',
    timestamp: new Date().toISOString()
  });
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ 
    message: 'رحلات الجنة - Voyages du Paradis API',
    version: '1.0.0',
    endpoints: {
      destinations: '/api/destinations',
      reservations: '/api/reservations',
      admin: '/api/admin',
      auth: '/api/auth'
    }
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Connexion à MongoDB
const connectDB = async () => {
  try {
    console.log('🔍 Vérification des variables d\'environnement:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Non défini');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PORT:', process.env.PORT);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🌐 API disponible sur: http://localhost:${PORT}`);
    console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer(); 