import mongoose from "mongoose";

const uri = "mongodb+srv://bokamaravind_07:h6O9pI0zPx536SUD@cluster0.mfyvep3.mongodb.net/reporting?retryWrites=true&w=majority&appName=Cluster0";

const incidentSchema = new mongoose.Schema({
  image: String,
  status: String,
  reportedAt: Date,
});

const Incident = mongoose.model("Incident", incidentSchema);

async function testInsert() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const doc = await Incident.create({
      image: "test.jpg",
      status: "TEST",
      reportedAt: new Date(),
    });

    console.log("✅ Inserted:", doc);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testInsert();