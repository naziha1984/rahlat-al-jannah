const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
const proteger = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Token invalide - Utilisateur non trouvé' 
        });
      }

      if (!user.actif) {
        return res.status(401).json({ 
          error: 'Compte désactivé' 
        });
      }

      // Ajouter l'utilisateur à l'objet request
      req.user = user;
      next();
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return res.status(401).json({ 
        error: 'Token invalide' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      error: 'Accès refusé - Token requis' 
    });
  }
};

// Middleware pour vérifier le rôle admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Accès refusé - Droits administrateur requis' 
    });
  }
};

// Middleware pour vérifier si l'utilisateur est propriétaire de la ressource
const proprietaire = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user._id.toString() === req.params.userId)) {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Accès refusé - Vous n\'êtes pas autorisé à accéder à cette ressource' 
    });
  }
};

// Middleware optionnel pour récupérer l'utilisateur si connecté
const optionnel = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.actif) {
        req.user = user;
      }
    } catch (error) {
      // Ignorer les erreurs de token pour les routes optionnelles
    }
  }

  next();
};

// Fonction pour générer un token JWT
const genererToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = {
  proteger,
  admin,
  proprietaire,
  optionnel,
  genererToken
}; 