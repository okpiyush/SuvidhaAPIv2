const mongoose=require("mongoose");

const wishSchema= new mongoose.Schema(
    {
        productid:{
            type:Array,
            default:[]
        }
    },{
        timestamps:true
    }
);

module.exports =mongoose.model("Wishlist",wishSchema);