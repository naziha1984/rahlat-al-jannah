const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
  searchDestinations,
  getPopularDestinations,
  getCategories,
  getCountries
} = require('../controllers/destinationController');
const { validateSearch, validatePagination, validateId } = require('../middleware/validation');

// Routes publiques
router.get('/', validateSearch, validatePagination, getDestinations);
router.get('/search', validateSearch, searchDestinations);
router.get('/popular', getPopularDestinations);
router.get('/categories', getCategories);
router.get('/countries', getCountries);
router.get('/:id', validateId, getDestinationById);

module.exports = router; 