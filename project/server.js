 

// require('dotenv').config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");
// const PDFDocument = require("pdfkit");
// const { v4: uuidv4 } = require("uuid");
// const cors = require("cors");
// const twilioLib = require("twilio");
// const mongoose = require("mongoose");
// const Incident = require("./backend/models/Incident");


// const app = express();
// const PORT = 8080;

// // let dbReady = false;

// // mongoose.connection.once("open", () => {
// //   dbReady = true;
// // });


// mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://bokamaravind_07:h6O9pI0zPx536SUD@cluster0.mfyvep3.mongodb.net/reporting?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.error(err));


// // ===============================
// // 🔐 CONFIG (REPLACE VALUES)
// // ===============================

 

// const TWILIO_ACCOUNT_SID = "AC2f01290aa88ec6afd8f46e18d9634bf5";
// const TWILIO_AUTH_TOKEN = "1690287377290ee3c87d9ba4e12b5f7e";
// const TWILIO_PHONE_NUMBER = "+14155238886"; // WhatsApp Sandbox number

// const HIGHER_AUTHORITIES = [
//   "+919912021754", // Police / Admin
// ];

// // ===============================
// // 🤖 GEMINI SETUP
// // ===============================

// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

// // ===============================
// // 📁 DIRECTORIES
// // ===============================

// const UPLOAD_DIR = path.join(__dirname, "uploads");
// const REPORTS_DIR = path.join(__dirname, "reports");

// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
// if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR);

// // ===============================
// // 🧩 MIDDLEWARE
// // ===============================

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: "25mb" }));
// app.use("/reports", express.static(REPORTS_DIR));
// app.use("/uploads", express.static(UPLOAD_DIR));

// // ===============================
// // 📤 MULTER
// // ===============================

// const storage = multer.diskStorage({
//   destination: UPLOAD_DIR,
//   filename: (_, file, cb) => {
//     cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({ storage });

// // ===============================
// // 🟢 HEALTH CHECK
// // ===============================
// app.get("/", (req, res) => {
//   res.send("🚨 Violence Detection Server is running!");
// });

// app.get("/health", (req, res) => {
//   res.json({ ok: true, time: new Date().toISOString() });
// });

// // ===============================
// // 🔍 ANALYZE IMAGE (Gemini)
// // ===============================

// app.post("/analyze", upload.single("image"), async (req, res) => {
//   try {
//     let imageBuffer, mimeType;

//     if (req.file) {
//       imageBuffer = fs.readFileSync(req.file.path);
//       mimeType = req.file.mimetype;
//     } else if (req.body.imageBase64) {
//       const match = req.body.imageBase64.match(/^data:(image\/\w+);base64,(.*)$/);
//       if (!match) return res.status(400).json({ error: "Invalid base64 image" });
//       mimeType = match[1];
//       imageBuffer = Buffer.from(match[2], "base64");
//     } else {
//       return res.status(400).json({ error: "No image provided" });
//     }

//     const base64Image = imageBuffer.toString("base64");

//     const prompt = `
// You are a professional surveillance analyst.
// Analyze this image for violence, fights, weapons, or physical attacks.

// Return ONLY valid JSON:
// {
//   "classification": "NORMAL or SUSPICIOUS",
//   "threat_type": "None | Physical Violence | Weapon",
//   "confidence_percent": 85,
//   "visual_indicators": ["indicator1", "indicator2"],
//   "full_explanation": "Detailed explanation"
// }
// `;

//     const aiResp = await axios.post(GEMINI_URL, {
//       contents: [
//         {
//           parts: [
//             { text: prompt },
//             {
//               inlineData: {
//                 mimeType,
//                 data: base64Image,
//               },
//             },
//           ],
//         },
//       ],
//     });

//     const raw =
//       aiResp?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
//     const clean = raw.replace(/```json|```/g, "").trim();
//     const analysis = JSON.parse(clean);

