const mongoose = require('mongoose');

// Schema matches DB image:
// _id (PK), foodId (Ref:food_listings), ngoId (Ref:users),
// restaurantId (Ref:users),
// status ('pending'|'approved'|'rejected'|'completed'),
// requestedAt (Date,auto), updatedAt (Date,auto)
//
// SIDE EFFECT: when request approved → food_listings.status = 'requested'
// (handled in routes/request.js PUT handler)
const pickupRequestSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodListing', required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    requestedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);