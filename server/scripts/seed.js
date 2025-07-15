const mongoose = require('mongoose');
const User = require('../models/User');
const Destination = require('../models/Destination');
require('dotenv').config();

// Connexion à MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

// Données d'exemple pour les destinations
const destinationsExemple = [
  {
    nom: {
      fr: "Plages paradisiaques de Bali",
      en: "Paradise Beaches of Bali",
      ar: "شواطئ بالي الجنة"
    },
    description: {
      fr: "Découvrez les plus belles plages de Bali avec ses eaux cristallines, ses temples ancestraux et sa culture unique. Un voyage inoubliable entre tradition et modernité.",
      en: "Discover the most beautiful beaches of Bali with crystal clear waters, ancient temples and unique culture. An unforgettable journey between tradition and modernity.",
      ar: "اكتشف أجمل شواطئ بالي بمياهها البلورية ومعابدها القديمة وثقافتها الفريدة. رحلة لا تُنسى بين التقليد والحداثة."
    },
    prix: 1299,
    devise: "EUR",
    imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
    images: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
    ],
    disponibilite: true,
    duree: 10,
    difficulte: "facile",
    categorie: "plage",
    pays: "Indonésie",
    ville: "Bali",
    coordonnees: {
      latitude: -8.3405,
      longitude: 115.0920
    },
    caracteristiques: ["hôtel_inclus", "repas_inclus", "transport_inclus", "guide_inclus"],
    note: 4.8,
    nombreAvis: 156,
    popularite: 1250
  },
  {
    nom: {
      fr: "Aventure dans les montagnes du Maroc",
      en: "Adventure in the Moroccan Mountains",
      ar: "مغامرة في جبال المغرب"
    },
    description: {
      fr: "Explorez les majestueuses montagnes de l'Atlas, découvrez les villages berbères traditionnels et vivez une expérience authentique au cœur du Maroc.",
      en: "Explore the majestic Atlas Mountains, discover traditional Berber villages and experience an authentic experience in the heart of Morocco.",
      ar: "استكشف جبال الأطلس المهيبة واكتشف القرى الأمازيغية التقليدية وعش تجربة أصيلة في قلب المغرب."
    },
    prix: 899,
    devise: "EUR",
    imageUrl: "https://images.unsplash.com/photo-1553603229-0f1a5d2c735b?w=800",
    images: [
      "https://images.unsplash.com/photo-1553603229-0f1a5d2c735b?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800"
    ],
    disponibilite: true,
    duree: 8,
    difficulte: "modérée",
    categorie: "montagne",
    pays: "Maroc",
    ville: "Atlas",
    coordonnees: {
      latitude: 31.7917,
      longitude: -7.0926
    },
    caracteristiques: ["hôtel_inclus", "repas_inclus", "guide_inclus"],
    note: 4.6,
    nombreAvis: 89,
    popularite: 890
  },
  {
    nom: {
      fr: "Séjour culturel à Istanbul",
      en: "Cultural Stay in Istanbul",
      ar: "إقامة ثقافية في إسطنبول"
    },
    description: {
      fr: "Plongez dans l'histoire fascinante d'Istanbul, entre Europe et Asie. Découvrez la mosquée Sainte-Sophie, le Grand Bazar et la culture turque authentique.",
      en: "Dive into the fascinating history of Istanbul, between Europe and Asia. Discover the Hagia Sophia, the Grand Bazaar and authentic Turkish culture.",
      ar: "انغمس في التاريخ الرائع لإسطنبول بين أوروبا وآسيا. اكتشف آيا صوفيا والبازار الكبير والثقافة التركية الأصيلة."
    },
    prix: 749,
    devise: "EUR",
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
    ],
    disponibilite: true,
    duree: 6,
    difficulte: "facile",
    categorie: "culturel",
    pays: "Turquie",
    ville: "Istanbul",
    coordonnees: {
      latitude: 41.0082,
      longitude: 28.9784
    },
    caracteristiques: ["hôtel_inclus", "repas_inclus", "visites_inclus"],
    note: 4.7,
    nombreAvis: 203,
    popularite: 1100
  },
  {
    nom: {
      fr: "Safari dans le désert tunisien",
      en: "Safari in the Tunisian Desert",
      ar: "سفاري في الصحراء التونسية"
    },
    description: {
      fr: "Vivez l'aventure du désert tunisien avec un safari authentique. Dormez sous les étoiles, découvrez les oasis et rencontrez les nomades du Sahara.",
      en: "Experience the adventure of the Tunisian desert with an authentic safari. Sleep under the stars, discover oases and meet the nomads of the Sahara.",
      ar: "عش مغامرة الصحراء التونسية مع سفاري أصيل. نم تحت النجوم واكتشف الواحات والتق بالبدو الرحل في الصحراء."
    },
    prix: 649,
    devise: "EUR",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800"
    ],
    disponibilite: true,
    duree: 5,
    difficulte: "modérée",
    categorie: "désert",
    pays: "Tunisie",
    ville: "Sahara",
    coordonnees: {
      latitude: 33.8869,
      longitude: 9.5375
    },
    caracteristiques: ["hôtel_inclus", "repas_inclus", "transport_inclus", "guide_inclus"],
    note: 4.5,
    nombreAvis: 67,
    popularite: 720
  },
  {
    nom: {
      fr: "Escapade romantique à Paris",
      en: "Romantic Getaway in Paris",
      ar: "هروب رومانسي في باريس"
    },
    description: {
      fr: "La ville de l'amour vous attend ! Découvrez la Tour Eiffel, les Champs-Élysées, le Louvre et tous les trésors de la capitale française.",
      en: "The city of love awaits you! Discover the Eiffel Tower, the Champs-Élysées, the Louvre and all the treasures of the French capital.",
      ar: "مدينة الحب تنتظرك! اكتشف برج إيفل وشانزليزيه واللوفر وجميع كنوز العاصمة الفرنسية."
    },
    prix: 1599,
    devise: "EUR",
    imageUrl: "https://images.unsplash.com/photo-1502602898534-47d9c0b3d5b8?w=800",
    images: [
      "https://images.unsplash.com/photo-1502602898534-47d9c0b3d5b8?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
    ],
    disponibilite: true,
    duree: 7,
    difficulte: "facile",
    categorie: "ville",
    pays: "France",
    ville: "Paris",
    coordonnees: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    caracteristiques: ["hôtel_inclus", "repas_inclus", "visites_inclus"],
    note: 4.9,
    nombreAvis: 312,
    popularite: 1800
  },
  {
    nom: {
      fr: "Aventure en forêt amazonienne",
      en: "Amazon Rainforest Adventure",
      ar: "مغامرة في غابة الأمازون"
    },
    description: {
      fr: "Explorez la plus grande forêt tropicale du monde. Découvrez une biodiversité unique, rencontrez les tribus locales et vivez une aventure inoubliable.",
      en: "Explore the world's largest rainforest. Discover unique biodiversity, meet local tribes and experience an unforgettable adventure.",
      ar: "استكشف أكبر غابة استوائية في العالم. اكتشف التنوع البيولوجي الفريد والتق بالقبائل المحلية وعش مغامرة لا تُنسى."
    },
    prix: 1899,
    devise: "EUR",
    imageUrl: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
    images: [
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"
    ],
    disponibilite: true,
    duree: 12,
    difficulte: "difficile",
    categorie: "aventure",
    pays: "Brésil",
    ville: "Amazonie",
    coordonnees: {
      latitude: -3.4653,
      longitude: -58.3804
    },
    caracteristiques: ["hôtel_inclus", "repas_inclus", "transport_inclus", "guide_inclus", "assurance_inclus"],
    note: 4.4,
    nombreAvis: 45,
    popularite: 650
  }
];

// Fonction pour créer l'administrateur par défaut
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      await User.create({
        nom: 'Administrateur',
        email: 'admin@paradis.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Administrateur créé avec succès');
    } else {
      console.log('ℹ️  Administrateur existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  }
};

// Fonction pour créer les destinations d'exemple
const createDestinations = async () => {
  try {
    // Supprimer les destinations existantes
    await Destination.deleteMany({});
    console.log('🗑️  Anciennes destinations supprimées');

    // Créer les nouvelles destinations
    const destinations = await Destination.insertMany(destinationsExemple);
    console.log(`✅ ${destinations.length} destinations créées avec succès`);

    return destinations;
  } catch (error) {
    console.error('❌ Erreur lors de la création des destinations:', error);
  }
};

// Fonction principale
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Début du seeding de la base de données...');
    
    await createAdmin();
    await createDestinations();
    
    console.log('✅ Seeding terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  }
};

// Exécuter le script
seedDatabase(); 