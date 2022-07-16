const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const sk = require("scikitjs");
sk.setBackend(tf);
//Categories will follow, Food, Travel, Entertianment, Grocery, Utilities
const transactionNames = [
  "Fish and chips",
  "Chicken Rice",
  "Dumpling",
  "MRT",
  "Netflix",
  "Bus",
  "Karoake",
  "Fairprice",
  "Electricity",
  "Water bills",
];

const testTransactions = ["Chicken Rice", "Water bills", "Car"];

const labels = [
  "Food",
  "Food",
  "Food",
  "Travel",
  "Entertainment",
  "Travel",
  "Entertainment",
  "Grocery",
  "Utilities",
  "Utilities",
];

async function getClassification(
  transactionNames,
  labels,
  predicionStringArray /*array of size 1*/
) {
  const finalPrediction = await use.load().then(async (model) => {
    const sentences = [...transactionNames];
    return await model
      .embed(sentences)
      .then((embeddings) => {
        embeddings.print(true /* verbose */);
        return embeddings;
      })
      .then(async (embeddings) => {
        //   const clf = new sk.GaussianNB({ priors: tf.ones([512]) });
        const model = new sk.GaussianNB({});
        const y = [...labels];
        await model.fit(embeddings, y);

        const predictionEmbeddings = await use.load().then(async (model) => {
          const testSentences = [...predicionStringArray];
          const innerEmbedding = await model
            .embed(testSentences)
            .then((embeddings) => {
              return embeddings;
            });
          return innerEmbedding;
        });
        const predictions = await model.predict(predictionEmbeddings);
        predictions.print(true /* verbose */);
        const predictionInteger = await predictions.array();
        return predictionInteger[0];
      });
  });
  //   console.log(finalPrediction);
  return finalPrediction;
}

exports.getClassification = getClassification;

// console.log(X);
