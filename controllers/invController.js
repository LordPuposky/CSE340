const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    
    // Validate if data exists and has items
    if (!data || data.length === 0) {
      const grid = '<p class="notice">Sorry, no vehicles found in this classification.</p>'
      let nav = await utilities.getNav()
      res.render("./inventory/classification", {
        title: "No Vehicles Found",
        nav,
        grid,
      })
      return
    }
    
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
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

module.exports = invCont
