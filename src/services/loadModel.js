require("dotenv").config(); // Wajib di baris pertama agar ENV tersedia

const tf = require("@tensorflow/tfjs-node");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

let model;

const loadModel = async () => {
  try {
    const bucketName = process.env.GCS_BUCKET_NAME;
    const modelDir = path.resolve(__dirname, "../../model");

    if (!bucketName) {
      throw new Error("GCS_BUCKET_NAME tidak ditemukan di environment variable");
    }

    // Buat folder jika belum ada
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    const storage = new Storage(); // Gunakan GOOGLE_APPLICATION_CREDENTIALS dari .env

    const files = ["model.json", "group1-shard1of4.bin", "group1-shard2of4.bin", "group1-shard3of4.bin", "group1-shard4of4.bin"];

    for (const file of files) {
      const dest = path.join(modelDir, file);
      const exists = fs.existsSync(dest);

      if (!exists) {
        console.log(`Downloading ${file} from bucket ${bucketName}...`);
        await storage.bucket(bucketName).file(file).download({ destination: dest });
      } else {
        console.log(`${file} already exists, skipping download.`);
      }
    }

    model = await tf.loadGraphModel(`file://${modelDir}/model.json`);
    console.log("✅ Model loaded successfully.");
  } catch (err) {
    console.error("❌ Failed to load model:", err);
  }
};

const getModel = () => {
  if (!model) throw new Error("Model belum dimuat. Pastikan loadModel() dipanggil di awal.");
  return model;
};

module.exports = { loadModel, getModel };
