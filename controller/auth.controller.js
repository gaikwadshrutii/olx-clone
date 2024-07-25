/**
 admin regiseter
 admin verify otp
 admin login
 admin logout  
 
 user regisetr 
 user verify email
 user login
 user logout
  
*/

const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { checkEmpty } = require("../utils/checkEmpty")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../model/Admin")
const sendEmail = require("../utils/email")
const User = require("../model/User")
const e = require("express")


exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "All Feild Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json({ message: "Provide Strong Password" })
    // }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(404).json({ message: "Email Already registerd with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })

    res.json({ message: "Register success" })
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Feild Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: " Email Not Found" })
    }
    const isVerify = await bcrypt.compare(password, result.password)
    if (!isVerify) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "Invalid password" : "Invalid Credential" })
    }
    // send otp
    const otp = Math.floor(10000 + Math.random() * 900000)

    await Admin.findByIdAndUpdate(result._id, { otp })

    await sendEmail({
        to: email, subject: `Login OTP`, message:
            `<h1>Do Not Share Your Account OTP</h1>
            <p>your login otp ${otp}</p>
            `})

    res.json({ message: "Credential verify Success.OTP send to your registred email." })
})
exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ email, otp })
    if (isError) {
        return res.status(401).json({ message: "All Feild Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "Invalid email" : "Invalid Credential" })
    }
    if (otp !== result.otp) {
        return res.status(401).json({ message: "Invalid OTP" })
    }

    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    res.cookie("admin", token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    res.json({
        message: "OTP Verify Success.", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
    //  JWT
    //  cookie
    // res

})
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Admin Logout Success" })
})
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, mobile, email, password, cpassword } = req.body

    const { error, isError } = checkEmpty({
        name, mobile, email, password, cpassword
    })
    if (isError) {
        return res.status(400).json({ message: "ALl fields require", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json
            ({ message: "Invalid Email", error })
    }
    if (!validator.isMobilePhone(mobile, "en-IN")) {
        return res.status(400).json({
            message: "Invalid Mobile", error
        })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
            message: "Provide Strong Password", error
        })
    }
    if (!validator.isStrongPassword(cpassword)) {
        return res.status(400).json({
            message: "Provide Strong Confirm Password Password", error
        })
    }
    if (password !== cpassword) {
        return res.status(400).json({
            message: "Password Do Not Match", error
        })
    }

    const hash = await bcrypt.hash(password, 10)

    await User.create({ name, mobile, email, password: hash })
    res.json({ message: "User register Success" })
})
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { error, isError } = checkEmpty({ email, password })
    if (isError) { return res.status(400).json({ message: "All fields require" }), error }

    const result = await User.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "Email Not Found" })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "Password Do Not match" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "180d" })
    res.cookie("user", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 180
    })
    res.json({ message: "User Register Success" })

})
exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("User")
    res.json({ message: "User Logout Success" })
})
