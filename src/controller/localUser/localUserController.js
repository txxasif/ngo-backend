const asyncHandler = require("express-async-handler");
const LocalUser = require("../../model/LocalUserSchema");
const localUserSchema = require("../../schemaValidation/localUser");

// * add brunch controller
const addLocalUserController = asyncHandler(async (req, res) => {
  const localUserBody = req.body;
  const { error, value } = localUserSchema.validate(localUserBody);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const checkPhoneNumber = await LocalUser.findOne({
    phoneNumber: localUserBody.phoneNumber,
  });
  if (checkPhoneNumber) {
    return res.status(400).json({ message: "Phone number is already in use." });
  }
  const newLocalUser = new LocalUser(localUserBody);
  await newLocalUser.save();
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
      },
    },
  ]);
  return res.send({ data: user });
});
// * get users by branch and samity id
const getUsersByBranchAndSamityId = asyncHandler(async (req, res) => {
  const branchId = req.query.branch;
  const samityId = req.query.samity;
  const users = await LocalUser.find({ branchId, samityId });
  res.send({ data: users });
});
module.exports = {
  addLocalUserController,
  getUserByPhoneNumberController,
  getUsersByBranchAndSamityId,
};
