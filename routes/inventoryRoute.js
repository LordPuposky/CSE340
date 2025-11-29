const express = require("express")
const router = new express.Router()
const { body, validationResult } = require("express-validator")
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --- Helper function for validation (Keep existing) ---
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({ msg: error.msg }))
        req.errors = errorMessages
    }
    next()
}

// Display vehicles by classification (NOT PROTECTED)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));


// Display vehicle details (NOT PROTECTED)
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView));


// Inventory management main page (PROTECTED: Login + Admin/Employee)
router.get(
    '/',
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.showManagement)
);


// Display add classification form (PROTECTED: Login + Admin/Employee)
router.get(
    '/add-classification',
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.showAddClassification)
);

// Process add classification form (PROTECTED: Login + Admin/Employee)
router.post(
    '/add-classification',
    utilities.checkLogin,
    utilities.checkAuthorization,
    body('classification_name')
        .trim()
        .notEmpty().withMessage('Classification name is required')
        .isAlpha().withMessage('Classification name must contain only alphabetic characters'),
    handleValidationErrors,
    utilities.handleErrors(invController.addClassification)
);


// Display add vehicle form (PROTECTED: Login + Admin/Employee)
router.get(
    '/add-inventory',
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.showAddInventory)
);

// Process add vehicle form (PROTECTED: Login + Admin/Employee)
router.post(
    '/add-inventory',
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.addInventory)
);


// Display edit vehicle form for a specific vehicle (PROTECTED: Login + Admin/Employee)
router.get(
    '/edit/:invId',
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.showEditInventory)
);


// Process edit vehicle form submission (PROTECTED: Login + Admin/Employee)
router.post(
    "/edit-inventory",
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.editInventory)
);


// Process vehicle deletion request (PROTECTED: Login + Admin/Employee)
router.post(
    "/delete-inventory",
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.deleteInventory)
);


/* ================================
 * Get inventory for AJAX Route (PROTECTED: Login + Admin/Employee)
 * ================================ */
router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.getInventoryJSON)
);


/* ================================
 * Deliver the delete confirmation view (PROTECTED: Login + Admin/Employee)
 * ================================ */
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.deleteView)
);


/* ================================
 * Process the delete inventory request (PROTECTED: Login + Admin/Employee)
 * ================================ */
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.checkAuthorization,
    utilities.handleErrors(invController.deleteItem)
);


/* ================================
 * Process edit inventory request (This route is redundant/incorrectly labeled, using the first /edit/:invId GET above)
 * ================================ */
// router.get(
//     "/edit/:invId",
//     utilities.checkLogin,
//     utilities.checkAuthorization,
//     utilities.handleErrors(invController.showEditInventory)
// );


/* ================================
 * Process update inventory request (PROTECTED: Login + Admin/Employee)
 * ================================ */
router.post(
    "/update",
    utilities.checkLogin,
    utilities.checkAuthorization,
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;