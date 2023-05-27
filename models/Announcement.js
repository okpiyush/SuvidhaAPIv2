const mongoose=require("mongoose");
const announcemnetSchema= new mongoose.Schema(
    {
        announcement:[
            {
                type:String,
                required:true
            }
        ]
    }
);

module.exports =mongoose.model("Announcement",announcemnetSchema);