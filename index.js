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
const cors=require("cors");
const rate= require("./middleware/rateMiddleware")
mongoose.connect(process.env.Mongo_URL).then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log("Error spotted");
    console.log(e);
})
app.use(rate);
app.use(cors());
app.use(express.json());
app.get("/api",(req,res)=>{
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
app.listen(process.env.PORT||5000,()=>{

    console.log("Backend server is running on Port: "+process.env.PORT);
});

module.export = app;