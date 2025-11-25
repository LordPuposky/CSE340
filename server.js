/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/

const cookieParser = require("cookie-parser");
const express = require("express")
const env = require("dotenv").config()
const path = require("path")
const session = require("express-session")
const pool = require('./database/')


/* ***********************
 * Create Express App
 *************************/
const app = express()

/* ***********************
 * View Engine Setup & Static Files
 * MUST come first
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Middleware
 *************************/

/* Body parser middleware setup
  * In modern versions of Node and Express (4.16+), body parsing functionality is built-in.
  * The "body-parser" package is no longer required. I use express.json() and express.urlencoded().
  * This makes my code cleaner and uses the recommended approach for handling request bodies.
*/
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(utilities.checkJWTToken)

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes - Load AFTER all middleware
 *************************/
const utilities = require("./utilities")
const baseController = require("./controllers/baseController")
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

// Index route (Home, MVC)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Static routes
app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})