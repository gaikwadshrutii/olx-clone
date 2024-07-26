const router = require("express").Router()
const authController = require("./../controller/auth.controller")
router
    .post("/register-admin", authController.registerAdmin)
    .post("/login-admin", authController.loginAdmin)
    .post("/verify-admin-otp", authController.verifyOTP)
    .post("/logout-admin", authController.logoutAdmin)
    // user

    .post("/login-mobile-user", authController.loginUser)
    .post("/register-mobile-user", authController.registerUser)
    .post("/logout-mobile-user", authController.logoutUser)
module.exports = router
