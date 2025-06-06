const tf = require("@tensorflow/tfjs-node");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");

let model;

const loadModel = async () => {
  const bucketName = process.env.GCS_BUCKET_NAME;
  const modelDir = path.resolve(__dirname, "../../model");

  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  const storage = new Storage();
  const files = ["model.json", "group1-shard1of4.bin", "group1-shard2of4.bin", "group1-shard3of4.bin", "group1-shard4of4.bin"];

  for (const file of files) {
    const dest = path.join(modelDir, file);
    await storage.bucket(bucketName).file(file).download({ destination: dest });
  }

  model = await tf.loadGraphModel(`file://${modelDir}/model.json`);
  console.log("Model loaded successfully.");
};

const getModel = () => model;

module.exports = { loadModel, getModel };
