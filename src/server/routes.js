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
    if (err) {
      // Tangani error dari multer
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          status: "fail",
          message: "Payload content length greater than maximum allowed: 1000000",
        });
      }

      if (err.message === "File must be an image") {
        return res.status(400).json({
          status: "fail",
          message: "File harus berupa gambar",
        });
      }

      return res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam mengunggah file",
      });
    }

    // Lanjut ke handler jika tidak ada error
    handler.predictHandler(req, res, next);
  });
});

// ✅ ROUTE INI TETAP ADA
router.get("/histories", (req, res, next) => {
  handler.getHistoriesHandler(req, res, next);
});

module.exports = router;