//     const report = {
//       id: uuidv4(),
//       time: new Date().toISOString(),
//       status: analysis.classification,
//       confidence: analysis.confidence_percent,
//       explanation: analysis.full_explanation,
//     };

//     const pdfPath = path.join(REPORTS_DIR, `${report.id}.pdf`);
//     await generatePdf(report, imageBuffer, pdfPath);

//     res.json({
//       success: true,
//       report,
//       pdf: `/reports/${report.id}.pdf`,
//     });
//   } catch (err) {
//     console.error("Analyze error:", err.message);
//     res.status(500).json({ error: "AI analysis failed" });
//   }
// });

// // ===============================
// // 📄 PDF GENERATOR
// // ===============================

// function generatePdf(report, imageBuffer, outPath) {
//   return new Promise((resolve) => {
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(outPath));

//     doc.fontSize(18).text("🚨 Violence Detection Report", { align: "center" });
//     doc.moveDown();

//     doc.fontSize(12).text(`Report ID: ${report.id}`);
//     doc.text(`Time: ${report.time}`);
//     doc.text(`Status: ${report.status}`);
//     doc.text(`Confidence: ${report.confidence}%`);
//     doc.moveDown();

//     if (imageBuffer) {
//       doc.image(imageBuffer, { width: 300 });
//       doc.moveDown();
//     }

//     doc.fontSize(12).text("Explanation:");
//     doc.fontSize(10).text(report.explanation);

//     doc.end();
//     resolve();
//   });
// }

// // ===============================
// // 📲 TWILIO WHATSAPP WEBHOOK
// // ===============================

// const twilio = twilioLib(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// // ===============================
// // 📲 TWILIO WHATSAPP WEBHOOK
// // ===============================

// // Store last known location per user
// const lastKnownLocation = {};

// app.post("/twilio-webhook", async (req, res) => {
//   try {
//     const from = req.body.From;
//     const mediaUrl = req.body.MediaUrl0;

//     const latitude = req.body.Latitude;
//     const longitude = req.body.Longitude;
//     const address = req.body.Address;

//     /* ===============================
//        📍 LOCATION MESSAGE HANDLING
//     =============================== */
//     if (latitude && longitude) {
//       lastKnownLocation[from] = {
//         latitude,
//         longitude,
//         address,
//         timestamp: Date.now(),
//       };

//       return res.send(`
//         <Response>
//           <Message>📍 Location received successfully. Now please send the image.</Message>
//         </Response>
//       `);
//     }

//     /* ===============================
//        📷 IMAGE WITHOUT LOCATION
//     =============================== */
//     if (!mediaUrl) {
//       return res.send(`
//         <Response>
//           <Message>⚠️ Please share live location before sending the image.</Message>
//         </Response>
//       `);
//     }

//     /* ===============================
//     const analyzeResp = await axios.post(
//       `http://localhost:${PORT}/analyze`,
//       {
//         imageBase64: `data:${mimeType};base64,${imageBuffer.toString("base64")}`,
//       }
//     );
//     const report = analyzeResp.data.report;
//     =============================== */
//     let locationText = "📍 Location not shared";
//     const saved = lastKnownLocation[from];

//     if (saved) {
//       const isExpired = Date.now() - saved.timestamp > 10 * 60 * 1000;

//       if (isExpired) {
//         delete lastKnownLocation[from];

//         return res.send(`
//           <Response>
//             <Message>⚠️ Location expired. Please share live location again.</Message>
//           </Response>
//         `);
//       }

//       locationText = `📍 Live Location:
// https://www.google.com/maps?q=${saved.latitude},${saved.longitude}`;
//     } else {
//       return res.send(`
//         <Response>
//           <Message>⚠️ Please share live location before sending the image.</Message>
//         </Response>
//       `);
//     }

//     /* ===============================
//        🔐 DOWNLOAD IMAGE FROM TWILIO
//     =============================== */
//     const imgResp = await axios.get(mediaUrl, {
//       responseType: "arraybuffer",
//       auth: {
//         username: TWILIO_ACCOUNT_SID,
//         password: TWILIO_AUTH_TOKEN,
//       },
//     });

