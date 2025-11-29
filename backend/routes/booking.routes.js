const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// Middleware to ensure user is authenticated
const ensureAuth = (req, res, next) => (req.isAuthenticated() ? next() : res.status(401).json({ message: 'Unauthorized' }));

router.post('/', ensureAuth, bookingController.createBookingRequest);

module.exports = router;