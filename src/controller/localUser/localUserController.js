const asyncHandler = require("express-async-handler");
const LocalUser = require("../../model/LocalUserSchema");
const localUserSchema = require("../../schemaValidation/localUser");
const mongoose = require("mongoose");
const { localUserCashHelper } = require("../../helper/laonDrawerBankCashHelper");

// * add brunch controller
const addLocalUserController = asyncHandler(async (req, res) => {
  const localUserBody = req.body;
  const { error, value } = localUserSchema.validate(localUserBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { openedBy, samityId, membershipFee, formFee, openingDate } = localUserBody;



  const checkPhoneNumber = await LocalUser.findOne({
    mobileNumber: localUserBody.mobileNumber,
  });

  if (checkPhoneNumber) {
    return res.status(400).json({ message: "Phone number is already in use." });
  }
  const amount = Number(membershipFee) + Number(formFee);

  const newLocalUser = new LocalUser(localUserBody);
  await Promise.all([newLocalUser.save(), localUserCashHelper(samityId, openedBy, amount, openingDate)])

  return res.json({ message: "User Create Successfully" }).status(200);
});
// * get user by phone number
const getUserByPhoneNumberController = asyncHandler(async (req, res) => {
  const phoneNumber = req.params.id;
  const user = await LocalUser.aggregate([
    {
      $match: {
        mobileNumber: phoneNumber,
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branchId",
        foreignField: "_id",
        as: "branch",
      },
    },
    {
      $lookup: {
        from: "samities",
        localField: "samityId",
        foreignField: "_id",
        as: "samity",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        fromAdmin: 1,
        branchId: 1,
        samityId: 1,
        fathersName: 1,
        mothersName: 1,
        spouseName: 1,
        occupation: 1,
        occupationBrief: 1,
        presentAddress: 1,
        permanentAddress: 1,
        educationalQualification: 1,
        dateOfBirth: 1,
        nidNumber: 1,
        mobileNumber: 1,
        emergencyContactNumber: 1,
        religion: 1,
        membershipFee: 1,
        photo: 1,
        status: 1,
        nominee: 1,
        branchName: { $arrayElemAt: ["$branch.branchName", 0] },
        samityName: { $arrayElemAt: ["$samity.samityName", 0] },

        branchId: { $arrayElemAt: ["$branch._id", 0] },
        samityId: { $arrayElemAt: ["$samity._id", 0] },
      },
    },
  ]);
  return res.send({ data: user });
});
// * get users by branch and samity id
const getUsersByBranchAndSamityId = asyncHandler(async (req, res) => {
  const branchId = req.query.branchId;
  const samityId = req.query.samityId;
  const users = await LocalUser.find({ branchId, samityId });
  res.send({ data: users });
});
// get user by id
const getUserByIdController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await LocalUser.findOne({ _id: id });
  res.json({ data: user });
});
const updateUserDetailsController = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await LocalUser.findByIdAndUpdate(
      { _id: id },
      { $set: { ...body } }
    );

    return res.json({ message: "User updated" });
  } catch (error) {
    return res.json({ message: "Something went wrong" }).status(400);
  }
});

// local user pending list
const localUserPendingListController = asyncHandler(async (req, res) => {
  console.log('hit')
  const users = await LocalUser.aggregate([{
    $match: { status: "pending" }
  }, {
    $lookup: {
      from: "branches",
      localField: "branchId",
      foreignField: "_id",
      as: "branch",
    },

  }, {
    $lookup: {
      from: "samities",
      localField: "samityId",
      foreignField: "_id",
      as: "samity",
    },
  },
  {
    $unwind: "$branch"
  }, {
    $unwind: "$samity"
  },
  {
    $project: {
      _id: 1,
      name: 1,
      branchName: "$branch.branchName",
      samityName: "$samity.samityName",
      mobileNumber: 1
    },
  }])
  console.log(users, '--------');
  res.json({ data: users });
});

const acceptUserRequestController = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const { status } = req.query;
  const id = new mongoose.Types.ObjectId(_id)
  console.log(id, _id, status);

  try {
    if (status === "rejected") {
      try {
        await LocalUser.findByIdAndDelete({ _id: id });
        return res.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting user" });
      }
    } else {


      await LocalUser.findByIdAndUpdate(
        { _id: id },
        { $set: { status: 'accepted' } }
      );
      return res.json({ message: "User accepted successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user" });
  }
});

module.exports = {
  addLocalUserController,
  getUserByPhoneNumberController,
  getUsersByBranchAndSamityId,
  getUserByIdController,
  updateUserDetailsController,
  localUserPendingListController,
  acceptUserRequestController
};
