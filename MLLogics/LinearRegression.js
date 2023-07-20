const regression=require('regression');
const linearPoints=[[1,1],[3,4],[7,12],[13,18]];

const linearPointsSlightlyOff=[[1,1],[3,4],[7,13],[13,17]];
console.log('linearFit with linear Points: \n');
const regressionModel=regression.linear(linearPoints);
console.log(`${regressionModel.predict(42)}`);