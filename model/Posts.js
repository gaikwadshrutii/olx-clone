const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
    location: { type: String, required: true },
}, { timestamps: true })
module.exports = mongoose.model("post", postSchema)