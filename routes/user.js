const router=require("express").Router();
const User = require("../models/User");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifyToken");

const CryptoJS=require("crypto-js")
//get test
router.get("/usertest",(req,res)=>{
    res.send("test successfull");
})

//post test
router.post("/userposttest",(req,res)=>{
   console.log("you hit userpost route")
   let username=req.body.username;
   res.send("Your name is "+username);
})







//update user and it's password
router.put("/:id",verifyTokenAndAuthorization,async (req,res)=>{
    
    //password updation
    if(req.body.password){
        req.body.password=CryptoJS.AES.encrypt(req.body.password,process.env.secretKey).toString();
    }

    //user updation
    try{
        const updatedUser=await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
                
            },
            {new:true}
        );
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});


//delete user
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.send(200).json("User has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
})


//get user 
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,...other}=user._doc
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})


//get all user 
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query=req.query.new
    try{
        //limiting the users and their numbers
        const users=query?await User.find().limit(5).sort({_id:-1}) : await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err);
    }
})


//get user stats 


router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data=await User.aggregate([
            {
                $match:
                {
                    createdAt: 
                    {
                        $gte:lastYear 
                    }
                }
            },
            {
                $project:
                {
                    month:
                    {
                        $month:"$createdAt"
                    },
                },
            },
            {
                $group:
                {
                    _id:"$month",
                    total:
                    {
                        $sum:1
                    }
                }
            }
        ])
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router