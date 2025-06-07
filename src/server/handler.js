const { runInference } = require("../services/inferenceService");
const { storeData } = require("../services/storeData");
const { v4: uuidv4 } = require("uuid");
const { getAllHistories } = require("../services/storeData");

const predictHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Tidak ada gambar yang diunggah",
      });
    }

    const imageBuffer = req.file.buffer;

    let prediction;
    try {
      prediction = await runInference(imageBuffer);
    } catch (error) {
      return res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
    }

    const result = prediction > 0.58 ? "Cancer" : "Non-cancer";
    const suggestion = result === "Cancer" ? "Segera periksa ke dokter!" : "Penyakit kanker tidak terdeteksi.";

    // ✅ Tambahkan validasi ini
    if (!result || !suggestion) {
      return res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      });
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const data = { id, result, suggestion, createdAt };

    await storeData(data);

    res.status(201).json({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
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
