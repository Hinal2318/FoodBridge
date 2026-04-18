const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema matches DB image:
// _id (PK), name (String,req), email (String,unique),
// password (String,hashed), role ('restaurant'|'ngo'),
// location (String,city), createdAt (Date,auto)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['restaurant', 'ngo'], required: true },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);