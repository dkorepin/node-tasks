import express from "express";

export const baseRuter = express.Router({ mergeParams: true });
baseRuter.get("/", (req, res) => {
  res.json({ isOk: true });
});
