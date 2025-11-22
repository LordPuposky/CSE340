const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Display vehicles by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Display vehicle details
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailView));

// Inventory management main page
router.get('/', invController.showManagement);

// Display add classification form and process submission
router.get('/add-classification', invController.showAddClassification)
router.post('/add-classification', invController.addClassification)

// Display add vehicle form and process submission
router.get('/add-inventory', invController.showAddInventory)
router.post('/add-inventory', invController.addInventory)

// Display edit vehicle form for a specific vehicle
router.get('/edit/:invId', utilities.handleErrors(invController.showEditInventory))

// Process edit vehicle form submission
router.post("/edit-inventory", invController.editInventory)

// Process vehicle deletion request
router.post("/delete-inventory", invController.deleteInventory)

module.exports = router;