//     const mimeType = imgResp.headers["content-type"];
//     const imageBuffer = Buffer.from(imgResp.data);

//     // Save image locally
//     const fileName = `${Date.now()}-${uuidv4()}.jpg`;
//     const filePath = path.join(UPLOAD_DIR, fileName);
//     fs.writeFileSync(filePath, imageBuffer);

//     // Public image URL (ngrok / prod)
//     const publicBaseUrl =
//       process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
//     const publicImageUrl = `${publicBaseUrl}/uploads/${fileName}`;

//     /* ===============================
//        🤖 ANALYZE IMAGE
//     =============================== */
//     const analyzeResp = await axios.post(
//       `http://localhost:${PORT}/analyze`,
//       {
//         imageBase64: `data:${mimeType};base64,${imageBuffer.toString("base64")}`,
//       }
//     );

//     const report = analyzeResp.data.report;


    

    
//     /* ===============================
//        🚨 ALERT AUTHORITIES
//     =============================== */
//     if (report.status === "SUSPICIOUS") {


// //        if (!dbReady) {
// //   console.error("MongoDB not ready yet");
// //   return res.send(`<Response><Message>Server initializing, try again</Message></Response>`);
// // }

// //   // SAVE TO DB HERE 👇
// await Incident.create({
//   image: publicImageUrl,
//   pdf: `/reports/${report.id}.pdf`,
//   status: report.status,
//   confidence: report.confidence,
//   explanation: report.explanation,
//   location: {
//     latitude: saved.latitude,
//     longitude: saved.longitude
//   },

//   notifiedAuthorities: HIGHER_AUTHORITIES, // Array of strings

//   reportedAt: new Date()
// });
//       for (const number of HIGHER_AUTHORITIES) {
//         await twilio.messages.create({
//           from: `whatsapp:${TWILIO_PHONE_NUMBER}`,
//           to: `whatsapp:${number}`,
//           body: `🚨 VIOLENCE DETECTED
// From: ${from}
// Confidence: ${report.confidence}%

// ${locationText}

// ${report.explanation}`,
//           mediaUrl: [publicImageUrl],
//         });
//       }
//     }

//     res.send(`
//       <Response>
//         <Message>Image processed ✅</Message>
//       </Response>
//     `);
//   } catch (err) {
//     console.error("Twilio error:", err.message);
//     res.send(`
//       <Response>
//         <Message>Error processing media</Message>
//       </Response>
//     `);
//   }
// }
// );


// // ===============================
// // 🚀 START SERVER
// // ===============================

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });



import dotenv from "dotenv";
dotenv.config();

// Ensure DB connection is established before importing models/routes
import { connectDB } from "./backend/db.js";
await connectDB();

import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import axios from "axios";
import PDFDocument from "pdfkit";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import twilioLib from "twilio";

import { fileURLToPath } from "url";

// Routes
import adminRoutes from "./backend/routes/admin.routes.js";
import incidentRoutes from "./backend/routes/incident.routes.js";

// Models
import Incident from "./backend/models/Incident.js";

// ===============================
// 🔧 DIRNAME FIX FOR ES MODULE
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// 🚀 APP INIT
// ===============================
const app = express();

// ===============================
// 🔐 CONFIG
// ===============================
const GEMINI_KEY = process.env.GEMINI_KEY  ;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = +14155238886;

const HIGHER_AUTHORITIES = ["+919912021754"];

// ===============================
// 📁 DIRECTORIES
// ===============================
const UPLOAD_DIR = path.join(__dirname, "uploads");
const REPORTS_DIR = path.join(__dirname, "reports");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR);

// ===============================
// 🧩 MIDDLEWARE
// ===============================
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "25mb" }));
app.use("/reports", express.static(REPORTS_DIR));
app.use("/uploads", express.static(UPLOAD_DIR));

