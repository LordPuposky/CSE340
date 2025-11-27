const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  New Inventory Data Validation Rules
 * ********************************* */
validate.newInventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid make."),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid model."),
        
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage("Please provide a valid year."),
        
        body("inv_price")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),
        
        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Please provide valid miles."),
        
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid color."),
    ]
}

/* ******************************
 * Check data and return errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_id } = req.body
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classifications = await invModel.getClassifications()
        const itemName = `${inv_make} ${inv_model}`
        
        res.render("inventory/edit-inventory", {
            errors: errors.array(),
            title: "Edit " + itemName,
            nav,
            classifications,
            vehicle: req.body
        })
        return
    }
    next()
}

module.exports = validate