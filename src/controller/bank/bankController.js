const asyncHandler = require("express-async-handler");
const Bank = require("../../model/BankSchema");
const BankCash = require("../../model/BankCashSchema");
const Samity = require("../../model/SamitySchema");
const bankCashValidationSchema = require("../../schemaValidation/bankCashSchemaValidation");

const addBankController = asyncHandler(async (req, res) => {
  const body = req.body;
  if (req.body === undefined || req.body === "") {
    return res.status(404).json({ message: "Please Enter Bank Number" });
  }
  const newBank = new Bank(body);
  console.log(body);
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
  const newBankCash = new BankCash(bankCashBody);
  await newBankCash.save();
  return res.json({ message: "done" });
});
module.exports = {
  addBankController,
  getAllBankController,
  addBankTransactionController,
};