// ===============================
// 📤 MULTER
// ===============================
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ===============================
// ROUTES
// ===============================
app.use("/api/admin", adminRoutes);
app.use("/api/incidents", incidentRoutes);

// ===============================
// 🟢 HEALTH
// ===============================
app.get("/", (req, res) => {
  res.send("🚨 Violence Detection Server is running!");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ===============================
// 🤖 SHARED ANALYSIS FUNCTION
// (Called directly — no internal HTTP request)
// ===============================
async function analyzeImageBuffer(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString("base64");

  const prompt = `
You are an AI surveillance system.

Analyze the image for:
- violence
- fighting
- weapons
- dangerous situations

Return ONLY valid JSON:

{
 "classification": "NORMAL or SUSPICIOUS",
 "threat_type": "None | Physical Violence | Weapon",
 "confidence_percent": 0-100,
 "visual_indicators": ["indicator1","indicator2"],
 "full_explanation": "Detailed explanation"
}
`;

  const aiResp = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  let raw = aiResp?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  raw = raw.replace(/```json|```/g, "").trim();

  let analysis;
  try {
    analysis = JSON.parse(raw);
  } catch {
    console.log("⚠ Gemini returned non-JSON:", raw);
    analysis = {
      classification: "NORMAL",
      threat_type: "Unknown",
      confidence_percent: 50,
      visual_indicators: [],
      full_explanation: raw,
    };
  }

  const report = {
    id: uuidv4(),
    time: new Date().toISOString(),
    status: analysis.classification || "NORMAL",
    confidence: analysis.confidence_percent || 50,
    explanation: analysis.full_explanation || "No explanation",
  };

  const pdfPath = path.join(REPORTS_DIR, `${report.id}.pdf`);
  await generatePdf(report, imageBuffer, pdfPath);

  return report;
}

// ===============================
// 🔍 ANALYZE IMAGE ENDPOINT
// ===============================
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer, mimeType;

    // ── Get Image ──
    if (req.file) {
      imageBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype;
    } else if (req.body.imageBase64) {
      const match = req.body.imageBase64.match(
        /^data:(image\/\w+);base64,(.*)$/
      );

      if (!match) {
        return res.status(400).json({ error: "Invalid base64 image format" });
      }

      mimeType = match[1];
      imageBuffer = Buffer.from(match[2], "base64");
    } else {
      return res.status(400).json({ error: "No image provided" });
    }

    // ── Call shared function directly (no HTTP) ──
    const report = await analyzeImageBuffer(imageBuffer, mimeType);

    res.json({
      success: true,
      report,
      pdf: `/reports/${report.id}.pdf`,
    });
  } catch (err) {
    console.error("🔥 Analyze Error:", err.response?.data || err.message);

    return res.status(500).json({
      error: "AI analysis failed",
      details: err.response?.data || err.message,
    });
  }
});

// ===============================
// 📄 PDF GENERATOR
// ===============================
function generatePdf(report, imageBuffer, outPath) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(outPath));

    doc.fontSize(18).text("🚨 Violence Detection Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Report ID: ${report.id}`);
    doc.text(`Time: ${report.time}`);
    doc.text(`Status: ${report.status}`);
    doc.text(`Confidence: ${report.confidence}%`);
    doc.moveDown();

    if (imageBuffer) {
      doc.image(imageBuffer, { width: 300 });
      doc.moveDown();
    }

    doc.fontSize(12).text("Explanation:");
    doc.fontSize(10).text(report.explanation);

    doc.end();
    resolve();
  });
}

