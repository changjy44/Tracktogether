const tf = require("@tensorflow/tfjs-node");

function computeSMA(data, window_size) {
  let r_avgs = [];
  let avg_prev = 0;

  for (let i = 0; i < data.length - window_size; i++) {
    let curr_avg = 0.0;
    let t = i + window_size;
    for (let j = i; j < t && j <= data.length; j++) {
      curr_avg += data[j] / window_size;
    }
    let sma = {
      set: data.slice(i, i + window_size),
      avg: curr_avg,
    };
    r_avgs.push(sma);
    avg_prev = curr_avg;
  }
  return r_avgs;
}

function normalizeTensorFit(tensor) {
  const maxval = tensor.max();
  const minval = tensor.min();
  const normalizedTensor = normalizeTensor(tensor, maxval, minval);
  return [normalizedTensor, maxval, minval];
}

function normalizeTensor(tensor, maxval, minval) {
  const normalizedTensor = tensor.sub(minval).div(maxval.sub(minval));
  return normalizedTensor;
}

function unNormalizeTensor(tensor, maxval, minval) {
  const unNormTensor = tensor.mul(maxval.sub(minval)).add(minval);
  return unNormTensor;
}

async function trainModel(model_params, callback) {
  console.log(model_params);
  let inputs = model_params["inputs"];
  let outputs = model_params["outputs"];
  let training_size = model_params["training_size"];
  let window_size = model_params["window_size"];
  let n_epochs = model_params["n_epochs"];
  let learning_rate = model_params["learning_rate"];
  let n_layers = model_params["n_layers"];

  //input dense layer
  const input_layer_shape = window_size;
  const input_layer_neurons = 64; //dynamic variable

  //LSTM
  const rnn_input_layer_features = 16; //dynamic variable
  const rnn_input_layer_timesteps =
    input_layer_neurons / rnn_input_layer_features;
  const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps]; //the shape have to match input layer's shape
  const rnn_output_neurons = 16; //number of neurons per LSTM's cell

  //output dense layer
  const output_layer_shape = rnn_output_neurons; //dense layer input dsize is same as LSTM cell
  const output_layer_neurons = 1;

  //training set
  //   let X = inputs.slice(0, Math.floor((training_size / 100) * inputs.length));
  //   let Y = outputs.slice(0, Math.floor((training_size / 100) * outputs.length));
  //   console.log(X);

  let X = inputs;
  let Y = outputs;
  //   const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10));
  //   const ys = tf
  //     .tensor2d(Y, [Y.length, 1])
  //     .reshape([Y.length, 1])
  //     .div(tf.scalar(10));
  const inputTensor = tf.tensor2d(X, [X.length, X[0].length]);
  const labelTensor = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]);
  const [xs, inputMax, inputMin] = normalizeTensorFit(inputTensor);
  const [ys, labelMax, labelMin] = normalizeTensorFit(labelTensor);

  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: input_layer_neurons,
      inputShape: [input_layer_shape],
    })
  );
  model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));

  let lstm_cells = [];
  for (let index = 0; index < n_layers; index++) {
    lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
  }

  model.add(
    tf.layers.rnn({
      cell: lstm_cells,
      inputShape: rnn_input_shape,
      returnSequences: false,
    })
  );

  model.add(
    tf.layers.dense({
      units: output_layer_neurons,
      inputShape: [output_layer_shape],
    })
  );

  model.compile({
    optimizer: tf.train.adam(learning_rate),
    loss: "meanSquaredError",
  });

  const hist = await model.fit(xs, ys, {
    batchSize: window_size,
    epochs: n_epochs,
    callbacks: {
      onEpochEnd: async (epoch, log) => {
        callback(epoch, log, model_params);
      },
    },
  });

  return {
    model: model,
    stats: hist,
    normalize: {
      inputMax: inputMax,
      inputMin: inputMin,
      labelMax: labelMax,
      labelMin: labelMin,
    },
  };
}

function makePredictions(X, model, dict_normalize) {
  console.log("pred_X: " + X);

  X = tf.tensor2d(X, [X.length, X[0].length]);
  const normalizedInput = normalizeTensor(
    X,
    dict_normalize["inputMax"],
    dict_normalize["inputMin"]
  );
  const model_out = model.predict(normalizedInput);
  const predictedResults = unNormalizeTensor(
    model_out,
    dict_normalize["labelMax"],
    dict_normalize["labelMin"]
  );

  console.log(predictedResults.dataSync());
  return Array.from(predictedResults.dataSync());
}

//modfiable parameters
const window_size = 6;
const training_size = 70;
const n_epochs = 5;
const learning_rate = 0.01;
const n_layers = 4;
const batch_size = 30;

async function runModel(data) {
  let sma_vec = computeSMA(data, window_size);

  let inputs = sma_vec.map((item) => {
    return item["set"];
  });
  let outputs = sma_vec.map((item) => {
    return item["avg"];
  });

  const model_params = {
    inputs: inputs,
    outputs: outputs,
    training_size: training_size,
    n_epochs: n_epochs,
    learning_rate: learning_rate,
    n_layers: n_layers,
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
  let model = await trainModel(model_params, callback);
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
    pred_Y = await makePredictions(pred_X, model["model"], model["normalize"]);
    predArr.push(pred_Y[0]);
  }
  console.log(predArr);
  return predArr;
}

module.exports = {
  computeSMA,
  trainModel,
  makePredictions,
  runModel,
};
