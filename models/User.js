const mongoose=require("mongoose");

const userSchema= new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        wishlist:{
            type:String,
        },
        img:{
            type:String,
            default:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
        },
    },{
        timestamps:true
    }
);

module.exports =mongoose.model("User",userSchema);