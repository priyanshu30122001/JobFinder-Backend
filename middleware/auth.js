//authentication middleware
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../schemas/user");

const authMiddleware = async(req,res,next)=>{
    try{
        const token = req.header("auth-token");
        console.log(token);
        if(token){
         const verified = jwt.verify(token,process.env.JWT_SECRET);
            if(verified){
                  const user = await User.findOne({ _id: verified._id});// does this belongs to a user 
                  if(user){
                    req.user = user;
                    next();
                  }
                  else{
                    res.status(401).json({message:"Access Denied"})
                  }
            }else{
                res.status(401).json({message:"Access Denied"})
            }
        }else{
          res.status(401).json({message:"Access Denied"})
        }

    }catch(err){
        next(Error);
    }  
}

module.exports = authMiddleware;