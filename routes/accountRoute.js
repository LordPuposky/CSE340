/**************************************
 *  Account routes
 **************************************/

const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Login view
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin))

// Register view
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister))

// Register process
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


module.exports = router