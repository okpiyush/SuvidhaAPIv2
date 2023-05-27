const jwt=require("jsonwebtoken");




const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader){
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWTsecretKey,(err,user)=>{
            if(err){
                res.status(403).json("Token not authenticated");
            }
            req.user=user;
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated");
    }
}

//verify jwt token and its token
const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json({"res":"Not Authorized to do that"});
        }
    })
}
//verify token and admin
const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Not allowed to do that");
        }
    })
}
module.exports ={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};