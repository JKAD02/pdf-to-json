const express = require("express");
const pdfController = require("../controllers/pdfController");

const router = express.Router();

router.get("/pdf-to-json", pdfController.extractPdfToJson);

module.exports = router;
