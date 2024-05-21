const { PdfDataReader } = require("pdf-data-parser");
const logger = require("../utils/logger");
const axios = require("axios");

const keyMappings = {
  "Name of the Player": "PlayerName",
  "Given Name Family Name": "PlayerName",
};

const standardizeKeys = (row, headerRow) => {
  const obj = {};
  headerRow.forEach((header, index) => {
    const standardizedKey = keyMappings[header] || header;
    obj[standardizedKey] = row[index];
  });
  return obj;
};

const isValidUrl = async (url) => {
  try {
    const response = await axios.head(url);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};

exports.processPdf = (url) => {
  return new Promise(async (resolve, reject) => {
    if (!(await isValidUrl(url))) {
      logger.error(`Invalid URL: ${url}`);
      return reject(new Error("Invalid URL"));
    }

    let reader;
    try {
      reader = new PdfDataReader({ url });
    } catch (error) {
      logger.error(`Failed to initialize PDF reader for URL: ${url}`);
      return reject(new Error("Failed to initialize PDF reader"));
    }

    let rows = [];

    reader.on("data", (row) => {
      logger.debug(`Row data: ${JSON.stringify(row)}`);
      rows.push(row);
    });

    reader.on("end", () => {
      logger.info("Finished processing PDF");

      if (rows.length === 0) {
        return reject(new Error("No data found in PDF"));
      }

      const filteredRows = rows.filter((row) => row.length >= 9);

      const rowsWithObj = filteredRows
        .slice(1)
        .map((row) => standardizeKeys(row, filteredRows[0]));

      const title = rows[0][0];
      const date = rows[1][0];

      resolve({
        title,
        date,
        data: rowsWithObj,
      });
    });

    reader.on("error", (err) => {
      logger.error(`Error processing PDF: ${err.message}`);
      reject(new Error("Error processing PDF"));
    });
  });
};
