const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore();
const collection = firestore.collection("predictions");

const storeData = async (data) => {
  await collection.doc(data.id).set(data);
};

const getAllHistories = async () => {
  const snapshot = await collection.orderBy("createdAt", "desc").get();
  const histories = [];
  snapshot.forEach((doc) => histories.push(doc.data()));
  return histories;
};

module.exports = { storeData, getAllHistories };
