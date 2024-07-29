const asyncHandler = require("express-async-handler")
const User = require("../model/User")
const sendEmail = require("../utils/email")
exports.verifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not login ,please login Again" })
    }
    console.log(req.loggedInUser)
    const otp = Math.floor(10000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { emailCode: otp })
    const isSend = await sendEmail({
        to: result.email,
        subject: "Verify Email",
        message: `<p> your otp is ${otp}</p>`
    })
    res.json({ message: "User Email Verify Success" })
})
exports.verifyUserMobile = asyncHandler(async (req, res) => {
   
    res.json({ message: "verification  Success" })
})
exports.verifyEmailOpt = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not login ,please login Again" })
    }
    if (otp != result.emailCode) {
        return res.status(400).json({ message: "Invalid OTP" })
    }
    await User.findByIdAndUpdate(req.loggedInUser, { emailverified: true })
    req.json({ message: "Email verify Success" })
})
exports.verifyMobileOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not login ,please login Again" })
    }
    if (otp !== result.mobileCode) {
        return res.status(400).json({ message: "Invalid OTP" })
    }
    await User.findByIdAndUpdate(req.loggedInUser, { mobileverified: true })
    req.json({ message: "Mobile verify Success" })
})