const router = require("express").Router()
const { userProteced } = require("../middlewere/protected")
const userController = require("./../controller/user.controller")
router
    .post("verify-user-email", userProteced, userController.verifyUserEmail)

module.exports = router