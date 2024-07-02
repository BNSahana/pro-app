import mongoose from "mongoose";

const ConnectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Failed to connect DB", error);
  }
};
export default ConnectToMongoDB;
