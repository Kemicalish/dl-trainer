import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';

import {
  Array1D, Array2D, ENV, Graph, Session, SGDOptimizer, CostReduction,
  InCPUMemoryShuffledInputProviderBuilder
} from 'deeplearn';

import gen from 'random-seed';

import {log, createForwardProp} from './dl';
import {train} from './train';


const rand = gen.create('my-seed');

const m = 100;
const defaultLearningRate = 0.003;
const defaultEpochs = 1000;
const defaultLayerSizes = '12';

const testVal = [
  [81, 97],
  [2, 3]
];

const data = new Array(m).fill(1)
  .map(() => [rand.random(), rand.random()])
  .map(xs => xs.map(x => x * 100))
  .map(([x1, x2]) => [Math.floor(x1), Math.floor(x2)])
  .map(([x1, x2]) => [x1 * x2, x1, x2]);

const inputs = data.map(([y, ...x]) => [...x]);
const labels = data.map(([y, ...rest]) => [y]);



console.log(data[0]);
console.log(data[1]);
console.log(data[2]);

 const options = {
   costComponent: 'cost-logger', 
   minCostComponent: 'min-cost-logger'
} 

 const onTrainClick = async () =>{
  const learningRate = document.getElementById('learning-rate-input').value;
  const epochs = document.getElementById('epochs-input').value;
  const hiddenLayerSizes = document.getElementById('layer-sizes-input').value.split(',').map(s => parseInt(s));

  const predict = await train(inputs, labels, learningRate, hiddenLayerSizes, epochs, options);
  predict(testVal);
 };
 
const theme = createMuiTheme();

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  trainRow: {
    display: 'flex'
  },
  trainRowLeft: {
    flex: 1
  },
  trainRowRight: {
    flex: 3
  },
});


class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Card >
          <CardContent>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="learning-rate-input">Learning Rate</InputLabel>
              <Input id="learning-rate-input" defaultValue={defaultLearningRate}/>
              <FormHelperText>Adjust the learning rate</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="epochs-input">Epochs</InputLabel>
              <Input id="epochs-input" defaultValue={defaultEpochs}/>
              <FormHelperText>Number of epochs</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="layer-sizes-input">Layers</InputLabel>
              <Input id="layer-sizes-input" defaultValue={defaultLayerSizes}/>
              <FormHelperText>Layer sizes sperated by commas</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <Button raised color="primary" onClick={onTrainClick}>
                Train
              </Button>
            </FormControl>
          </CardContent>
        </Card>
        <Card>
        </Card>
        <div className={classes.trainRow}>
          <div  className={classes.trainRowLeft}>
            <CardContent>
              <Typography className={classes.title}>Cost</Typography>
              <Typography id="cost-logger" type="headline" component="h2">
                waiting...
              </Typography>
            </CardContent>
            <CardContent>
              <Typography className={classes.title}>Min Cost</Typography>
              <Typography id="min-cost-logger" type="headline" component="h2">
                waiting...
              </Typography>
            </CardContent>
            <CardContent>
              <Typography className={classes.title}>Data Samples</Typography>
              
                <pre>
                  {JSON.stringify(data.filter((x, i) => i < 3 ), null, 4)}
                </pre>
 
            </CardContent>
        </div>
        <div className={classes.trainRowRight}>
          <div id="container"></div>
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
