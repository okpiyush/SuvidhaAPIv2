const regression = require('regression');

const MultiRegression=(linearPoints,toFind)=>{
    const regressionModel = regression.linear(linearPoints);
    const inputPoints =toFind;// Array of points to predict

    const predictions = inputPoints.map((point) => {
      const [x] = point;
      const predictedValue = regressionModel.predict(x);
      return predictedValue;
    });
    return predictions;
}
module.exports=MultiRegression;