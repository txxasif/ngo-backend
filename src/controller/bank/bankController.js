const asyncHandler = require("express-async-handler");
const Bank = require("../../model/BankSchema");
const Samity = require("../../model/SamitySchema");
const BankCash = require("../../model/BankCashCash");
const bankCashValidationSchema = require("../../schemaValidation/bankCashSchemaValidation");
const addBankController = asyncHandler(async (req, res) => {
  const body = req.body;
  const { name } = body;
  if (req.body === undefined || req.body === "") {
    return res.status(404).json({ message: "Please Enter Bank Name" });
  }

  const existingBankWithName = await Bank.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  if (existingBankWithName) {
    return res.status(400).json({ message: "Bank with name already exists" });
  }
  const newBank = new Bank(body);
  await newBank.save();
  return res.status(200).json({ message: "Bank Successful Created" });
});

const getAllBankController = asyncHandler(async (req, res) => {
  const allBank = await Bank.find({});
  return res.status(200).json({ data: allBank });
});
const addBankTransactionController = asyncHandler(async (req, res) => {
  const bankCashBody = req.body;
  const { error } = bankCashValidationSchema.validate(bankCashBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { bankId, amount, type } = bankCashBody;
  const selectedBank = await Bank.findOne({
    _id: bankId
  });
  if (type === "cashIn") {

    selectedBank.balance += Number(amount);
  } else {

    selectedBank.balance -= Number(amount);
  }

  const newBankCash = new BankCash(bankCashBody);

  const promiser = await Promise.all([newBankCash.save(), selectedBank.save()]);
  return res.json({ message: "done" });
});
const allBankCashDetailsController = asyncHandler(async (req, res) => {
  const data = await Bank.find({}).lean();
  return res.json({ data: data });
});
const getSpecificDetailsByBankIdController = asyncHandler(async (req, res) => {
  const bankId = req.params.id;
  const data = await BankCash.find({ bankId }).lean();
  return res.json({ data: data });
})

module.exports = {
  addBankController,
  getAllBankController,
  addBankTransactionController,
  allBankCashDetailsController,
  getSpecificDetailsByBankIdController

};
