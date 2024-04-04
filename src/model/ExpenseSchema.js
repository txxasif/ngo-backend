const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  expenseName:{
    type: String,
  },
  description:{
    type: String,
  },
  unitAmount:{
    type: Number,
  },
  unitPrice:{
    type: Number,
  },
  TDS:{
    type: Number,

  },
  TAX:{
    type: Number,
  },
  VAT:{
    type: Number,
  },
  status:{
    type: String,
    enum : ['Paid','Unpaid'],
    required: true,
  },
  remarks:{
    type: String,
  }
},{ timestamps: true });

const expenseSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  samityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Samity",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  officeRent:{
    type:Number,
    required:true
  },
  salary:{
    type:Number,
    required:true
  },
  stationaryAndPrinting:{
    type:Number,
    required:true
  },
  TaDaAllowance:{
    type:Number,
    required:true
  },
  anyBill:{
    type:Number,
    required:true
  },
  remarks:{
    type: String,
  },
  purchase : [purchaseSchema],
},{timestamps: true,});

const Expense = mongoose.models.Expense || mongoose.model("Expense",expenseSchema);
const Purchase = mongoose.models.Purchase || mongoose.model("Purchase",purchaseSchema);
module.exports = { Expense, Purchase };
// const DepositAccount =
//   mongoose.models.DepositAccount ||
//   mongoose.model("DepositAccount", depositAccountSchema);

