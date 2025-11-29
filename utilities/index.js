const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
    let data = await invModel.getClassifications(); // data is now an array
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.forEach((row) => {
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
            // Price formatting with dollar and NO decimals
            const formattedPrice = `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(vehicle.inv_price)}`;
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
 * Build the vehicle detail view HTML
 * ******************************************** */
Util.buildDetailView = async function (vehicle) {
    if (!vehicle) {
        return '<p class="notice">Sorry, we could not find that vehicle.</p>';
    }
    // Format price and mileage with commas and $ (USD) - NO decimals in price
    const formattedPrice = "$" + new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(vehicle.inv_price);
    const formattedMileage =
        new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(vehicle.inv_miles) + " miles";


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
 * Build classification select list for forms
 * *************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    try {
        let data = await invModel.getClassifications()
        let classificationList = '<select name="classification_id" id="classificationList" required>'
        classificationList += "<option value=''>Choose a Classification</option>"
        data.forEach((row) => {
            classificationList += '<option value="' + row.classification_id + '"'
            if (classification_id != null && row.classification_id == classification_id) {
                classificationList += " selected "
            }
            classificationList += ">" + row.classification_name + "</option>"
        })
        classificationList += "</select>"
        return classificationList
    } catch (error) {
        console.error("buildClassificationList error " + error)
        return ""
    }
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/* ****************************************
 * Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 * Check Account Type (Authorization)
 * ************************************ */
Util.checkAuthorization = (req, res, next) => {
    // Check if the user is logged in and if the account type is Employee or Admin
    if (res.locals.loggedin && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {
        next(); // Authorized, proceed to the next middleware or route handler
    } else {
        // Not authorized, flash message and redirect to login
        req.flash("notice", "You do not have the necessary authorization to access this area.");
        return res.redirect("/account/login");
    }
}

module.exports = Util;