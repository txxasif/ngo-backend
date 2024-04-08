const asyncHandler = require("express-async-handler");
const employeeSchemaValidation = require("../../schemaValidation/EmployeeValidationSchema");
const Employee = require("../../model/EmployeeSchema");
const bcrypt = require("bcrypt");

const createEmployeeController = asyncHandler(async (req, res) => {
  const employeeBody = req.body;
  console.log(employeeBody);
  const { error } = employeeSchemaValidation.validate(employeeBody);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const employee = new Employee(employeeBody);
  await employee.save();
  res.json({ message: "Done" });
});

const searchEmployeeController = asyncHandler(async (req, res) => {
  const number = req.params.id;
  const employee = await Employee.findOne({ mobileNumber: number });
  if (!employee) {
    return res.status(404).json({ message: "No employee found" });
  }
  return res.json({ data: [employee] });
});

const setEmployeeCredentialsCredentialsController = asyncHandler(
  async (req, res) => {
    const { employeeId, password } = req.body;
    console.log(employeeId);

    const isEmployeeExist = await Employee.findOne({ _id: employeeId });
    console.log(isEmployeeExist);

    if (!isEmployeeExist) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const newHashedPass = await bcrypt.hash(password, 10);
    isEmployeeExist.password = newHashedPass;
    await isEmployeeExist.save();
    return res.json({ message: "done" });
  }
);
module.exports = {
  createEmployeeController,
  searchEmployeeController,
  setEmployeeCredentialsCredentialsController,
};
