import * as tf from '@tensorflow/tfjs';

/**
 * Performs Federated Averaging (FedAvg) on a set of model weights.
 * weightsList is an array of weight arrays (one from each hospital).
 */
export function aggregateWeights(weightsList) {
  if (!weightsList || weightsList.length === 0) return null;

  const numModels = weightsList.length;
  const numLayers = weightsList[0].length;
  const aggregatedWeights = [];

  for (let i = 0; i < numLayers; i++) {
    // Collect the i-th layer from all models
    const layerWeights = weightsList.map(w => w[i]);
    
    // Average the weights for this layer
    const averagedLayer = tf.tidy(() => {
      let sum = layerWeights[0];
      for (let j = 1; j < numModels; j++) {
        sum = sum.add(layerWeights[j]);
      }
      return sum.div(numModels);
    });

    aggregatedWeights.push(averagedLayer);
  }

  return aggregatedWeights;
}

/**
 * Calculates global accuracy by testing the global model against all data.
 */
export function evaluateGlobalModel(model, allData) {
  const xs = tf.tensor2d(allData.map(d => d.features));
  const ys = tf.tensor2d(allData.map(d => [d.label]));

  const result = model.evaluate(xs, ys, { silent: true });
  // result[0] is loss, result[1] is accuracy (based on compile metrics)
  const accuracy = result[1].dataSync()[0];

  xs.dispose();
  ys.dispose();
  
  return accuracy;
}
