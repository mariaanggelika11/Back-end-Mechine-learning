const tf = require("@tensorflow/tfjs-node");
const { getModel } = require("./loadModel");

const runInference = async (imageBuffer) => {
  const imageTensor = tf.node.decodeImage(imageBuffer).resizeNearestNeighbor([224, 224]).expandDims(0).toFloat().div(tf.scalar(255.0)); // Normalize

  const model = getModel();
  const prediction = model.predict(imageTensor);
  const result = await prediction.data();

  return result[0]; // return confidence score
};

module.exports = { runInference };
