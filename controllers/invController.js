const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const vehicles = await invModel.getInventoryByClassificationId(classification_id)


        if (!vehicles || vehicles.length === 0) {
            let nav = await utilities.getNav()
            res.render("./inventory/classification", {
                title: "No Vehicles Found",
                nav,
                vehicles: []
            })
            return
        }


        let nav = await utilities.getNav()
        const className = vehicles[0].classification_name
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            vehicles
        })
    } catch (error) {
        next(error)
    }
}


/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
    try {
        const invId = req.params.invId // Get vehicle id from URL
        const vehicle = await invModel.getInventoryById(invId)


        // Validate if vehicle exists
        if (!vehicle) {
            const detail = await utilities.buildDetailView(null)
            let nav = await utilities.getNav()
            res.render("./inventory/detail", {
                title: "Vehicle Not Found",
                nav,
                detail
            })
            return
        }


        let nav = await utilities.getNav()
        // Build the vehicle detail HTML using utilities function
        const detail = await utilities.buildDetailView(vehicle)
        res.render("./inventory/detail", {
            title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
            nav,
            detail
        })
    } catch (error) {
        next(error) // Pass error to global error handler middleware
    }
}


/* ***************************
 *  Show inventory management page
 * ************************** */
invCont.showManagement = async function (req, res) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationSelect,
        message: req.flash ? req.flash('message') : null
    })
}


/* ***************************
 *  Show add classification form
 * ************************** */
invCont.showAddClassification = async function (req, res) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        message: req.flash ? req.flash('message') : null
    })
}


/* ***************************
 *  Add new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
    try {
        // Si hay errores de validación, renderiza el formulario con errores
        if (req.errors && req.errors.length > 0) {
            let nav = await utilities.getNav()
            return res.render("inventory/add-classification", {
                title: "Add New Classification",
                nav,
                classification_name: req.body.classification_name,
                errors: req.errors
            })
        }


        const { classification_name } = req.body


        // Insertar en base de datos
        await invModel.addClassification(classification_name)


        // Flash message de éxito
        req.flash('message', `${classification_name} classification was successfully added.`)


        // Redireccionar a management
        res.redirect('/inv')
    } catch (error) {
        // Manejar error
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            classification_name: req.body.classification_name,
            errors: [{ msg: 'Error adding classification. Please try again.' }]
        })
    }
}



/* ***************************
 *  Show add vehicle form
 * ************************** */
invCont.showAddInventory = async function (req, res) {
    let nav = await utilities.getNav()
    let classifications = await invModel.getClassifications()
    res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classifications,
        message: req.flash ? req.flash('message') : null
    })
}


/* ***************************
 *  Add new vehicle
 * ************************** */
invCont.addInventory = async function (req, res) {
    try {
        const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body


        // Insert vehicle into database
        await invModel.addInventory({
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })


        // Success - flash message and redirect
        req.flash('message', 'Vehicle added successfully!')
        res.redirect('/inv')
    } catch (error) {
        // Error - render form with sticky data
        let nav = await utilities.getNav()
        let classifications = await invModel.getClassifications()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)


        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            classifications,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id,
            errors: [{ msg: 'Error adding vehicle. Please correct all fields and try again.' }]
        })
    }
}



/* ***************************
 *  Show edit vehicle form
 * ************************** */
invCont.showEditInventory = async function (req, res, next) {
    try {
        const invId = req.params.invId
        const vehicle = await invModel.getInventoryById(invId)
        const classifications = await invModel.getClassifications()
        let nav = await utilities.getNav()
        res.render("inventory/edit-inventory", {
            title: "Edit Vehicle",
            nav,
            vehicle,
            classifications
        })
    } catch (error) {
        next(error)
    }
}


/* ***************************
 *  Update vehicle
 * ************************** */
invCont.editInventory = async function (req, res) {
    try {
        const {
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        } = req.body
        await invModel.updateInventory({ inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id })
        req.flash("message", "Vehicle updated!")
        res.redirect("/inv")
    } catch (error) {
        req.flash("message", "Error updating vehicle.")
        res.redirect("/inv")
    }
}


/* ***************************
 *  Delete vehicle
 * ************************** */
invCont.deleteInventory = async function (req, res) {
    try {
        await invModel.deleteInventory(req.body.inv_id)
        req.flash("message", "Vehicle deleted!")
        res.redirect("/inv")
    } catch (error) {
        req.flash("message", "Error deleting vehicle.")
        res.redirect("/inv")
    }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * Unit 5, Select Inv Item activity
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
