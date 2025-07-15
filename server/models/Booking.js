const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id_offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  statut: { type: String, enum: ['en_attente', 'confirmé', 'annulé'], default: 'en_attente' },
  infosVoyageur: {
    nom: String,
    prenom: String,
    email: String,
    telephone: String,
    passeport: String
  },
  dateReservation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema); 