const pdfService = require("../services/pdfService");
const logger = require("../utils/logger");

exports.extractPdfToJson = async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res
        .status(400)
        .json({ status: "fail", message: "URL parameter is required" });
    }

    logger.info(`Received request to process PDF from URL: ${url}`);

    const result = await pdfService.processPdf(url);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    logger.error(`Request failed: ${err.message}`);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
