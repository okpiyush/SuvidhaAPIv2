const mongoose=require("mongoose");

const OtpSchema= new mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        Otp:{
            type:String,
            required:true,
        },
        Count:{
            type:Number,
            default:3
        }
    },{
        timestamps:true
    }
);

module.exports =mongoose.model("Otp",OtpSchema);