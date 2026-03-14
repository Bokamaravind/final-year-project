import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

async function listAdmins() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await Admin.find();
  console.log('Admins:', admins);
  mongoose.disconnect();
}

listAdmins();