// ===============================
// 📲 TWILIO CLIENT
// ===============================
const twilio = twilioLib(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const lastKnownLocation = {};

// ===============================
// 📲 TWILIO WEBHOOK
// ===============================
app.post("/twilio-webhook", async (req, res) => {
  try {
    const from = req.body.From;
    const mediaUrl = req.body.MediaUrl0;
    const { Latitude, Longitude, Address } = req.body;

    // ── Step 1: Save Location ──
    if (Latitude && Longitude) {
      lastKnownLocation[from] = {
        latitude: Latitude,
        longitude: Longitude,
        address: Address,
        timestamp: Date.now(),
      };

      return res.send(`
        <Response>
          <Message>📍 Location received. Now send the image.</Message>
        </Response>
      `);
    }

    // ── No image sent ──
    if (!mediaUrl) {
      return res.send(`
        <Response>
          <Message>⚠️ Please share live location before sending image.</Message>
        </Response>
      `);
    }

    // ── Check saved location ──
    const saved = lastKnownLocation[from];

    if (!saved || Date.now() - saved.timestamp > 10 * 60 * 1000) {
      delete lastKnownLocation[from];
      return res.send(`
        <Response>
          <Message>⚠️ Location expired. Please send location again.</Message>
        </Response>
      `);
    }

    const locationText = `📍 Live Location:\nhttps://www.google.com/maps?q=${saved.latitude},${saved.longitude}`;

    // ── Step 2: Download Image from Twilio ──
    const imgResp = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
    });

    const mimeType = imgResp.headers["content-type"];
    const imageBuffer = Buffer.from(imgResp.data);

    const fileName = `${Date.now()}-${uuidv4()}.jpg`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, imageBuffer);

    const publicBaseUrl = `https://final-year-project-okg4.onrender.com`;
    const publicImageUrl = `${publicBaseUrl}/uploads/${fileName}`;
    const imageUrlForDb = `/uploads/${fileName}`;
    const cleanImageUrlForDb = imageUrlForDb.replace(/["']/g, "");

    // ── Step 3: Analyze Image DIRECTLY (no internal HTTP call) ──
    const report = await analyzeImageBuffer(imageBuffer, mimeType);

    // ── Step 4: Save to Database ──
    console.log("[Incident] Attempting to insert:", {
      incidentId: report.id,
      from: from,
      image: cleanImageUrlForDb,
      pdf: `/reports/${report.id}.pdf`,
      status: report.status,
      confidence: report.confidence,
      explanation: report.explanation,
      location: {
        latitude: saved.latitude,
        longitude: saved.longitude,
      },
      notifiedAuthorities: HIGHER_AUTHORITIES,
      reportedAt: new Date(),
    });

    const insertedIncident = await Incident.create({
      incidentId: report.id,
      from: from,
      image: cleanImageUrlForDb,
      pdf: `/reports/${report.id}.pdf`,
      status: report.status,
      confidence: report.confidence,
      explanation: report.explanation,
      location: {
        latitude: saved.latitude,
        longitude: saved.longitude,
      },
      notifiedAuthorities: HIGHER_AUTHORITIES,
      reportedAt: new Date(),
    });

    console.log("[Incident] Inserted:", insertedIncident);

    // ── Step 5: If Suspicious → Notify Authorities ──
    if (report.status === "SUSPICIOUS") {
      for (const number of HIGHER_AUTHORITIES) {
        await twilio.messages.create({
          from: `whatsapp:${TWILIO_PHONE_NUMBER}`,
          to: `whatsapp:${number}`,
          body: `🚨 VIOLENCE DETECTED\nFrom: ${from}\nConfidence: ${report.confidence}%\n\n${locationText}\n\n${report.explanation}`,
          mediaUrl: [publicImageUrl],
        });
      }

      return res.send(`
        <Response>
          <Message>🚨 Suspicious activity detected. Authorities have been notified ✅</Message>
        </Response>
      `);
    }

    // ── Not Suspicious ──
    return res.send(`
      <Response>
        <Message>✅ Image analyzed. No suspicious activity detected.</Message>
      </Response>
    `);
  } catch (err) {
    console.error("Twilio Webhook Error:", err);

    return res.send(`
      <Response>
        <Message>❌ Error processing your request. Please try again.</Message>
      </Response>
    `);
  }
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
