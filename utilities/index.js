const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid = "";
    if (data.length > 0) {
        grid = '<div class="vehicle-grid">';
        data.forEach((vehicle) => {
        // Price formatting with dollar and commas
        const formattedPrice = `$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}`;
        grid += `<div class="grid-item">
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
            </a>
            <div class="namePrice">
                <h2>
                    <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                        ${vehicle.inv_make} ${vehicle.inv_model}
                    </a>
                </h2>
                <span class="price">${formattedPrice}</span>
            </div>
        </div>`;
        });
        grid += "</div>";
    } else {
        grid =
        '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

/* **********************************************
 *  Build the vehicle detail view HTML
 * ******************************************** */
Util.buildDetailView = async function (vehicle) {
    if (!vehicle) {
        return '<p class="notice">Sorry, we could not find that vehicle.</p>';
    }
    // Format price and mileage with commas and $ (USD)
    const formattedPrice = "$" + new Intl.NumberFormat("en-US").format(vehicle.inv_price);
    const formattedMileage =
        new Intl.NumberFormat("en-US").format(vehicle.inv_miles) + " miles";

    // Show everything with accessibility
    let detail = `
        <div class="vehicle-detail">
        <div class="vehicle-img">
            <img src="${vehicle.inv_image}" alt="Picture of ${vehicle.inv_make} ${vehicle.inv_model}" loading="lazy" />
        </div>
        <div class="vehicle-info">
            <h1>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h1>
            <h2 class="price">${formattedPrice}</h2>
            <p><strong>Mileage:</strong> ${formattedMileage}</p>
            <p><strong>Color:</strong> ${vehicle.inv_color}</p>
            <p><strong>Description:</strong> ${vehicle.inv_description}</p>
            <p><strong>Classification:</strong> ${vehicle.classification_name}</p>
        </div>
        </div>
    `;
    return detail;
};

/* ****************************************
 * Export utility functions
 **************************************** */
module.exports = Util;
