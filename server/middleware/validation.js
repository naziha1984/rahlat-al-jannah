const { body, param, query, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validation pour l'authentification
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Veuillez entrer un email valide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  handleValidationErrors
];

// Validation pour l'inscription utilisateur
const validateRegister = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .isEmail()
    .withMessage('Veuillez entrer un email valide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  handleValidationErrors
];

// Validation pour les destinations
const validateDestination = [
  body('nom.fr')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom en français doit contenir entre 2 et 100 caractères'),
  body('nom.en')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom en anglais doit contenir entre 2 et 100 caractères'),
  body('nom.ar')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom en arabe doit contenir entre 2 et 100 caractères'),
  body('description.fr')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La description en français doit contenir entre 10 et 2000 caractères'),
  body('description.en')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La description en anglais doit contenir entre 10 et 2000 caractères'),
  body('description.ar')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La description en arabe doit contenir entre 10 et 2000 caractères'),
  body('prix')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('duree')
    .isInt({ min: 1 })
    .withMessage('La durée doit être d\'au moins 1 jour'),
  body('categorie')
    .isIn(['plage', 'montagne', 'ville', 'campagne', 'désert', 'culturel', 'aventure'])
    .withMessage('Catégorie invalide'),
  body('pays')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le pays doit contenir entre 2 et 50 caractères'),
  body('ville')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La ville doit contenir entre 2 et 50 caractères'),
  body('imageUrl')
    .isURL()
    .withMessage('L\'URL de l\'image doit être valide'),
  handleValidationErrors
];

// Validation pour les réservations
const validateReservation = [
  body('destinationId')
    .isMongoId()
    .withMessage('ID de destination invalide'),
  body('dateDepart')
    .isISO8601()
    .withMessage('Date de départ invalide')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('La date de départ doit être dans le futur');
      }
      return true;
    }),
  body('dateRetour')
    .isISO8601()
    .withMessage('Date de retour invalide')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.dateDepart)) {
        throw new Error('La date de retour doit être après la date de départ');
      }
      return true;
    }),
  body('participants')
    .isInt({ min: 1, max: 20 })
    .withMessage('Le nombre de participants doit être entre 1 et 20'),
  body('informationsSupplementaires.nomComplet')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom complet doit contenir entre 2 et 100 caractères'),
  body('informationsSupplementaires.email')
    .isEmail()
    .withMessage('Veuillez entrer un email valide')
    .normalizeEmail(),
  body('informationsSupplementaires.telephone')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Le numéro de téléphone doit contenir entre 10 et 20 caractères'),
  body('paiement.methode')
    .isIn(['carte', 'virement', 'especes', 'cheque'])
    .withMessage('Méthode de paiement invalide'),
  handleValidationErrors
];

// Validation pour les paramètres d'ID
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  handleValidationErrors
];

// Validation pour les requêtes de recherche
const validateSearch = [
  query('pays')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le pays doit contenir entre 2 et 50 caractères'),
  query('categorie')
    .optional()
    .isIn(['plage', 'montagne', 'ville', 'campagne', 'désert', 'culturel', 'aventure'])
    .withMessage('Catégorie invalide'),
  query('prixMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix minimum doit être un nombre positif'),
  query('prixMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix maximum doit être un nombre positif'),
  query('disponibilite')
    .optional()
    .isBoolean()
    .withMessage('La disponibilité doit être un booléen'),
  handleValidationErrors
];

// Validation pour la pagination
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateRegister,
  validateDestination,
  validateReservation,
  validateId,
  validateSearch,
  validatePagination
}; 