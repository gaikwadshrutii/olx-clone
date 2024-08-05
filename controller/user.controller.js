const asyncHandler = require("express-async-handler")
const User = require("../model/User")
const sendEmail = require("../utils/email")
const { sendSMS } = require("../utils/sms")
const Posts = require("../model/Posts")
const upload = require("../utils/upload")
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
    const result = await User.findById(req.loggedInUser)
    const otp = Math.floor(100000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { mobileCode: otp })
    await sendSMS({
        message: `your otp is ${otp}`,
        numbers: `${result.mobile}`
    })
    res.json({ message: "verification  send Success" })
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
    const updateUser = await User.findByIdAndUpdate(
        req.loggedInUser,
        { mobileverified: true },
        { new: true })
    req.json({
        message: "Mobile verify Success", result: {
            _id: updateUser._id,
            name: updateUser.name,
            mobile: updateUser.mobile,
            avatar: updateUser.avatar,
            emailverified: updateUser.emailverified,
            mobileverified: updateUser.mobileverified,
        }
    })
})
exports.addPost = asyncHandler(async (req, res) => {
    upload(req, res, async err => {

        const { title, desc, price, location, category } = req.body
        const { error, isError } = checkEmpty({ title, desc, price, location, category })
        if (isError) {
            return res.status(400).json({ message: "All Fields Required", error })
        }
        console.log(req.files)

        //  modify this code to support cloudnary
        // await Posts.create({ title, desc, price, image, location, category, user: req.loggedInUser })
        res.json({ message: "Post create success" })
    })
})