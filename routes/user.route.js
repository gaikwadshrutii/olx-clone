const router = require("express").Router()
const { userProteced } = require("../middlewere/protected")
const userController = require("./../controller/user.controller")
router
    .post("verify-user-email", userProteced, userController.verifyUserEmail)
    .post("verify-user-email-otp", userProteced, userController.verifyEmailOpt)

    .post("verify-user-mobile", userProteced, userController.verifyUserMobile)
    .post("verify-user-mobile-otp", userProteced, userController.verifyMobileOTP)

module.exports = router