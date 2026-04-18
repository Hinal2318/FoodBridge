const mongoose = require('mongoose');

// Schema matches DB image:
// _id (PK), restaurantId (Ref:users), name (String,req),
// quantity (Number,req), unit ('kg'|'pieces'), expiryTime (Date,req),
// location (String), description (String,opt),
// status ('available'|'requested'|'picked'), createdAt (Date,auto)
const foodListingSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'pieces'], required: true },
    expiryTime: { type: Date, required: true },
    location: { type: String },
    description: { type: String },
    status: { type: String, enum: ['available', 'requested', 'picked'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodListing', foodListingSchema);