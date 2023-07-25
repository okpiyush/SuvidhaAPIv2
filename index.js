const express=require("express");
const app=express();
const mongoose = require('mongoose');
const dotenv=require("dotenv");
dotenv.config();
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const cartRoute=require("./routes/cart")
const productRoute=require("./routes/product")
const orderRoute=require("./routes/order")
const paymentRoute=require("./routes/stripe")
const announceRoute=require("./routes/announcement");
const mailerRute=require("./routes/mailer")
const SlideshowRoute=require("./routes/slideshow");
const MlLogicCalls=require("./routes/mllogicCalls");
const Wishlist=require("./routes/wishlist")
const cors=require("cors");
const rate= require("./middleware/rateMiddleware")
const { Server } =require("socket.io");
const http= require("http");
const Log=require("./models/Log")
//mongoose link
mongoose.connect(process.env.Mongo_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log("Error spotted");
    console.log(e);
})

//middlewares
app.use(rate);
app.use(cors());
app.use(express.json());




//Express server initialization
app.get("/api",async (req,res)=>{
    res.send("api running")
})
app.use("/api/announcement",announceRoute)
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/cart",cartRoute)
app.use("/api/products",productRoute);
app.use("/api/order",orderRoute);
app.use("/api/checkout/",paymentRoute);
app.use("/api/mail",mailerRute)
app.use("/api/slideshow",SlideshowRoute)
app.use("/api/find",MlLogicCalls);
app.use("/api/wishlist",Wishlist);
const server=http.createServer(app);
// app.listen(process.env.PORT||5000,()=>{

//     console.log("Backend server is running on Port: "+process.env.PORT);
// });

//making the socket server 
const socketServer=http.createServer();
const io= new Server(socketServer,{
    cors:{
        origin :["http://localhost:3000","http://localhost:3001"],
        methods :["GET","POST"]
    }
})

//listening to the calls io.on means someone connected to the webserver then execute this function

// io.on("connection",(socket)=>{
//     console.log(socket.id+" Connected");
//     //this is for the disconnection and is a callback function

//     socket.on("send_message", (data) => {   
//         console.log(data);
//         socket.to(data.room).emit("receive_message", data);
//     });

//     socket.on("join_room",(data)=>{
//         socket.join(data);
//         console.log(`user with ${socket.id} entered the room ${data}`)
//     })
//     socket.on("disconnect",()=>{
//         console.log("User Disconnected", socket.id);
//     })
// })


//starting both the servers
server.listen(process.env.PORT||5000,()=>{
        console.log("Backend server is running on Port: "+process.env.PORT);
});
// socketServer.listen(3002,()=>{
//     console.log("Socket.io server is running on port 3002");
// })

module.export = app;