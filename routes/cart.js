const router=require("express").Router();
const Cart = require("../models/Cart");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifyToken");


//CREATE and add new product 
router.post("/",verifyTokenAndAuthorization,async (req,res)=>{
    const newProduct = new Cart(req.body);
    console.log(req.body);
    try{
        const saved= await newProduct.save();
        res.status(200).json(saved);
    }catch(Err){
        res.status(500).json(Err);
    }
})


//update cart
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updatedCart=await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
                
            },
            {new:true}
        );
        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
});


//delete Cart
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
})


// get a product and its details
router.get("/find/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const cart = await Cart.findById(req.params.id);
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err);
    }
})
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

//get all cart
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
        let carts= await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
})


// //get cart stats 


router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data=await Cart.aggregate([
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