const ARIMA = require("arima");

function runModel(data) {
  //modifiable parameters
  const sarima = new ARIMA({
    p: 2,
    d: 1,
    q: 2,
    P: 1,
    D: 0,
    Q: 1,
    s: 12,
    verbose: false,
  }).train(data);

  // Predict next 12 values
  const [pred, errors] = sarima.predict(12);
  console.log("ARIMA");
  console.log(pred);
  console.log(errors);
  return pred;
}

exports.runModel = runModel;
