const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");
const fs = require("fs");
const jobRoutes=require("./routes/jobs");
const authMiddleware = require("./middleware/auth");
const cors = require("cors")

dotenv.config();
const port = process.env.PORT ||4000;
app.use(cors({
    origin:"*",
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/auth",authRouter);
app.use("/api/jobs",jobRoutes)


// middleware logs ever incoming requests and store these in atxt file 
app.use((req,res,next)=>{
    const log = `\n ${req.method}-${req.url}-${req.ip}-${new Date()}`;
    fs.appendFile("log.txt",log,(err)=>{
        if(err){
            console.log(err);
        }
    });
    next();
});
// LOG your errors 
app.use((err,req,res,next)=>{
    let log ;
    log = err.stack;
    log +=`\n ${req.method}-${req.url}-${req.ip}-${new Date()}`;
    fs.appendFile("error.txt", log,(err)=>{
        if(err){
            console.log("err");
        }
    });
    res.status(500).send("something wrong");
});

app.get("/",(req,res)=>{
    res.send("hello world");
})

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}/`);
    mongoose.connect("mongodb+srv://priyanshupadeliya27:YYg4doIqC0wXrpjY@jobfinder.ywoe5nk.mongodb.net/?retryWrites=true&w=majority&appName=JOBfinder");
    mongoose.connection.on("connected",()=>{
    console.log("connected to mongoDB");
    })
});
