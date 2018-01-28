
/* Runs the example. */
import {log, createForwardProp} from './dl';
import {
    Array1D, Array2D, ENV, Graph, Session, SGDOptimizer, AdamOptimizer, CostReduction,
    InCPUMemoryShuffledInputProviderBuilder
} from 'deeplearn';
import {show} from './chart';

export const train = async (_inputs, _labels, learningRate, hiddenLayersSizes, epochs, options) => {
    const math = ENV.math;
    const g = new Graph();
    const forwardProp = createForwardProp(g);

    const m = _inputs.length;

    const featuresNum = _inputs[0].length;
    const labelsNum = _labels[0].length;

    const inputs = _inputs.map(x => Array2D.new([1, featuresNum], x));
    const labels = _labels.map(y => Array2D.new([1, 1], y));

    //TODO: add a0 = 1 (in each input) + give all matrix X,Y instead vectors
    const xShape = [1, featuresNum];
    const yShape = [1, labelsNum];
    const inputPH = g.placeholder('inputs', xShape);
    const labelPH = g.placeholder('labels', yShape);
    log('inputPH', inputPH);
    log('labelPH', labelPH);

    const model = forwardProp(inputPH, labelPH, hiddenLayersSizes);
    const costTensor = g.meanSquaredCost(labelPH, model);

    console.log(await inputs[0].data());
    console.log(await labels[0].data());

    const batchSize = m; //no minibatches

    const session = new Session(g, math);
    const optimizer = new SGDOptimizer(learningRate);

    // Shuffles inputs and labels and keeps them mutually in sync.
    const shuffledInputProviderBuilder = new InCPUMemoryShuffledInputProviderBuilder([inputs, labels]);
    const [inputProvider, labelProvider] = shuffledInputProviderBuilder.getInputProviders();

    const feedEntries = [
        { tensor: inputPH, data: inputProvider },
        { tensor: labelPH, data: labelProvider }
    ];

    const NUM_EPOCHS = epochs;
    const costList = [];
    const errorCost = 1000000000000000000000000;
    let minCost = errorCost;
    const chart = show(costList);
    const {costComponent, minCostComponent} = options;

    for (let i = 0; i < NUM_EPOCHS; i++) {
        const cost = session.train(costTensor, feedEntries, batchSize, optimizer, CostReduction.MEAN);
        const costVal = await cost.val();
        if(costVal > errorCost)
            throw new Error('Optimizer is either diverging or problem in cost function');

        if (i % 100 === 0) {
            console.log('cost epoch(' + i + '): ' + costVal);
            document.getElementById(costComponent).innerHTML = costVal;
        }

        if (i % 10 === 0) {
            chart.series[0].addPoint([i, costVal]);
        }

        if(costVal < minCost) {
            minCost = costVal;
            document.getElementById(minCostComponent).innerHTML = 'Ep ['+ i +']' + minCost;
        }
    }

    const predict = async testInputs => {
        testInputs.forEach(async x => {
            const input = Array2D.new([1, featuresNum], x);
            // session.eval can take NDArrays as input data.
            const testFeedEntries = [
                { tensor: inputPH, data: input }
            ];

            const testOutput = session.eval(model, testFeedEntries);
            console.log('---inference output---');
            const res = await testOutput.data();
            console.log('res: ', [...x, res]);
        });
    };

    return predict;
}