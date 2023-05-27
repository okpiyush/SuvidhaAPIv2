const Announcement=require("../models/Announcement");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

router.post("/",async(req,res)=>{
    console.log(req.body.announce);
    const anno = new Announcement();
    try{
        anno.announcement=req.body.announce;
        await anno.save();
        res.send(anno);
    }catch(err){
        console.log(err);
    }
})
router.get("/",async (req,res)=>{
    try{
        const anno = await Announcement.findOne();
        res.send({"data":anno.announcement});
    }catch(err){
        res.status(500).send(err);
    }
})



module.exports=router;


