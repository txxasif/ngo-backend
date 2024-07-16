const asyncHandler = require("express-async-handler");
const Bank = require("../../model/BankSchema");
const Samity = require("../../model/SamitySchema");
const BankCash = require("../../model/BankCashCash");
const bankCashValidationSchema = require("../../schemaValidation/bankCashSchemaValidation");
const DrawerCash = require("../../model/DrawerCashSchema");
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
const transferMoneyController = asyncHandler(async (req, res) => {
  const body = req.body;
  const { type, branchId, samityId, bankId, amount, date, by } = body;
  if (type === "dTob") {
    const samity = await Samity.findOne({ _id: samityId });
    const bank = await Bank.findOne({ _id: bankId });
    samity.drawerCash -= Number(amount);
    bank.balance += Number(amount);

    const drawerCashBody = {
      amount: Number(amount),
      branchId: branchId,
      samityId: samityId,
      type: 'cashOut',
      transactionDetails: {
        date: date,
        sourceDetails: `Transfer To Bank`,
        by: by
      }
    };
    const newDrawerCash = new DrawerCash(drawerCashBody);

    const bankCashBody = {
      amount: Number(amount),
      bankId: bankId,
      type: 'cashIn',
      transactionDetails: {
        date: date,
        sourceDetails: `Transfer From Drawer`,
        by: by
      }
    };
    const newBankCash = new BankCash(bankCashBody);

    await Promise.all([samity.save(), bank.save(), newDrawerCash.save(), newBankCash.save()]);

  } else if (type === "bTod") {
    const samity = await Samity.findOne({ _id: samityId });
    const bank = await Bank.findOne({ _id: bankId });
    bank.balance -= Number(amount);
    samity.drawerCash += Number(amount);

    const drawerCashBody = {
      amount: Number(amount),
      branchId: branchId,
      samityId: samityId,
      type: 'cashIn',
      transactionDetails: {
        date: date,
        sourceDetails: `Transfer From Bank`,
        by: by
      }
    };
    const newDrawerCash = new DrawerCash(drawerCashBody);

    const bankCashBody = {
      amount: Number(amount),
      bankId: bankId,
      type: 'cashOut',
      transactionDetails: {
        date: date,
        sourceDetails: `Transfer To Samity`,
        by: by
      }
    };
    const newBankCash = new BankCash(bankCashBody);

    await Promise.all([samity.save(), bank.save(), newDrawerCash.save(), newBankCash.save()]);
  }

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
  transferMoneyController,
  addBankTransactionController,
  allBankCashDetailsController,
  getSpecificDetailsByBankIdController

};
