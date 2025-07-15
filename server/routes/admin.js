const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { proteger, admin } = require('../middleware/auth');
const { validateDestination, validateId } = require('../middleware/validation');

// @desc    Créer une nouvelle destination
// @route   POST /api/admin/destinations
// @access  Private/Admin
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Destination créée avec succès',
      destination
    });
  } catch (error) {
    console.error('Erreur lors de la création de la destination:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Mettre à jour une destination
// @route   PUT /api/admin/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        error: 'Destination non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Destination mise à jour avec succès',
      destination
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la destination:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Supprimer une destination
// @route   DELETE /api/admin/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des réservations pour cette destination
    const reservations = await Reservation.find({ destinationId: id });
    if (reservations.length > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer cette destination car elle a des réservations associées'
      });
    }

    const destination = await Destination.findByIdAndDelete(id);

    if (!destination) {
      return res.status(404).json({
        error: 'Destination non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Destination supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la destination:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir toutes les destinations (admin)
// @route   GET /api/admin/destinations
// @access  Private/Admin
const getAllDestinations = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const destinations = await Destination.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Destination.countDocuments();

    res.json({
      success: true,
      count: destinations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      destinations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des destinations:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir toutes les réservations (admin)
// @route   GET /api/admin/reservations
// @access  Private/Admin
const getAllReservations = async (req, res) => {
  try {
    const { page = 1, limit = 20, statut } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (statut) query.statut = statut;

    const reservations = await Reservation.find(query)
      .populate('destinationId', 'nom imageUrl')
      .populate('userId', 'nom email')
      .sort({ dateCreation: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(query);

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

// @desc    Mettre à jour le statut d'une réservation (admin)
// @route   PUT /api/admin/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { statut },
      { new: true, runValidators: true }
    ).populate('destinationId', 'nom imageUrl')
     .populate('userId', 'nom email');

    if (!reservation) {
      return res.status(404).json({
        error: 'Réservation non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut de la réservation mis à jour avec succès',
      reservation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir les statistiques du dashboard (admin)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Statistiques des destinations
    const totalDestinations = await Destination.countDocuments();
    const destinationsDisponibles = await Destination.countDocuments({ disponibilite: true });
    const destinationsActives = await Destination.countDocuments({ actif: true });

    // Statistiques des réservations
    const totalReservations = await Reservation.countDocuments();
    const reservationsEnAttente = await Reservation.countDocuments({ statut: 'en_attente' });
    const reservationsConfirmees = await Reservation.countDocuments({ statut: 'confirmee' });
    const reservationsAnnulees = await Reservation.countDocuments({ statut: 'annulee' });

    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const usersActifs = await User.countDocuments({ actif: true });

    // Revenus totaux
    const revenusStats = await Reservation.aggregate([
      {
        $group: {
          _id: null,
          totalRevenus: { $sum: '$prixTotal' },
          revenusConfirmees: {
            $sum: {
              $cond: [{ $eq: ['$statut', 'confirmee'] }, '$prixTotal', 0]
            }
          }
        }
      }
    ]);

    const revenus = revenusStats[0] || { totalRevenus: 0, revenusConfirmees: 0 };

    // Destinations populaires
    const destinationsPopulaires = await Destination.find()
      .sort({ popularite: -1 })
      .limit(5)
      .select('nom imageUrl popularite');

    // Réservations récentes
    const reservationsRecentes = await Reservation.find()
      .populate('destinationId', 'nom imageUrl')
      .populate('userId', 'nom email')
      .sort({ dateCreation: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        destinations: {
          total: totalDestinations,
          disponibles: destinationsDisponibles,
          actives: destinationsActives
        },
        reservations: {
          total: totalReservations,
          enAttente: reservationsEnAttente,
          confirmees: reservationsConfirmees,
          annulees: reservationsAnnulees
        },
        utilisateurs: {
          total: totalUsers,
          actifs: usersActifs
        },
        revenus: {
          total: revenus.totalRevenus,
          confirmees: revenus.revenusConfirmees
        }
      },
      destinationsPopulaires,
      reservationsRecentes
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// Routes
router.use(proteger, admin); // Protéger toutes les routes admin

// Routes des destinations
router.post('/destinations', validateDestination, createDestination);
router.put('/destinations/:id', validateId, validateDestination, updateDestination);
router.delete('/destinations/:id', validateId, deleteDestination);
router.get('/destinations', getAllDestinations);

// Routes des réservations
router.get('/reservations', getAllReservations);
router.put('/reservations/:id/status', validateId, updateReservationStatus);

// Dashboard
router.get('/dashboard', getDashboardStats);

module.exports = router; 