import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true },
  from: { type: String },
  image: { type: String, required: true },
  confidence: { type: Number, required: true },
  explanation: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['SUSPICIOUS', 'NORMAL'], required: true },
  pdf: { type: String },
  notifiedAuthorities: {
    type: [String],
    default: []
  },
  actionTaken: { type: Boolean, default: false },
});

const Incident = mongoose.model('Incident', IncidentSchema);
export default Incident;
// const mongoose = require("mongoose");

// const IncidentSchema = new mongoose.Schema({
//   incidentId: String,
//   from: String,
//   imageUrl: String,
//   pdfUrl: String,
//   status: String,
//   confidence: Number,
//   explanation: String,
//   location: Object,
//   reportedAt: Date,
//   notifiedAuthorities: [String]
// });

// module.exports = mongoose.model("Incident", IncidentSchema);

