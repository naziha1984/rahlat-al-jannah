const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { proteger, proprietaire } = require('../middleware/auth');
const { validateId } = require('../middleware/validation');

// @desc    Obtenir le profil d'un utilisateur
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate({
        path: 'reservations',
        select: 'destinationId dateDepart dateRetour statut prixTotal',
        populate: {
          path: 'destinationId',
          select: 'nom imageUrl'
        }
      });

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Mettre à jour le profil d'un utilisateur
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email } = req.body;

    const fieldsToUpdate = {};
    if (nom) fieldsToUpdate.nom = nom;
    if (email) fieldsToUpdate.email = email;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: 'Cet email est déjà utilisé par un autre utilisateur'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Désactiver un compte utilisateur
// @route   PUT /api/users/:id/deactivate
// @access  Private
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { actif: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Compte désactivé avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la désactivation du compte:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Réactiver un compte utilisateur
// @route   PUT /api/users/:id/activate
// @access  Private
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { actif: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Compte réactivé avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la réactivation du compte:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// Routes
router.get('/:id', proteger, proprietaire, validateId, getUserById);
router.put('/:id', proteger, proprietaire, validateId, updateUser);
router.put('/:id/deactivate', proteger, proprietaire, validateId, deactivateUser);
router.put('/:id/activate', proteger, proprietaire, validateId, activateUser);

module.exports = router; 