const router = require("express").Router();
const stripe = require("stripe")(process.env.stripekey);
const Rate=require("../models/Rate");
const axios = require('axios');

const encodedParams = new URLSearchParams();

router.post("/payment", async (req, res) => {
    console.log(req.body);
      //stripe code
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"usd"
    },
    (StripeErr,Striperes)=>{
        
        if(StripeErr){
            console.log("Error happened");
            res.status(200).json("Stripe Error");
        }else{
            res.status(200).json(Striperes);
        }
    }
    
    )   
});

router.get("/conversion/:val",async(req,res)=>{
    try{ 
        
        let val=req.params.val;
        const rate=await Rate.findOne();
        const conversionRate=val*parseFloat(rate.rate).toFixed(5);
        res.status(200).send({"val":conversionRate});
    }
    catch(err){
        res.status(500).send(err);
    }
})
router.get("/payment", async (req, res) => {
      try {
        res.send("This is a get Request link and not the post request")   
      } catch (error) {
          console.error(error);
      }  
      res.send("Wow");
});

module.exports = router;