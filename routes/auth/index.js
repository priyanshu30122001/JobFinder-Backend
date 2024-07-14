const express = require("express");
const User = require("../../schemas/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

// Login request
router.post("/login", async( req, res,next)=>{
    try{    
    const{ email, password }= req.body;
    // throw new Error("this is error ");
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User Not Found  "});
    } 
    const validPassword = await bcrypt.compare(password,user.password);
    if(!validPassword){
        return res.status(400).json({message:"wrong password"});
    }
    else{
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
        res.json({message:"Logged in successfully",token:token});
        // console.log(token);
    }
  }
  catch(err){
      next(err);
  }
});

// Register request
router.post("/register",async(req,res)=>{
    const{ name, email, password, mobile }= req.body;
    const user = await User.findOne({email});
    if(user){
         return res.status(400).json({message:"User already exist "})
        }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
            name,
            email,
            password:hashedPassword,
            mobile
        });
    await newUser.save();
    res.status(200).json({message:"User registered successfully "}) ;
});

module.exports= router ;