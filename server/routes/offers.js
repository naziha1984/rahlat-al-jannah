const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

// GET all offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create offer
router.post('/', async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update offer
router.put('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE offer
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 