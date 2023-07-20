const mongoose=require("mongoose");

const productSchema= new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        desc:{
            type:String,
            required:true,
            unique:true
        },
        img:{
            type:String,
            required:true,
        },
        categories:{
            type:Array,
            required:true,
        },
        size:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        featured:{
            type:Boolean,
            default:false
        }
    },{
        timestamps:true
    }
);

module.exports =mongoose.model("Product",productSchema);