const mongoose=require("mongoose");

const LogsSchema= new mongoose.Schema(
    {
        Logs:{
            type:String,
            required:true
        },
    },{
        timestamps:true
    }
);

module.exports =mongoose.model("Log",LogsSchema);