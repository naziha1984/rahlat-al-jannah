const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Destination = require('../models/Destination');
const { proteger, proprietaire } = require('../middleware/auth');
const { validateReservation, validateId } = require('../middleware/validation');

// @desc    Créer une nouvelle réservation
// @route   POST /api/reservations
// @access  Public
const createReservation = async (req, res) => {
  try {
    const {
      destinationId,
      dateDepart,
      dateRetour,
      participants,
      informationsSupplementaires,
      paiement
    } = req.body;

    // Vérifier si la destination existe et est disponible
    const destination = await Destination.findById(destinationId);
    if (!destination || !destination.actif) {
      return res.status(404).json({
        error: 'Destination non trouvée'
      });
    }

    if (!destination.disponibilite) {
      return res.status(400).json({
        error: 'Cette destination n\'est pas disponible'
      });
    }

    // Calculer le prix total
    const prixTotal = destination.prix * participants;

    // Créer la réservation
    const reservation = await Reservation.create({
      userId: req.user ? req.user._id : null,
      destinationId,
      dateDepart,
      dateRetour,
      participants,
      prixTotal,
      devise: destination.devise,
      informationsSupplementaires,
      paiement
    });

    // Populate les informations de la destination
    await reservation.populate('destinationId', 'nom imageUrl');

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir les réservations d'un utilisateur
// @route   GET /api/reservations/user/:userId
// @access  Private
const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reservations = await Reservation.find({ userId })
      .populate('destinationId', 'nom imageUrl prix devise')
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments({ userId });

    res.json({
      success: true,
      count: reservations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      reservations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir une réservation par ID
// @route   GET /api/reservations/:id
// @access  Private
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate('destinationId', 'nom imageUrl prix devise')
      .populate('userId', 'nom email');

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur peut accéder à cette réservation
    if (req.user.role !== 'admin' && reservation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Accès refusé'
      });
    }

    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Annuler une réservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur peut annuler cette réservation
    if (req.user.role !== 'admin' && reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Accès refusé'
      });
    }

    // Vérifier si la réservation peut être annulée
    if (!reservation.peutEtreAnnulee()) {
      return res.status(400).json({
        error: 'Cette réservation ne peut plus être annulée'
      });
    }

    reservation.statut = 'annulee';
    await reservation.save();

    res.json({
      success: true,
      message: 'Réservation annulée avec succès',
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir les statistiques des réservations (admin)
// @route   GET /api/reservations/stats
// @access  Private/Admin
const getReservationStats = async (req, res) => {
  try {
    const stats = await Reservation.getStatistiques();
    
    const totalReservations = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalPrix = stats.reduce((sum, stat) => sum + stat.totalPrix, 0);

    res.json({
      success: true,
      stats: {
        parStatut: stats,
        total: totalReservations,
        totalPrix
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// Routes
router.post('/', validateReservation, createReservation);
router.get('/user/:userId', proteger, proprietaire, getUserReservations);
router.get('/:id', proteger, validateId, getReservationById);
router.put('/:id/cancel', proteger, validateId, cancelReservation);
router.get('/stats', proteger, getReservationStats);

module.exports = router; 