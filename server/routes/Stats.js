const express = require('express');
const router = express.Router();
const FoodListing = require('../models/FoodListing');
const PickupRequest = require('../models/PickupRequest');
const { authenticate } = require('../middleware/auth');

// GET /api/stats — Role-aware: returns different counts for restaurant vs ngo
// NGO stats used by NGO Dashboard (P6):
//   availableFood (blue card), pickupRequestsSent (purple card),
//   completedPickups (green card), recentDonations (last 3 completed)
router.get('/', authenticate, async (req, res) => {
    try {
        if (req.user.role === 'ngo') {
            const [availableFood, pickupRequestsSent, completedPickups, recentDonations] = await Promise.all([
                FoodListing.countDocuments({ status: 'available' }),
                PickupRequest.countDocuments({ ngoId: req.user._id }),
                PickupRequest.countDocuments({ ngoId: req.user._id, status: 'completed' }),
                PickupRequest.find({ ngoId: req.user._id, status: 'completed' })
                    .populate('foodId', 'name')
                    .populate('restaurantId', 'name location')
                    .sort({ updatedAt: -1 })
                    .limit(3)           // GET /api/request/ngo?limit=3 (dashboard section)
            ]);

            return res.json({ availableFood, pickupRequestsSent, completedPickups, recentDonations });
        }

        if (req.user.role === 'restaurant') {
            const [totalListings, activeListings, pendingRequests, completedPickups] = await Promise.all([
                FoodListing.countDocuments({ restaurantId: req.user._id }),
                FoodListing.countDocuments({ restaurantId: req.user._id, status: 'available' }),
                PickupRequest.countDocuments({ restaurantId: req.user._id, status: 'pending' }),
                PickupRequest.countDocuments({ restaurantId: req.user._id, status: 'completed' })
            ]);

            return res.json({ totalListings, activeListings, pendingRequests, completedPickups });
        }

        res.status(400).json({ message: 'Unknown role' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;