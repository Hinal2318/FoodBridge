const express = require('express');
const router = express.Router();
const PickupRequest = require('../models/PickupRequest');
const FoodListing = require('../models/FoodListing');
const { authenticate, requireRole } = require('../middleware/auth');

// POST /api/request — Role: ngo — create pickup request with foodId
router.post('/', authenticate, requireRole('ngo'), async (req, res) => {
    try {
        const { foodId } = req.body;

        const food = await FoodListing.findById(foodId);
        if (!food) return res.status(404).json({ message: 'Food listing not found' });
        if (food.status !== 'available') return res.status(400).json({ message: 'Food is no longer available' });

        // Prevent duplicate requests from same NGO
        const exists = await PickupRequest.findOne({ foodId, ngoId: req.user._id });
        if (exists) return res.status(400).json({ message: 'You already requested this food' });

        const request = await PickupRequest.create({
            foodId,
            ngoId: req.user._id,
            restaurantId: food.restaurantId
        });

        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/request/ngo — Role: ngo — requests made by this NGO
// Data from GET /api/request/ngo (as per image)
router.get('/ngo', authenticate, requireRole('ngo'), async (req, res) => {
    try {
        const requests = await PickupRequest.find({ ngoId: req.user._id })
            .populate('foodId', 'name quantity unit location')
            .populate('restaurantId', 'name location')
            .sort({ requestedAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/request/restaurant — Role: restaurant — requests on own food
router.get('/restaurant', authenticate, requireRole('restaurant'), async (req, res) => {
    try {
        const requests = await PickupRequest.find({ restaurantId: req.user._id })
            .populate('foodId', 'name quantity unit location')
            .populate('ngoId', 'name location')
            .sort({ requestedAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/request/:id — Role: restaurant — approve/reject
// Body: { status } → 'approved' | 'rejected' | 'completed'
// SIDE EFFECT: approved → food.status = 'requested' (status sync from image)
router.put('/:id', authenticate, requireRole('restaurant'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'completed'].includes(status))
            return res.status(400).json({ message: 'Invalid status' });

        const request = await PickupRequest.findOne({ _id: req.params.id, restaurantId: req.user._id });
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        request.updatedAt = new Date();
        await request.save();

        // Status sync — keep food_listings in sync with pickup_requests
        if (status === 'approved') await FoodListing.findByIdAndUpdate(request.foodId, { status: 'requested' });
        if (status === 'completed') await FoodListing.findByIdAndUpdate(request.foodId, { status: 'picked' });

        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;