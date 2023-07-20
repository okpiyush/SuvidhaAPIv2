const router=require("express").Router();
const Wishlist=require("../models/Wishlist")
const User=require("../models/User");
const Product=require("../models/Product")
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} =require("./verifyToken");



//find wishlist
// 
router.post("/get",verifyTokenAndAuthorization,async (req,res)=>{
    const {wishlist}=req.body;
    console.log(req.body);
    if (!wishlist) {
        return res.status(404).json("Wishlist not found");
    }
    try{
        const wish= await Wishlist.findById(wishlist);
        if(wish.productid.length===0){
            return res.status(200).json("None");
        }
        const pro= await Product.find(
            {
                "_id":{
                    "$in":wish.productid
                }   
            }     
        )
        res.send(pro);
    }catch(err){
        res.status(401).json(err);
    }
})

//find and add item to wishlist
router.patch("/", verifyTokenAndAuthorization, async (req, res) => {
    const { wishlist, product } = req.body;
    if (!wishlist) {
      return res.status(404).json("Wishlist not found");
    }
    try {
      const updatedWishlist = await Wishlist.findByIdAndUpdate(
        wishlist,
        {
          $addToSet: {
            productid: product
          }
        },
        { new: true } // Return the updated wishlist document
      );
      res.json(updatedWishlist); // Return the updated wishlist as a response
    } catch (err) {
      res.status(500).json(err); // Handle any errors that occur during the update
    }
  });


//find and delete item from wishlist
router.patch("/delete", verifyTokenAndAuthorization, async (req, res) => {
    const { wishlist, product } = req.body;
    if (!wishlist) {
      return res.status(404).json("Wishlist not found");
    }
    try {
      const updatedWishlist = await Wishlist.findByIdAndUpdate(
        wishlist,
        {
          $pull: {
            productid: product
          }
        },
        { new: true } // Return the updated wishlist document
      );
      res.json(updatedWishlist); // Return the updated wishlist as a response
    } catch (err) {
      res.status(500).json(err); // Handle any errors that occur during the update
    }
  });

//t
   
module.exports=router;
