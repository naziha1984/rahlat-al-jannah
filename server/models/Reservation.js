const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID de l\'utilisateur est requis']
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: [true, 'L\'ID de la destination est requis']
  },
  dateDepart: {
    type: Date,
    required: [true, 'La date de départ est requise'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'La date de départ doit être dans le futur'
    }
  },
  dateRetour: {
    type: Date,
    required: [true, 'La date de retour est requise'],
    validate: {
      validator: function(value) {
        return value > this.dateDepart;
      },
      message: 'La date de retour doit être après la date de départ'
    }
  },
  participants: {
    type: Number,
    required: [true, 'Le nombre de participants est requis'],
    min: [1, 'Il doit y avoir au moins 1 participant'],
    max: [20, 'Le nombre maximum de participants est 20']
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'annulee', 'terminee'],
    default: 'en_attente'
  },
  prixTotal: {
    type: Number,
    required: [true, 'Le prix total est requis'],
    min: [0, 'Le prix total ne peut pas être négatif']
  },
  devise: {
    type: String,
    default: 'EUR',
    enum: ['EUR', 'USD', 'MAD', 'DZD', 'TND']
  },
  informationsSupplementaires: {
    nomComplet: {
      type: String,
      required: [true, 'Le nom complet est requis']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez entrer un email valide'
      ]
    },
    telephone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis']
    },
    preferences: {
      type: String,
      maxlength: [500, 'Les préférences ne peuvent pas dépasser 500 caractères']
    },
    demandesSpeciales: {
      type: String,
      maxlength: [1000, 'Les demandes spéciales ne peuvent pas dépasser 1000 caractères']
    }
  },
  paiement: {
    methode: {
      type: String,
      enum: ['carte', 'virement', 'especes', 'cheque'],
      required: [true, 'La méthode de paiement est requise']
    },
    statut: {
      type: String,
      enum: ['en_attente', 'paye', 'refuse', 'rembourse'],
      default: 'en_attente'
    },
    datePaiement: Date,
    reference: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
reservationSchema.index({ userId: 1 });
reservationSchema.index({ destinationId: 1 });
reservationSchema.index({ statut: 1 });
reservationSchema.index({ dateDepart: 1 });
reservationSchema.index({ 'paiement.statut': 1 });

// Middleware pre-save pour mettre à jour la date de modification
reservationSchema.pre('save', function(next) {
  this.dateModification = new Date();
  next();
});

// Méthode pour calculer la durée du voyage
reservationSchema.methods.calculerDuree = function() {
  const diffTime = Math.abs(this.dateRetour - this.dateDepart);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Méthode pour vérifier si la réservation peut être annulée
reservationSchema.methods.peutEtreAnnulee = function() {
  const maintenant = new Date();
  const joursAvantDepart = Math.ceil((this.dateDepart - maintenant) / (1000 * 60 * 60 * 24));
  return this.statut === 'en_attente' || this.statut === 'confirmee' && joursAvantDepart > 7;
};

// Méthode pour calculer le montant de remboursement
reservationSchema.methods.calculerRemboursement = function() {
  if (this.statut !== 'annulee') return 0;
  
  const maintenant = new Date();
  const joursAvantDepart = Math.ceil((this.dateDepart - maintenant) / (1000 * 60 * 60 * 24));
  
  if (joursAvantDepart > 30) {
    return this.prixTotal * 0.9; // 90% de remboursement
  } else if (joursAvantDepart > 7) {
    return this.prixTotal * 0.5; // 50% de remboursement
  } else {
    return 0; // Pas de remboursement
  }
};

// Méthode pour formater le prix total
reservationSchema.methods.getPrixTotalFormate = function() {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: this.devise
  });
  return formatter.format(this.prixTotal);
};

// Méthode statique pour obtenir les réservations d'un utilisateur
reservationSchema.statics.getReservationsUtilisateur = function(userId) {
  return this.find({ userId })
    .populate('destinationId', 'nom imageUrl prix devise')
    .sort({ dateCreation: -1 });
};

// Méthode statique pour obtenir les statistiques
reservationSchema.statics.getStatistiques = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$statut',
        count: { $sum: 1 },
        totalPrix: { $sum: '$prixTotal' }
      }
    }
  ]);
};

module.exports = mongoose.model('Reservation', reservationSchema); 