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

router.post("/predict", (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) return next(err); // ✅ lempar ke global error handler
    handler.predictHandler(req, res, next); // ✅ jalanin handler jika tidak error
  });
});

router.get("/histories", (req, res, next) => {
  handler.getHistoriesHandler(req, res, next);
});

module.exports = router;
