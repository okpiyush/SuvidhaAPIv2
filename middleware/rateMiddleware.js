const Rate= require("../models/Rate");
const axios = require('axios');
const updateRateMiddleware = async (req, res, next) => {
    const options = {
        method: 'GET',
        url: 'https://exchangerate-api.p.rapidapi.com/rapid/latest/INR',
        headers: {
          'X-RapidAPI-Key': process.env.conversionAPI,
          'X-RapidAPI-Host': 'exchangerate-api.p.rapidapi.com'
        }
      };
    try {
      let rateData = await Rate.findOne();
     //rate exists and the data is more than 24 hrs old
      if (rateData && (Date.now() - rateData.lastUpdated) > 24 * 60 * 60 * 1000) {
        // console.log("updated after 24hrs");
        try {
            const response = await axios.request(options);
            rateData.rate=response.data.rates.USD.toString();
            rateData.lastUpdated = Date.now();
        } catch (error) {
            console.error(error);
        }
        await rateData.save();
      } else if (!rateData) {
        // data doesnt exist
        // console.log("updated because didnt exist");
        rateData=new Rate();
        try {
            const response = await axios.request(options);
            rateData.rate=response.data.rates.USD.toString();
            rateData.lastUpdated = Date.now();
        } catch (error) {
            console.error(error);
        }
        await rateData.save();
      }else{
        // console.log("didnt update")
      }
    } catch (error) {
      // Handle error if API call or database operation fails
      console.error('Failed to update rate:', error);
    }
  
    next();
  };




  module.exports=updateRateMiddleware
