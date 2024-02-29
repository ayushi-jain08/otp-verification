import express from "express";
const router = express.Router();
import { connectToDatabase, closeConnection } from "../Config.js";
import { sendOtpOnEmail } from "../Utils/SendOtp.js";
import { Checkvalidator, CheckOtp } from "../Utils/Validator.js";
import { validationResult } from "express-validator";

let db;
async function createTTLIndex() {
  db = await connectToDatabase();
  const otpCollection = db.collection("otp");
  await otpCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 300 }
  );
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Endpoint to send OTP
router.post("/send-otp", Checkvalidator, async (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: errors.array(),
    });
  }
  try {
    // Connect to MongoDB
    db = await connectToDatabase();

    // Check if this email already  exist in otp collection
    const existingOtp = await db.collection("otp").findOne({ email });

    if (existingOtp) {
      return res.status(400).json({
        success: false,
        error: "OTP already sent. Please wait before requesting again.",
      });
    }

    // Create TTL Index
    await createTTLIndex();

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in MongoDB
    const otpCollection = db.collection("otp");
    await otpCollection.insertOne({
      email,
      otp,
      createdAt: new Date(),
    });

    // Send OTP to Email
    await sendOtpOnEmail(email, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (db) {
      await closeConnection();
    }
  }
});

// Endpoint to verify OTP
router.post("/verify-otp/:email", CheckOtp, async (req, res) => {
  const { enteredOTP } = req.body;
  const { email } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array(),
    });
  }

  try {
    // Connect to MongoDB
    db = await connectToDatabase();

    // Verify OTP
    const otpCollection = db.collection("otp");
    const query = {
      email,
      otp: enteredOTP,
    };

    const otpDocument = await otpCollection.findOne(query);

    if (otpDocument) {
      // OTP verified successfully
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully." });

      // Delete the OTP document from the collection
      await otpCollection.deleteOne({ _id: otpDocument._id });
    } else {
      // Invalid OTP
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  } finally {
    if (db) {
      await closeConnection();
    }
  }
});

export default router;
