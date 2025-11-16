const express = require('express');
const path = require("path");
const router = express.Router();

// Archivos estáticos
router.use(express.static(path.join(__dirname, "../public")));

// Ruta del error para el footer
router.get("/error", (req, res, next) => {
    next(new Error("This is a deliberate error triggered from the footer link!"));
});

module.exports = router;



