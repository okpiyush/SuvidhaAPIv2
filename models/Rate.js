const mongoose=require("mongoose");
const { Decimal128 } = mongoose.Schema.Types;
const rateSchema= new mongoose.Schema(
    {
        rate:{
            type:String,
            required:true
        },
        lastUpdated:{
            type:Date,
            required:true
        }
    }
);

module.exports =mongoose.model("Rate",rateSchema);