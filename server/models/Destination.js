const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  nom: {
    fr: {
      type: String,
      required: [true, 'Le nom en français est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    en: {
      type: String,
      required: [true, 'Le nom en anglais est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    ar: {
      type: String,
      required: [true, 'Le nom en arabe est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    }
  },
  description: {
    fr: {
      type: String,
      required: [true, 'La description en français est requise'],
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
    },
    en: {
      type: String,
      required: [true, 'La description en anglais est requise'],
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
    },
    ar: {
      type: String,
      required: [true, 'La description en arabe est requise'],
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
    }
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  devise: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'MAD', 'DZD', 'TND']
  },
  imageUrl: {
    type: String,
    required: [true, 'L\'URL de l\'image est requise']
  },
  images: [{
    type: String
  }],
  disponibilite: {
    type: Boolean,
    default: true
  },
  duree: {
    type: Number, // en jours
    required: [true, 'La durée est requise'],
    min: [1, 'La durée doit être d\'au moins 1 jour']
  },
  difficulte: {
    type: String,
    enum: ['facile', 'modérée', 'difficile'],
    default: 'modérée'
  },
  categorie: {
    type: String,
    enum: ['plage', 'montagne', 'ville', 'campagne', 'désert', 'culturel', 'aventure'],
    required: [true, 'La catégorie est requise']
  },
  pays: {
    type: String,
    required: [true, 'Le pays est requis']
  },
  ville: {
    type: String,
    required: [true, 'La ville est requise']
  },
  coordonnees: {
    latitude: Number,
    longitude: Number
  },
  caracteristiques: [{
    type: String,
    enum: [
      'hôtel_inclus', 'repas_inclus', 'transport_inclus', 
      'guide_inclus', 'assurance_inclus', 'visites_inclus'
    ]
  }],
  note: {
    type: Number,
    default: 0,
    min: [0, 'La note ne peut pas être négative'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  nombreAvis: {
    type: Number,
    default: 0
  },
  popularite: {
    type: Number,
    default: 0
  },
  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
destinationSchema.index({ 'nom.fr': 'text', 'nom.en': 'text', 'nom.ar': 'text' });
destinationSchema.index({ categorie: 1 });
destinationSchema.index({ pays: 1 });
destinationSchema.index({ prix: 1 });
destinationSchema.index({ disponibilite: 1 });
destinationSchema.index({ actif: 1 });

// Méthode pour obtenir le nom dans une langue spécifique
destinationSchema.methods.getNom = function(langue = 'fr') {
  return this.nom[langue] || this.nom.fr;
};

// Méthode pour obtenir la description dans une langue spécifique
destinationSchema.methods.getDescription = function(langue = 'fr') {
  return this.description[langue] || this.description.fr;
};

// Méthode pour calculer la note moyenne
destinationSchema.methods.calculerNoteMoyenne = function() {
  if (this.nombreAvis === 0) return 0;
  return this.note / this.nombreAvis;
};

// Méthode pour formater le prix avec la devise
destinationSchema.methods.getPrixFormate = function() {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: this.devise
  });
  return formatter.format(this.prix);
};

// Méthode pour vérifier si la destination est disponible
destinationSchema.methods.estDisponible = function() {
  return this.disponibilite && this.actif;
};

// Méthode statique pour rechercher des destinations
destinationSchema.statics.rechercher = function(criteres) {
  const query = { actif: true };
  
  if (criteres.pays) query.pays = new RegExp(criteres.pays, 'i');
  if (criteres.categorie) query.categorie = criteres.categorie;
  if (criteres.disponibilite !== undefined) query.disponibilite = criteres.disponibilite;
  if (criteres.prixMin) query.prix = { $gte: criteres.prixMin };
  if (criteres.prixMax) {
    if (query.prix) {
      query.prix.$lte = criteres.prixMax;
    } else {
      query.prix = { $lte: criteres.prixMax };
    }
  }
  
  return this.find(query).sort({ popularite: -1, note: -1 });
};

module.exports = mongoose.model('Destination', destinationSchema); 