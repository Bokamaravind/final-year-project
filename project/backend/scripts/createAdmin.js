
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = 'admin@example.com';
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, passwordHash, role: 'admin' });
  await admin.save();
  console.log('Admin user created:', email);
  mongoose.disconnect();
}

createAdmin();
