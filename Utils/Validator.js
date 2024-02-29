import { check } from "express-validator";

export const Checkvalidator = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please include a valid email")
    .normalizeEmail({
      gmail_remove_dots: true,
    }),
];

export const CheckOtp = [
  check("enteredOTP", "Otp is required").not().isEmpty(),
];
