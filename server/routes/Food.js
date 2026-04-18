const express = require('express');
const router = express.Router();
const FoodListing = require('../models/FoodListing');
const { authenticate, requireRole } = require('../middleware/auth');

// POST /api/food — Role: restaurant — create food listing
router.post('/', authenticate, requireRole('restaurant'), async (req, res) => {
    try {
        const { name, quantity, unit, expiryTime, location, description } = req.body;
        const food = await FoodListing.create({
            restaurantId: req.user._id,
            name,
            quantity,
            unit,
            expiryTime,
            location: location || req.user.location,
            description
        });
        res.status(201).json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/food — Role: restaurant — get own food listings
router.get('/', authenticate, requireRole('restaurant'), async (req, res) => {
    try {
        const food = await FoodListing.find({ restaurantId: req.user._id }).sort({ createdAt: -1 });
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/food/available — Role: ngo — all status=available food
// Query: ?city=Ahmedabad (optional filter)
// Uses .populate('restaurantId','name location') so NGO sees restaurant details without extra calls
router.get('/available', authenticate, requireRole('ngo'), async (req, res) => {
    try {
        const filter = { status: 'available' };
        if (req.query.city) filter.location = new RegExp(req.query.city, 'i');

        const food = await FoodListing.find(filter)
            .populate('restaurantId', 'name location')
            .sort({ expiryTime: 1 }); // soonest expiry first
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/food/:id — Role: restaurant — only if status=available
router.delete('/:id', authenticate, requireRole('restaurant'), async (req, res) => {
    try {
        const food = await FoodListing.findOne({ _id: req.params.id, restaurantId: req.user._id });
        if (!food) return res.status(404).json({ message: 'Food not found' });
        if (food.status !== 'available') return res.status(400).json({ message: 'Cannot delete — already requested' });
        await food.deleteOne();
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;