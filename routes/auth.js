const router=require("express").Router();
const User=require("../models/User")
const Otp=require("../models/Otp")
const CryptoJS=require("crypto-js")
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
const Wishlist=require("../models/Wishlist");;
const Logs=require("../models/Log");
const Log = require("../models/Log");
//auth


//register
//adding creation of wishlist and adding it to the user req
router.post("/register",async (req,res)=>{
    const {username,email,img}=req.body;
    const wish=await new Wishlist().save();
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(validRegex)){ 
        res.status(500).json("Wrong Email")
        return;
    };
    const newUser=User({
        username:username,
        email:email,
        img:img,
        wishlist:wish._id,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.secretKey).toString(),
    });
    
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.epassword
    }
  });
  var MailOptions = {
    from: process.env.email,
    to: newUser.email,
    subject: "Welcome to Suvidha - Your Trusted Grocery Partner!",
    text: `Dear ${newUser.username},

    Welcome to Suvidha, your trusted grocery company! We're thrilled to have you as our valued customer. Our commitment to quality products, exceptional service, and convenient shopping experience will make Suvidha your go-to destination for all your grocery needs.
    
    Enjoy browsing our wide range of high-quality groceries at competitive prices. With our user-friendly website and mobile app, you can conveniently place orders and have them delivered right to your doorstep. As a token of our appreciation, use code [CODE123] to enjoy [X%] off on your first purchase.
    
    We prioritize your safety and follow strict health protocols to ensure your orders are handled with care and hygiene. Shop with confidence knowing that we take all necessary precautions.
    
    Thank you for choosing Suvidha. We look forward to serving you!
    
    Warm regards,
    
    The Suvidha Team
    `
  };

    try{
        const savedUser= await newUser.save();
        console.log(savedUser);
        const {username,...others}=savedUser._doc;
        transporter.sendMail(MailOptions, function (error, info) {
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            res.send({"reso":"notdone"});
            }
        });
        console.log("user saved")
        res.status(200).json({"username":username});
    }catch(E){
       if(E.keyValue.email){
        res.status(500).json("Email already Exists");
       }else if(E.keyValue.username){
        res.status(500).json("Username already Exists");
       }
    }
});













//Login function

router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        //first get the hashed password to decrpyt then convert it into utf 8 format 
        !user && res.status(404).json("Username not found");

        var Opassword=CryptoJS.AES.decrypt(user.password,process.env.secretKey).toString(CryptoJS.enc.Utf8);
        if(Opassword!== req.body.password)
            res.status(401).json("Wrong password");
        else{
        //verify access token inside 
            const accessToken=jwt.sign({
                id:user._id,
                isAdmin:user.isAdmin,
            },
            process.env.JWTsecretKey,
            {
                expiresIn:"3d"
            });
            const {password,...other}=user._doc;
            if(user._doc.isAdmin){
                try{
                await new Log({
                    Logs:`${req.socket.remoteAddress}`,
                }).save();
                }catch(err){
                    console.log("Log didnt happen");
                }
            }
            res.status(200).json({...other,accessToken});
        }
    }catch(err){
        res.status(500).json(err);
    }
})







// Rendering would be handled by ReactJS.
// Server Deployable.
// Code Shipped.
// Deployment part.


// Frontend, API, Database




//
//function to generate an otp of 6 digits
function generateOTP() {       
    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP.toString(); 
} 







//forgot password create otp
router.post("/forgotpassword",async(req,res)=>{
    const {email} = req.body;
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(validRegex)){ 
          res.send("Wrong Email");
          return;
    };
    try{
        //searching user in mongoDB
        const count = await User.countDocuments({email:email});
        if(count===1){
            //user found case
            //set otp and its db collection;
            const otp = generateOTP();
            let newOtp=await Otp.find({"email":email});
            if(newOtp.length==0){
                newOtp= new Otp();
                newOtp.email=email;
                newOtp.Otp=CryptoJS.AES.encrypt(otp,process.env.secretKey).toString();
                await newOtp.save();
                //send email
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: process.env.email,
                      pass: process.env.epassword
                    }
                  });
                  var MailOptions = {
                    from: process.env.email,
                    to: email,
                    subject: "Request to Change Password",
                    html:`
                    <html>
                      <body>
                        <p>Dear ${email},</p>
                        <p>Your OTP for resetting the password is <strong>${otp}</strong>.</p>
                        <p>This OTP will expire in 5 minutes.</p>
                        <p>Warm regards,</p>
                        <p>The Suvidha Team</p>
                      </body>
                    </html>
                  `
                  };
                  transporter.sendMail(MailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.status(200).json("okay");
            }else{
                res.status(409).json("OTP Exists")
            }
        }else{
            res.status(404).json("No User Found");
        }
    }catch(err){
        console.log(err);
    }
});












//generating a new Password for the user
function generateP() {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';
      
    for (let i = 1; i <= 12; i++) {
        var char = Math.floor(Math.random()
                    * str.length + 1);
          
        pass += str.charAt(char)
    }
      
    return pass;
}











//validate otp
router.post("/setotp", async (req,res)=>{
    const {email,otp}=req.body;
    try{
        const OTP=await Otp.findOne({"email":email});
        //no otp was found
         if (!OTP) {
            res.send("No OTP found");
            return;
        }
        var totp=CryptoJS.AES.decrypt(OTP.Otp,process.env.secretKey).toString(CryptoJS.enc.Utf8);
        const currtime=new Date();
        const otpTimeStamp=OTP.createdAt;
        const timeDiffer=currtime-otpTimeStamp;
        const fiveMinuteMili=5*60*1000;
        if(timeDiffer>fiveMinuteMili){
            //deleting the otp and sending that it has expired
            await Otp.findOneAndDelete({"email":email});
            res.status(498).json("OTP expired");
        }else if (OTP.Count===0){
            //if otp has exhausted it's chances, delete the otp from the session and send the number of chances has exhausted
            await Otp.findOneAndDelete({"email":email});
            res.status(429).json("Number of limits Exhausted");
        }else if(totp!==otp){
            //if the otp doesnt match decrease the number of chances
            OTP.Count-=1;
            await OTP.save();
            res.status(405).json("OTP doesnt match");
        }else{
            //if the password matches the new password change the password for the user and thendelete the otp from the data base
            const newPass=generateP();
            const User1=await User.findOne({"email":email});
            User1.password=CryptoJS.AES.encrypt(newPass,process.env.secretKey).toString();
            await User1.save();
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.email,
                  pass: process.env.epassword
                }
              });
              var MailOptions = {
                from: process.env.email,
                to: email,
                subject: "New Password for your Account",
                html: `
                <html>
                    <body>
                    <p>Dear ${User1.username},</p>
                    <p>Your new Password for your Suvidha account is <strong>${newPass}</strong></p> 
                    <p>Change this Password once you login to the website</p>
                    <p>Warm regards,</p>
                    <p>The Suvidha Team</p>
                    </body>
                </html>
                `
              };
              transporter.sendMail(MailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            await Otp.findOneAndDelete({"email":email});
            res.status(200).json(`New Password ${newPass}`);
        }
    }catch(err){
        console.log(err);
    }
})

module.exports = router