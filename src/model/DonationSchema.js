const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
    by: {
        name: { type: String },
        phone: { type: String },
        type: { type: String }
    },
    from: {
        type: String,
        required: true
    },

    date: { type: Date },
    amount: { type: Number, required: true }
});
const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
