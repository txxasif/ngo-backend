const asyncHandler = require("express-async-handler");
const Donation = require("../../model/DonationSchema");
const { donationReceiverCashHelper } = require("../../helper/laonDrawerBankCashHelper");
const createDonationController = asyncHandler(async (req, res) => {
    const { payFrom, ...donationData } = req.body;
    try {
        const newDonation = new Donation(donationData);
        await Promise.all([
            newDonation.save(),
            donationReceiverCashHelper(payFrom, donationData.by, donationData.amount, donationData.date)
        ]);
        res.json({ message: "done" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
});
module.exports = { createDonationController }