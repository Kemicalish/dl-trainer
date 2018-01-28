import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'material-ui/Button';


import {
  Array1D, Array2D, ENV, Graph, Session, SGDOptimizer, CostReduction,
  InCPUMemoryShuffledInputProviderBuilder
} from 'deeplearn';

import gen from 'random-seed';

import {log, createForwardProp} from './dl';
import {train} from './train';


const rand = gen.create('my-seed');

const m = 100;
const learningRate = 0.003;
const epochs = 1000;
const hiddenLayersSizes = [12];

const testVal = [
  [81, 97],
  [2, 3]
];

const data = new Array(m).fill(1)
  .map(() => [rand.random(), rand.random()])
  .map(xs => xs.map(x => x * 100))
  //.map(([x1, x2]) => [Math.floor(x1), Math.floor(x2)])
  .map(([x1, x2]) => [x1 * x2, x1, x2]);

const inputs = data.map(([y, ...x]) => [...x]);
const labels = data.map(([y, ...rest]) => [y]);



console.log(data[0]);
console.log(data[1]);
console.log(data[2]);


 const onTrainClick = async () =>{
  const predict = await train(inputs, labels, learningRate, hiddenLayersSizes, epochs);
  predict(testVal);
 };

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button raised color="primary" onClick={onTrainClick}>
          Train
        </Button>
        <div id="app"></div>
        <div id="cost-value">waiting...</div>
        <div id="min-cost">waiting...</div>
        <div id="container"></div>
      </div>
    );
  }
}

export default App;
