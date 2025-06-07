const express = require("express");
const multer = require("multer");
const handler = require("./handler");

const router = express.Router();

const upload = multer({
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File must be an image"));
    }
    cb(null, true);
  },
});

// Biarkan error ditangani di middleware global
router.post("/predict", upload.single("image"), handler.predictHandler);

// Tetap tambahkan endpoint histories
router.get("/histories", handler.getHistoriesHandler);

module.exports = router;
