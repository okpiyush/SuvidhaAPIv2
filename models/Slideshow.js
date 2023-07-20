const mongoose = require("mongoose");

const SlideSchema=new mongoose.Schema(
    {
        img:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        desc:{
            type:String,
            required:true
        },
        link:{
            type:String,
            required:true
        },
        color:{
            type:String,
            required:true
        }

    }
)


module.exports=mongoose.model("Slideshow",SlideSchema);