require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { loadModel } = require("../services/loadModel");

const app = express();
const port = process.env.PORT || 8080;

// ✅ Konfigurasi CORS secara eksplisit
const corsOptions = {
  origin: "https://astral-chassis-461908-e5.et.r.appspot.com", // Ganti dengan domain frontend Anda
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

// ✅ Tangani preflight (OPTIONS) requests
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());

// Routes
app.use(routes);

// 🔥 Middleware error handler global
app.use((err, req, res, next) => {
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
    message: "Terjadi kesalahan dalam melakukan prediksi",
  });
});

// Load model dan mulai server
loadModel()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to load model:", err);
  });
