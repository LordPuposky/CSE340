/**************************************
 * Account routes
 **************************************/

const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Login view
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

// Register view
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
)

// Register process
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Profile view (Assuming this is an old or unused route, but kept for structure)
router.get(
    "/profile",
    utilities.handleErrors(accountController.buildProfile)
)

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Account Management View (Protected)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))


// =============================================
// Task 5: Account Update Routes
// =============================================

// Deliver the account update view (Protected and requires ID, though ID is used mainly for the link)
// The ID in the route URL is ignored in the controller as data is pulled from the JWT/locals
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateView)
)

// Process the account data update (Data: first name, last name, email)
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(), // Validation rules for name/email
    regValidate.checkUpdateData, // Middleware to handle errors/sticky fields
    utilities.handleErrors(accountController.updateAccountData)
)

// Process the account password change
router.post(
    "/update/password",
    utilities.checkLogin,
    regValidate.updatePasswordRules(), // Validation rules for strong password
    regValidate.checkPasswordData,  // Middleware to handle errors/sticky fields
    utilities.handleErrors(accountController.updateAccountPassword)
)

// =============================================
// Task 6: Logout Process
// =============================================

// Process the logout request
router.get(
    "/logout",
    utilities.handleErrors(accountController.accountLogout) // New controller function needed for logout
)


module.exports = router