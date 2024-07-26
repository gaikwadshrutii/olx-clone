const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/ddvvh0avd/image/upload/v1721291392/dummy_utzs3r.png"
    },
    password: {
        type: String,
        required: true
    },
    emailverified: {
        type: Boolean,
        default: false
    },
    mobileverified: {
        type: Boolean,
        default: false
    },
    emailCode: {
        type: String,
    },
    mobileCode: {
        type: String,
    },
    active: {
        type: String,
        default: true
    },
    isDeleted: {
        type: String,
        default: false
    },
    mobile: {
        type: Number,
        required: true
    },
}, { timestamps: true })
module.exports = mongoose.model("user", userSchema)