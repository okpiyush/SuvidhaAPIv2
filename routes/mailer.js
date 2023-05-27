let nodemailer = require("nodemailer");
const router = require("express").Router();
const Mail = require("../models/Mail");
const {verifyTokenAndAdmin} =require("./verifyToken");




//registering a mail
router.post("/", async (req, res) => {
  const { email } = req.body;
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if(!email.match(validRegex)){ 
        res.send("Wrong Email")
        return;
    };
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
    subject: "Welcome to the Club",
    text: `Dear ${email},

    We are delighted to extend a warm welcome to you as a new member of our mailing list! On behalf of Team Suvidha.com, we would like to express our gratitude for choosing to join our community. We are excited to have you on board and look forward to sharing valuable updates, exclusive content, and exciting opportunities with you.
    
    At Suvidha, we are committed to providing you with relevant and engaging information tailored to your interests. Our mailing list offers a unique platform where you can stay up-to-date with the latest news, industry insights, product launches, and special promotions. By being a part of our community, you will have exclusive access to valuable resources and be the first to know about any upcoming events or initiatives.
    
    We encourage you to actively engage with our content and feel free to provide feedback or share your thoughts with us. We value your input and strive to create a dynamic and interactive community where ideas can flourish. Should you have any questions, suggestions, or need assistance, please do not hesitate to reach out to us. We are here to support you and ensure your experience with us is nothing short of exceptional.
    
    Once again, thank you for joining our mailing list. We truly appreciate the opportunity to connect with you and share our journey together. We hope you find our communications valuable and engaging, and we look forward to building a lasting relationship with you.
    
    Warm regards,
    
    Piyush Kumar
    Developer
    Suvidha : An Ecommerce Platform
    +91-8340524577`
  };

  try {
    const existingMail = await Mail.findOne({ "mail": email });
    if (!existingMail) {
      const newMail = new Mail({ mail: email });
      await newMail.save();
      transporter.sendMail(MailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send({"reso":"notdone"});
        }
      });
      res.send({"reso":email});
    } else {
      res.send({"reso":"done"});
    }
  } catch (err) {
    console.log(err);
    console.log("");
  }
});











//sending bulk mails
router.post("/bulkmail",verifyTokenAndAdmin,async(req,res)=>{
    const {email,subject,text}=req.body;
    const emails=await Mail.find();
   
    const emailsArray=await emails.map(email=>email.mail);
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.epassword
      }
    });
    var MailOptions = {
      from: process.env.email,
      to: process.env.email,
      bcc: emailsArray,
      subject:subject,
      text:text 
    };
  
    try {
        transporter.sendMail(MailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: '
             + info.response);
          }
        });
        res.send(email);
      }catch (err) {
      console.log(err);
    }
});





//getting all mails
router.get("/getmails",async (req,res)=>{
    const emails=await Mail.find();
    res.send(emails);
});





//deleting a mail
router.delete("/delete/:id",async(req,res)=>{
    const id=req.params.id;
    await Mail.findOneAndDelete({_id:id});
    res.send("Deleted this mail")
});





module.exports = router;