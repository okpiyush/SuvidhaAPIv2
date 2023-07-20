const router =require('express').Router();

const Slideshow=require("../models/Slideshow")
const {verifyTokenAndAdmin, verifyToken}=require("./verifyToken");


//get request to get all the slides
router.get("/",async(req,res)=>{
    try{
        const slides=await Slideshow.find();
        res.status(200).json(slides);
    }catch(err){
        console.log(err);
    }
})

router.delete("/delete/:id",async(req,res)=>{
    
    try{
        const deleted= await Slideshow.findByIdAndDelete(req.params.id);
        res.status(200).json(deleted);
    }catch(err){
        console.log(err);
    }
})

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const slide = new Slideshow(req.body);
    try{
        const saved=await slide.save();
        res.status(200).json(saved);
    }catch(Err){
        console.log(Err);
    }
})


module.exports=router;