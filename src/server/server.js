require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { loadModel } = require("../services/loadModel");

const app = express();
const port = process.env.PORT || 8080;

// 🔧 Konfigurasi CORS
const allowedOrigins = ["*", "http://astral-chassis-461908-e5.et.r.appspot.com", "https://astral-chassis-461908-e5.et.r.appspot.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

// 🛠️ Global Error Handler - CORS headers tetap dikirim
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

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

  // Fallback Error
  return res.status(400).json({
    status: "fail",
    message: "Terjadi kesalahan dalam melakukan prediksi",
  });
});

// ✅ Jalankan server setelah model dimuat
loadModel()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to load model:", err);
  });
