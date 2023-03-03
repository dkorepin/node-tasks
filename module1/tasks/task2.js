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

readStream.pipe(helper(config)).pipe(writeStream);
