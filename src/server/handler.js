const { runInference } = require("../services/inferenceService");
const { storeData } = require("../services/storeData");
const { v4: uuidv4 } = require("uuid");
const { getAllHistories } = require("../services/storeData");

const predictHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "No image uploaded" });
    }

    const imageBuffer = req.file.buffer;

    let prediction;
    try {
      prediction = await runInference(imageBuffer);
    } catch (error) {
      // Tangani error dari TensorFlow saat prediksi (misalnya shape tidak cocok)
      return res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
    }

    const result = prediction > 0.58 ? "Cancer" : "Non-cancer";
    const suggestion = result === "Cancer" ? "Segera periksa ke dokter!" : "Tetap jaga pola hidup sehat!";

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const data = { id, result, suggestion, createdAt };
    await storeData(data);

    res.status(200).json({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ status: "fail", message: error.message });
  }
};
const getHistoriesHandler = async (req, res) => {
  try {
    const histories = await getAllHistories();

    res.status(200).json({
      status: "success",
      data: histories,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Gagal mengambil data riwayat",
    });
  }
};

module.exports = {
  predictHandler,
  getHistoriesHandler,
};
