const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    //await mongoose.connect(process.env.Database_Uri);
    await mongoose.connect(process.env.Local_Db,{
    
      maxPoolSize:10
    });
  } catch (error) {
    console.log("Error connecting to Database");
  }
};
module.exports = connectDB;
