const express = require('express');
const router = express.Router();
const { 
  login, 
  register, 
  getMe, 
  updateMe, 
  changePassword, 
  createAdmin 
} = require('../controllers/authController');
const { proteger } = require('../middleware/auth');
const { 
  validateLogin, 
  validateRegister 
} = require('../middleware/validation');

// Routes publiques
router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/create-admin', createAdmin); // À supprimer en production

// Routes protégées
router.get('/me', proteger, getMe);
router.put('/me', proteger, updateMe);
router.put('/change-password', proteger, changePassword);

module.exports = router; 