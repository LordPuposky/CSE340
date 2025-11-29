const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")


/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
* Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
}

/* ****************************************
* Process Registration
* Unit 4, process registration activity
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
    } = req.body


    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )


    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

async function buildProfile(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ****************************************
 * Deliver Account Management view
 * Unit 5, JWT Authorization activity
 * *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    // The classificationSelect is only relevant if Inventory Management logic is embedded here
    // const classificationSelect = await utilities.buildClassificationList()
    res.render("account/management", {
        title: "Account Management",
        nav,
        // classificationSelect,
        errors: null,
    })
}

/* ****************************************
 * Deliver Account Update view
 * Task 5 - Controller Function 1
 * *************************************** */
async function buildUpdateView(req, res, next) {
    const nav = await utilities.getNav()
    // The account data is already available via res.locals.accountData from the JWT
    res.render("account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        // The data passed to the view is automatically handled by locals
    })
}

/* ****************************************
 * Process Account Data Update
 * Task 5 - Controller Function 2
 * *************************************** */
async function updateAccountData(req, res, next) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body

    // Check if the email is being changed and if it already exists (This logic should be in middleware, but we handle the error flow here)
    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        // 1. Query the account data from the database after the update is done.
        const updatedAccountData = await accountModel.getAccountById(account_id)
        
        // 2. Clear old JWT and create a new one with updated data
        delete updatedAccountData.account_password
        const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        
        // 3. Set the success message
        req.flash("notice", `Congratulations, your account information has been successfully updated.`)

        // 4. Update the cookie and locals for the redirect
        if (process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        
        // 5. Deliver the management view where the updated account information will be displayed
        return res.redirect("/account/")

    } else {
        // Set a failure message
        req.flash("notice", "Sorry, the update failed. Please try again.")
        // Return to the update view (if using local variable for errors, those are handled by the router/middleware)
        return res.redirect(`/account/update/${account_id}`)
    }
}

/* ****************************************
 * Process Account Password Change
 * Task 5 - Controller Function 3
 * *************************************** */
async function updateAccountPassword(req, res, next) {
    let nav = await utilities.getNav()
    const {
        account_password,
        account_id
    } = req.body

    // 1. Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // 2. Send the hashed password to the model to be updated in the database
    const updateResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (updateResult) {
        // Determine the result and set success message
        req.flash("notice", "Congratulations, your password has been successfully updated.")
        
        // Deliver the management view where the account information will be displayed
        return res.redirect("/account/")
    } else {
        // Determine the result and set failure message
        req.flash("notice", "Sorry, the password update failed.")
        
        // Return to the update view
        return res.redirect(`/account/update/${account_id}`)
    }
}

/* ****************************************
 * Process Logout
 * Task 6
 * *************************************** */
async function accountLogout(req, res) {
    // Delete the JWT cookie
    res.clearCookie("jwt");
    
    // Redirect to the home view
    res.redirect("/");
}


module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    buildProfile,
    accountLogin,
    buildManagement,
    buildUpdateView, // Added for Task 5
    updateAccountData, // Added for Task 5
    updateAccountPassword, // Added for Task 5
    accountLogout // Added for Task 6
}