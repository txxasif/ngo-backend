const asyncHandler = require("express-async-handler");
const LocalUser = require("../../model/LocalUserSchema");
const localUserSchema = require("../../schemaValidation/localUser");

//add brunch controller
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
module.exports = {
  addLocalUserController,
};
