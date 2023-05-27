const router=require("express").Router();
const Order = require("../models/Order");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifyToken");


//CREATE and add new Order 
router.post("/",verifyTokenAndAuthorization,async (req,res)=>{
    const newOrder = new Order(req.body);
    try{
        const saved= await newOrder.save();
        res.status(200).json(saved);
    }catch(Err){
        res.status(500).json(Err);
    }
})


//update Order
router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const updatedOrder=await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
                
            },
            {new:true}
        );
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});


//delete user
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
})


// get a Order and its details
router.get("/find/:userid",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const Orders = await Order.findOne({userId:req.params.userid});
        res.status(200).json(Orders);
    }catch(err){
        res.status(500).json(err);
    }
})


// get all Orders 
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const qnew= req.query.new;
    const qcat=req.query.category;
    try{
        let Orders;
        //new gives us the new 5 Orders
        if(qnew){
            Orders=await Order.find().sort({createdAt:-1}).limit(5);

        }else if(qcat){
            //category gives us all items of 1 category
            Orders=await Order.find({
                categories:{
                    $in:[qcat]
                }
            });
        }else{
            Orders= await Order.find();
        }
        res.status(200).json(Orders);
    }catch(err){
        res.status(500).json(err);
    }
})


//get order stats (GIves number of orders in a particular month)
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date();
    const lastYear=new Date(date.setFullYear(date.getFullYear()-1));
    try{
        const data=await Order.aggregate([
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



//Get Monthly INCOME



router.get("/income",verifyTokenAndAdmin,async (req,res)=>{
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1));
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));
    console.log(previousMonth);
    try{
        const income=await Order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},sales:"$amount",
                },
            },
            {
                $group:{
                _id:"$month",
                total:{$sum:"$sales"},
                }
            },
        ]);
        res.status(200).json(income);


    }catch(Err){
        res.status(500).send(Err)
    }
})
module.exports = router