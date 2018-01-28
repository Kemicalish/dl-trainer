import {Array2D} from 'deeplearn';

export const log = (name, t) => console.log(name, t.shape);

const createAddVar = g => (name, rows, cols) => {
    const V = g.variable(name, Array2D.randNormal([rows, cols]));
    log(name, V);
    return V;
};

const createComputeActivationLayer = g => (layerName, input, sizeNext, isFinal = false) => {
    const createVar = createAddVar(g);
    const size = input.shape[1];
    const W = createVar('W_' + layerName, size, sizeNext);
    const B = createVar('B_' + layerName, 1, sizeNext);
    const Z = g.add(g.matmul(input, W), B);
    log('Z_' + layerName, Z);
    if (isFinal)
        return Z;
    return g.sigmoid(Z);
};

export const createForwardProp = g => (X, Y, layers) => {
    const computeActivationLayer = createComputeActivationLayer(g);
    const fullLayers = [...layers, Y.shape[1]].map((size, id) => ({
        id,
        size,
        name: 'L' + id
    }));

    const activationReducer = (A, nextLayer) => {
        console.log('NEXT LAYER', nextLayer, A.shape);
        const newA = computeActivationLayer(nextLayer.name, A, nextLayer.size, nextLayer.id === fullLayers.length - 1);
        return newA;
    };

    return fullLayers.reduce(activationReducer, X);
};