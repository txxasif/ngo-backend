const moment = require("moment");
const generateTransactions = (fdrBody, loanId) => {
  const transactions = [];
  const {
    periodOfTimeInMonths,
    openingDate,
    paymentTerm,
    profitPerInstallment,
  } = fdrBody;
  let startDate = moment(openingDate);
  let incrementMonths = 0;

  switch (paymentTerm) {
    case "At a Time":
      incrementMonths = periodOfTimeInMonths;
      break;
    case "Monthly":
      incrementMonths = 1;
      break;
    case "Quarterly":
      incrementMonths = 3; // Quarterly means every 3 months
      break;
    case "Half-Yearly":
      incrementMonths = 6;
      break;
    case "Yearly":
      incrementMonths = 12;
      break;
    default:
      break;
  }

  for (let i = 1; i <= Math.ceil(periodOfTimeInMonths / incrementMonths); i++) {
    transactions.push({
      accountId: loanId,
      amount: profitPerInstallment,
      date: startDate
        .clone()
        .add(i * incrementMonths, "months")
        .toISOString(),
      status: "unpaid",
    });
  }

  return transactions;
};

module.exports = { generateTransactions };
