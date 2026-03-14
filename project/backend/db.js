import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  mongoose.set("bufferCommands", false);

  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://bokamaravind_07:h6O9pI0zPx536SUD@cluster0.mfyvep3.mongodb.net/reporting?retryWrites=true&w=majority&appName=Cluster0', {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("✅ MongoDB fully ready");
}
