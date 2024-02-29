import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpOnEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // e.g., 'gmail'
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: "ayushijain0807@gmail.com",
      to: email,
      subject: "OTP for Email Verification",
      html: `
        <p>Here is your OTP for email verification: ${otp}</p>
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
      } else {
        console.log("OTP email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
