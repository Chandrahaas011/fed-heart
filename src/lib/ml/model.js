import * as tf from '@tensorflow/tfjs';

export function createModel(inputShape) {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
    inputShape: [inputShape]
  }));
  
  model.add(tf.layers.dense({
    units: 8,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

export async function trainLocalModel(model, data, epochs = 5) {
  const xs = tf.tensor2d(data.map(d => d.features));
  const ys = tf.tensor2d(data.map(d => [d.label]));

  const history = await model.fit(xs, ys, {
    epochs,
    batchSize: 32,
    silent: true
  });

  xs.dispose();
  ys.dispose();

  return {
    weights: model.getWeights(),
    accuracy: history.history.acc[history.history.acc.length - 1]
  };
}
