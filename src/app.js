const express = require("express");
const pdfRoutes = require("./routes/pdfRoutes");
const { errorHandler } = require("./utils/errorHandler");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());
app.use("/api/extract", pdfRoutes);

app.use(errorHandler);

module.exports = app;
