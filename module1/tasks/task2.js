import fs from "fs";
import helper from "csvtojson";
import { csvFilePath, csvFileOutputPath } from "./helpers.js";

const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(csvFileOutputPath);

const config = {
  headers: ["book", "author", "amount", "price"],
  output: "json",
  delimiter: ";",
  quote: "off",
  checkType: true,
  colParser: {
    price: (item) => {
      return item?.length > 0
        ? Number.parseFloat(item.replace(/,/g, "."))
        : undefined;
    },
  },
};

const csv = helper(config);
csv.on('error', console.error);

readStream.pipe(csv).pipe(writeStream).on('error', console.error);
