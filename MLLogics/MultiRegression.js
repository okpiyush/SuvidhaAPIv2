const regression = require('regression');

const MultiRegression=(linearPoints,toFind)=>{
    console.log('Linear fit with linear points:\n');
    const regressionModel = regression.linear(linearPoints);

    console.log('\nPredicting for an array of points:\n');
    const inputPoints =toFind;// Array of points to predict

    const predictions = inputPoints.map((point) => {
      const [x] = point;
      const predictedValue = regressionModel.predict(x);
      return predictedValue;
    });
    return predictions;
}
module.exports=MultiRegression;