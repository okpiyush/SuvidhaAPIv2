const Announcement=require("../models/Announcement");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    console.log(req.body.announcement);
    const anno = new Announcement();
    try{
        anno.announcement=req.body.announcement;
        anno.featured=req.body.featured;
        await anno.save();
        res.send(anno);
    }catch(err){
        console.log(err);
    }
})



//get the featured announcement
router.get("/",async (req,res)=>{
    try{
        const anno = await Announcement.findOne({featured:true});
        res.send({"data":anno.announcement});
    }catch(err){
        res.status(500).send(err);
    }
})




//get all the announcements
router.get("/getall",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const anno = await Announcement.find();
        res.send(anno);
    }catch(err){
        res.status(500).send(err);
    }
})


router.delete("/delete/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const announcements= await Announcement.findByIdAndDelete(req.params.id);
        // send the product to test if it gets deleted
        res.status(200).json(announcements);
    }catch(err){
        res.status(500).send(err)
    }
})


module.exports=router;


