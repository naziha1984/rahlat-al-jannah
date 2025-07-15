const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  type: { type: String, enum: ['hajj', 'omra', 'tourisme'], required: true },
  images: [String],
  details: { type: String },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  placesDisponibles: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', offerSchema); 