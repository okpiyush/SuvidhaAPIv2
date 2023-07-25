const router=require("express").Router();
const Product = require("../models/Product");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifyToken");


//CREATE and add new product 
router.post("/",verifyTokenAndAdmin,async (req,res)=>{
    const newProduct = new Product(req.body);
    try{
        const saved= await newProduct.save();
        res.status(200).json(saved);
    }catch(Err){
        res.status(500).json(Err);
    }
})


//update Product
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updatedProduct=await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
                
            },
            {new:true}
        );
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});


//delete user
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
})


// get a product and its details
router.get("/find/:id",async(req,res)=>{
    try{
        const Products = await Product.findOne({"_id":req.params.id});
        res.status(200).json(Products);
    }catch(err){
        res.status(500).json(err);
    }
})


// get all Products 
router.get("/",async(req,res)=>{
    const qnew= req.query.new;
    const qcat=req.query.category;
    const featured=req.query.featured;
    try{
        let products;
        //new gives us the new 5 products
        if(qnew){
            products=await Product.find().sort({createdAt:-1}).limit(5);

        }else if(qcat){
            //category gives us all items of 1 category
            products=await Product.find({
                categories:{
                    $in:[qcat]
                }
            });
        }else if(featured){
            //featured gives us the featured 8 products
            products=await Product.find({
                featured:featured
            }).limit(8)
        }else {
            products= await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
})


//get user stats 
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data=await Product.aggregate([
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

//get all specific products
router.get("/getcustom",verifyTokenAndAuthorization,async (req,res)=>{
    const {getproduct}=req.body;
    //finding multiple at once
    const pro= await Product.find(
        {
            "_id":{
                "$in":getproduct
            }   
        }     
    )
    res.send(pro);
})
module.exports = router