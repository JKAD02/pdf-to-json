const { PdfDataReader } = require("pdf-data-parser");
const logger = require("../utils/logger");

exports.processPdf = (url) => {
  return new Promise((resolve, reject) => {
    let reader = new PdfDataReader({ url });

    let rows = [];

    reader.on("data", (row) => {
      logger.debug(`Row data: ${JSON.stringify(row)}`);
      rows.push(row);
    });

    reader.on("end", () => {
      logger.info("Finished processing PDF");

      const filteredRows = rows.filter((row) => row.length >= 9);

      const rowsWithObj = filteredRows.slice(1).map((row) => {
        const obj = {};

        let count = 1;

        for (let i = 0; i < row.length; i++) {
          if (
            filteredRows[0][i] in obj ||
            `${filteredRows[0][i]}-${count}` in obj
          ) {
            obj[`${filteredRows[0][i]}-${count}`] = filteredRows[0][i];
            delete obj[filteredRows[0][i]];
            count++;
            obj[`${filteredRows[0][i]}-${count}`] = row[i];
          } else {
            obj[filteredRows[0][i]] = row[i];
          }
        }

        return obj;
      });

      resolve({
        title: rows[0][0],
        date: rows[1][0],
        data: rowsWithObj,
      });
    });

    reader.on("error", (err) => {
      logger.error(`Error processing PDF: ${err.message}`);
      reject(new Error("Error processing PDF"));
    });
  });
};
