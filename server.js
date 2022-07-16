const MLFunctions = require("./models/prediction.model");

const data = [
  1, 2, 3, 4, 5, 6, 79, 11, 23.5, 12, 14, 1, 2, 3, 4, 5, 6, 79, 11, 23.5, 12,
  14, 1, 2, 3, 4, 5, 6, 79, 11, 23.5, 12, 14,
];

let window_size = 5;
let sma_vec = MLFunctions.computeSMA(data, window_size);

let inputs = sma_vec.map((item) => {
  return item["set"];
});
let outputs = sma_vec.map((item) => {
  return item["avg"];
});

//to be configured
const model_params = {
  inputs: inputs,
  outputs: outputs,
  training_size: 70,
  n_epochs: 5,
  learning_rate: 0.01,
  n_layers: 4,
  window_size: window_size,
};

let callback = function (epoch, log) {
  console.log(
    "Epoch :" +
      (epoch + 1) +
      " (of " +
      model_params["n_epochs"] +
      ")" +
      ", loss: " +
      log.loss
  );
};

async function run() {
  let model = await MLFunctions.trainModel(model_params, callback);
  console.log(model);
  let pred_X = [inputs[inputs.length - 1]];
  let predArr = [];
  let pred_Y = 0;

  for (let i = 0; i < 12; i++) {
    if (i !== 0) {
      let temp_pred_X = [...pred_X][0];
      temp_pred_X.shift();
      temp_pred_X.push(pred_Y[0]);
      pred_X = [temp_pred_X];
    }
    pred_Y = await MLFunctions.makePredictions(
      pred_X,
      model["model"],
      model["normalize"]
    );
    predArr.push(pred_Y[0]);
  }
  console.log(predArr);
  return predArr;
}

run();
