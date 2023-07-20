const router=require("express").Router();
const {verifyTokenAndAdmin}=require("./verifyToken");
const MultiRegression = require("../MLLogics/MultiRegression");

router.post("/predicted",verifyTokenAndAdmin,async(req,res)=>{
    //check for the data set!
    const {twodArray}=req.body;
    console.log(twodArray);
    const {toFind}=req.body;
    console.log(toFind);
    if(!twodArray || !toFind){
      res.status(401).json("No Data Found")
    }else{
      let multiReg=MultiRegression(twodArray,toFind);
      res.status(200).json(multiReg);
    }
  //
});
module.exports=router;