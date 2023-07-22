import mongoose from "mongoose";
export default async function initConnect() {
  const MONGO_URI = process.env.MONGO_URI as string;
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection.connection.db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
