const User = require('../models/User');
const { genererToken } = require('../middleware/auth');

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email).select('+password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.actif) {
      return res.status(401).json({
        error: 'Compte désactivé'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    user.derniereConnexion = new Date();
    await user.save();

    // Générer le token
    const token = genererToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findByEmail(email);
    
    if (userExists) {
      return res.status(400).json({
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      nom,
      email,
      password
    });

    // Générer le token
    const token = genererToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'reservations',
        select: 'destinationId dateDepart dateRetour statut prixTotal',
        populate: {
          path: 'destinationId',
          select: 'nom imageUrl'
        }
      });

    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res) => {
  try {
    const { nom, email } = req.body;
    const fieldsToUpdate = {};

    if (nom) fieldsToUpdate.nom = nom;
    if (email) fieldsToUpdate.email = email;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: 'Cet email est déjà utilisé par un autre utilisateur'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select('+password');

    // Vérifier l'ancien mot de passe
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        error: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

// @desc    Créer un compte administrateur par défaut
// @route   POST /api/auth/create-admin
// @access  Public (à supprimer en production)
const createAdmin = async (req, res) => {
  try {
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({
        error: 'Un administrateur existe déjà'
      });
    }

    // Créer l'administrateur par défaut
    const admin = await User.create({
      nom: 'Administrateur',
      email: 'admin@paradis.com',
      password: 'admin123',
      role: 'admin'
    });

    const token = genererToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Administrateur créé avec succès',
      token,
      user: admin.toPublicJSON()
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  login,
  register,
  getMe,
  updateMe,
  changePassword,
  createAdmin
}; 