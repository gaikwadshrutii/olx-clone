const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const cookieparser = require("cookie-parser")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static("dist"))
app.use(cors({
    origin: process.env.NODE_ENV === "devlopment"
        ? "http://localhost:5173"
        : "live-server",
    credentials: true
}))

app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource Not Found" })
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ mongoose: `Server Error ${err.message}` })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT, console.log("SERVER RUNNING"))
})