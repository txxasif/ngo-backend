const asyncHandler = require("express-async-handler");
const {
  depositAccountSchema,
} = require("../../schemaValidation/depositAccount");
const {
  DepositAccount,
  Withdraw,
  Transaction,
} = require("../../model/DepositAccountSchema");
const LocalUser = require("../../model/LocalUserSchema");
const mongoose = require("mongoose");

// * create deposit account

const createDepositAccountController = asyncHandler(async (req, res) => {
  const depositBody = req.body;
  const { error } = depositAccountSchema.validate(depositBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { memberId } = depositBody;
  const isAlreadyExist = await DepositAccount.findOne({ memberId: memberId });
  if (isAlreadyExist) {
    return res.status(404).json({ message: "Deposit account already exists" });
  }
  const newDepositAccount = await DepositAccount.create(depositBody);
  if (!newDepositAccount) {
    return res.status(404).json({ message: "Something Went Wrong" });
  }
  return res
    .status(200)
    .json({ message: "Deposit account created successfully" });
});
const getPendingDepositAccountList = asyncHandler(async (req, res) => {
  const { samityId, branchId } = req.query;
  const depositAccountList = await DepositAccount.aggregate([
    {
      $match: {
        samityId: new mongoose.Types.ObjectId(samityId),
        branchId: new mongoose.Types.ObjectId(branchId),
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "localusers",
        localField: "memberId",
        foreignField: "_id",
        as: "member",
      },
    }, {
      $unwind: "$member"
    },
    {
      $lookup: {
        from: "branches",
        localField: "branchId",
        foreignField: "_id",
        as: "branch"
      }
    },
    {
      $unwind: "$branch"
    },
    {
      $lookup: {
        from: "samities",
        localField: "samityId",
        foreignField: "_id",
        as: "samity"
      }
    },
    {
      $unwind: "$samity"
    },

    {
      $project: {
        _id: 1,
        phoneNumber: "$member.mobileNumber",
        name: "$member.name",
        branchName: "$branch.branchName",
        samityName: "$samity.samityName",
        paymentTerm: 1,
        profitPercentage: 1,
        onMatureAmount: 1,
      },
    },
  ])
  return res.json({ data: depositAccountList })
})
const acceptPendingDepositList = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const id = new mongoose.Types.ObjectId(_id);
  const { status } = req.query;
  const check = status === 'approved' || 'closed' || 'rejected' ? true : false;
  if (!check) {
    return res.json({ message: "Status type isn't valid" }).status(404);
  }
  try {
    if (status === "rejected") {
      try {
        await DepositAccount.findByIdAndDelete({ _id: id });
        return res.json({ message: "Saving Account Rejected." });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error rejecting Saving Account" });
      }
    } else {
      await DepositAccount.findByIdAndUpdate(
        { _id: id },
        { $set: { status: status } }
      );
      return res.json({ message: "Saving Account Approved." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating saving Account." });
  }

})
// * search deposit account
const searchDepositAccountController = asyncHandler(async (req, res) => {
  const phone = req.params.id;
  const user = await LocalUser.findOne({ mobileNumber: phone })
    .select("_id name")
    .lean();
  if (!user) {
    return res.status(404).json({ message: "No user data available" });
  }
  const isDepositAccount = await DepositAccount.findOne({
    memberId: user._id,
  }).lean();
  if (!isDepositAccount) {
    return res.status(404).json({ message: "No Deposit Account Available" });
  }
  delete isDepositAccount._id;
  const finalResponse = { ...user, ...isDepositAccount };
  return res.status(200).json({ data: [finalResponse] });
});
const makeDepositController = asyncHandler(async (req, res) => {
  const { date, amount, description, id } = req.body;
  if (!date || !amount || !description || !id) {
    return res.status(404).json({ message: "All Fields are Required" });
  }
  const depositAccount = await DepositAccount.findOne({ _id: id });
  if (!depositAccount) {
    return res.status(404).json({ error: "Deposit account not found" });
  }
  depositAccount.balance += Number(amount);
  const transaction = new Transaction({ accountId: id, date, amount, description });
  await transaction.save();
  await depositAccount.save();
  return res.status(200).json({ message: "Deposit money saved successfully" });
});

// * withdrawAccount
const withdrawController = asyncHandler(async (req, res) => {
  const { id, amount, date, description } = req.body;

  // Validate memberId and amount
  if (!id || !amount || isNaN(amount) || amount <= 0 || !date) {
    return res.status(400).json({ message: "Invalid memberId or amount" });
  }

  // Find the deposit account by memberId
  let depositAccount = await DepositAccount.findOne({ _id: id });

  if (!depositAccount) {
    return res.status(404).json({ message: "Deposit account not found" });
  }

  // Ensure sufficient balance for withdrawal
  if (amount > depositAccount.balance) {
    return res
      .status(400)
      .json({ message: "Insufficient balance for withdrawal" });
  }

  // Update balance
  depositAccount.balance -= Number(amount);

  // Create a new withdrawal
  const withdrawal = new Withdraw({
    accountId: id,
    date,
    description: description,
    amount,
  });

  // Add the withdrawal to deposit account
  await withdrawal.save();

  // Save the updated deposit account
  await depositAccount.save();

  // Return success response
  return res
    .status(200)
    .json({ message: "Withdrawal successful", depositAccount });
});

const depositAccountListByBrachAndSamityController = asyncHandler(
  async (req, res) => {
    const { branchId, samityId } = req.query;

    const data = await DepositAccount.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchId),
          samityId: new mongoose.Types.ObjectId(samityId),
        },
      },
      {
        $lookup: {
          from: "localusers",
          localField: "memberId",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      {
        $unwind: "$memberDetails",
      },
      {
        $project: {
          _id: 1,
          memberId: 1,
          branchId: 1,
          samityId: 1,
          paymentTerm: 1,
          periodOfTimeInMonths: 1,
          perInstallment: 1,
          profitPercentage: 1,
          onMatureAmount: 1,
          openingDate: 1,
          matureDate: 1,
          transactions: 1,
          withdraws: 1,
          balance: 1,
          isOpen: 1,
          "memberDetails.name": 1,
          "memberDetails.mobileNumber": 1,
        },
      },
    ]);
    return res.json({ data });
  }
);
const depositAccountListsByPhoneNumber = asyncHandler(async (req, res) => {
  const phone = req.params.id;
  const pipeline = [
    {
      $match: { mobileNumber: phone }, // Filter by mobile number
    },
    {
      $lookup: {
        from: "samities", // Local field to join on
        localField: "samityId",
        foreignField: "_id", // Foreign field to join on
        as: "samityDetails", // Alias for joined data
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branchId",
        foreignField: "_id",
        as: "branchDetails",
      },
    },
    {
      $unwind: "$samityDetails", // Unwind single document array from lookup
    },
    {
      $unwind: "$branchDetails", // Unwind single document array from lookup
    },
    {
      $project: {
        _id: 1,
        name: 1,
        photo: 1,
        samityName: "$samityDetails.samityName", // Access nested data
        branchName: "$branchDetails.branchName", // Access nested data
      },
    },
  ];
  const user = await LocalUser.aggregate(pipeline);
  if (!user.length) {
    console.log("erro");
    return res.status(404).json({ message: "No user data available" });
  }
  const isDepositAccount = await DepositAccount.find({
    memberId: user[0]._id,
  })
    .select(
      "paymentTerm onMatureAmount openingDate matureDate balance paid"
    )
    .lean();
  if (!isDepositAccount) {
    return res.status(404).json({ message: "No Loan Account Available" });
  }
  const finalResponse = { userDetails: user[0], depositAccounts: isDepositAccount };

  res.json({ data: finalResponse })
})
const getSpecificDetailsForDepositAccountController = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const id = new mongoose.Types.ObjectId(_id);
  const data = await DepositAccount.aggregate([
    {
      $match: {
        _id: id
      }
    },
    {
      $lookup: {
        from: "localusers",
        localField: "memberId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        memberId: 1,
        paymentTerm: 1,
        periodOfTimeInMonths: 1,
        perInstallment: 1,
        profitPercentage: 1,
        onMatureAmount: 1,
        openingDate: 1,
        matureDate: 1,
        balance: 1,
        status: 1,
        memberDetails: {
          name: "$user.name",
          mobileNumber: "$user.mobileNumber"
        }
      }
    }
  ])
  return res.json({ data })
})
const transactionDetailsController = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const id = new mongoose.Types.ObjectId(_id);
  const data = await Transaction.aggregate([{
    $match: {
      accountId: id
    }
  }, {
    $sort: {
      date: -1
    }
  }])
  return res.json({ data })
})
const withdrawDetailsController = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const id = new mongoose.Types.ObjectId(_id);
  const data = await Withdraw.aggregate([{
    $match: {
      accountId: id
    }
  }, {
    $sort: {
      date: -1
    }
  }])
  console.log(data);
  return res.json({ data })
})
module.exports = {
  createDepositAccountController,
  makeDepositController,
  searchDepositAccountController,
  withdrawController,
  depositAccountListByBrachAndSamityController,
  getPendingDepositAccountList, acceptPendingDepositList,
  depositAccountListsByPhoneNumber,
  getSpecificDetailsForDepositAccountController
  , transactionDetailsController
  , withdrawDetailsController
};
