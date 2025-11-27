const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

// Login Data Validation Rules
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password is required.")
    ]
}

// Check data and return errors or continue to login
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email
        })
        return
    }
    next()
}

// Inventory Data Validation Rules
validate.newInventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required."),
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required."),
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required."),
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required."),
        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required."),
        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required."),
        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Miles is required."),
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required."),
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Classification is required."),
    ]
}

// Check inventory data and return errors or continue to add
validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
        })
        return
    }
    next()
}

// Check update data and return errors or continue to update
validate.checkUpdateData = async (req, res, next) => {
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const invModel = require("../models/inventory-model")
        const classifications = await invModel.getClassifications()
        const itemName = `${inv_make} ${inv_model}`
        
        res.render("inventory/edit-inventory", {
            errors: errors.array(),
            title: "Edit " + itemName,
            nav,
            classifications,
            vehicle: {
                inv_id,
                inv_make,
                inv_model,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_year,
                inv_miles,
                inv_color,
                classification_id,
            }
        })
        return
    }
    next()
}


module.exports = validate
