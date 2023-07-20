const mongoose=require("mongoose");
const announcemnetSchema= new mongoose.Schema(
    {
        announcement:[
            {
                type:String,
                required:true
            }
        ],
        featured:{
            type:Boolean,
            default:false
        }
    }
);

module.exports =mongoose.model("Announcement",announcemnetSchema);