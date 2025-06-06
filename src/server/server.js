require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const { loadModel } = require("../services/loadModel");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(routes);

// Tambahkan middleware error handler di bawah ini
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    // Jika file lebih dari 1MB
    return res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  }

  if (err.message === "File must be an image") {
    // Jika file bukan image
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }

  return res.status(500).json({
    status: "fail",
    message: err.message || "Internal Server Error",
  });
});

// Load model dan jalankan server
loadModel()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to load model:", err);
  });
