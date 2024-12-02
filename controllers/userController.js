const sendEmail = require("../common/sendMail");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

const sendVerificationEmail = async (email, verificationCode) => {
  const subject = "Registration Verification Code";
  const message = `Welcome to Deer 30! Your verification code is: ${verificationCode}. Please use this code to verify your account within 15 minutes.`;
  await sendEmail(email, subject, message);
};

const userSignUp = async (req, res) => {
  try {
    const { fullName, password, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exists with the given email",
      });
    }

    // Validate inputs
    if (!fullName || !password || !email) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("hashedPassword", hashedPassword);

    // Generate verification code for verifcation of hte email
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    sendVerificationEmail(verificationCode);
    // Create and save the new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    });
    await newUser.save();
    // Respond with success
    return res.status(200).json({
      success: true,
      message:
        "Signup successful! Please verify your email with the given OTP.",
    });
  } catch (error) {
    console.error("Error in userSignUp:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "An error occurred during signup. Please try again later.",
    });
  }
};

const userVerify = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Verification successfull." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { password, email } = req.body;
    // Validate inputs
    if (!password || !email) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({
        success: false,
        message: "User does not exists with the given email, Please SignUp",
      });
    }
    const passwordmatched = await bcrypt.compare(
      password,
      existingUser.password
    )
    // Respond with success
    if (passwordmatched) {
      console.log("login successful")
      return res.status(200).json({
        success: true,
        message: "Login successfull!",
      });
    } else {
      return res.status(403).json({
        success: true,
        message: "Please provide correct Details!",
      });
    }
  } catch (error) {
    console.error("Error in userSignUp:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};

module.exports = { userSignUp, userLogin, userVerify };
