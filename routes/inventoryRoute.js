const express = require("express")
const router = new express.Router()
const { body, validationResult } = require("express-validator")
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({ msg: error.msg }))
        req.errors = errorMessages
    }
    next()
}

// Display vehicles by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Display vehicle details
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView));


// Inventory management main page
router.get('/', invController.showManagement);


// Display add classification form
router.get('/add-classification', invController.showAddClassification)

// Process add classification form - CON VALIDACIÓN
router.post('/add-classification',
    body('classification_name')
        .trim()
        .notEmpty().withMessage('Classification name is required')
        .isAlpha().withMessage('Classification name must contain only alphabetic characters'),
    handleValidationErrors,
    invController.addClassification)


// Display add vehicle form
router.get('/add-inventory', invController.showAddInventory)

// Process add vehicle form
router.post('/add-inventory', invController.addInventory)


// Display edit vehicle form for a specific vehicle
router.get('/edit/:invId', utilities.handleErrors(invController.showEditInventory))


// Process edit vehicle form submission
router.post("/edit-inventory", invController.editInventory)


// Process vehicle deletion request
router.post("/delete-inventory", invController.deleteInventory)

/* ================================
 * Get inventory for AJAX Route
 * Unit 5, Select inv item activity
 * ================================ */
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)


module.exports = router;
