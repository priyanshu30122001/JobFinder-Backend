const express = require("express");
const router = express.Router();
const Job = require("../../schemas/job");
const { default: mongoose } = require("mongoose");

// Create a job 
router.post("/create" ,async(req,res,next)=>{
   try{
    const {name,logo,position,salary,jobType,remote,description,about,skills,information,location} = req.body
    const user = req.user;
    const userId = user._id;
    const skillsArray = skills.split(",").map(skill => skill.trim());
    const job = new Job({
      name,
      logo,
      position,
      location,
      salary,
      jobType,
      remote,
      description,
      about,
      skills: skillsArray,
      information,
      userId
      });
    await job.save();
    res.status(200).json("Job created");
   }catch(err){
    next(err);
   }
})
// Delete job by id 
router.delete("/delete/:id",async(req,res,next)=>{
   try{
       const id = req.params.id
       const user = req.user;
       const userId = user._id;
       const job = await Job.findById(id);
       if(job.userId.toString() !== userId.toString()){
         return res.status(403).send("Access Denied")
      } 
       if(!id){
         return res.status(403).send("Wrong request"); 
       }
       await Job.findByIdAndDelete(id);
       res.status(200).send("Job deleted") ;
   }catch(err){
      next(err);
   }
})
// Get the job by id 
router.get("/get/:id",async(req,res,next)=>{
   try{
    const id = req.params.id;
    if(!id){
      return res.status(403).send("Wrong request"); 
    }
    const job = await Job.findById(id);
    res.status(200).json(job);

   }catch(err){
      next(err);
   }
})
//get all jobs 
router.get("/all",async(req,res,next)=>{
   try{
       const jobs = await Job.find().select("name logo position salary location jobType skills remote");
       res.status(200).json(jobs)
   }catch(err){
      next(err);
   }
});
// updating a job 
router.patch("/update/:id",async(req,res,next)=>{
   try{
    const { id } = req.params
    if(!id){
      return res.status(403).send("wrong request");
    }
    const {name,logo,position,salary,jobType,remote,description,about,skills,information,location} =req.body;
    const user = req.user;
    const userId = user._id;
    const defaultJob = await Job.findById(id);
    if(defaultJob.userId.toString() !== userId.toString()){
       return res.status(403).send("Access Denied")
    } 
    const skillsArray = skills?.split(",").map(skill =>skill.trim()) || defaultJob.skills;
    const job = await Job.findByIdAndUpdate(id,{
         name: name || defaultJob.name ,
         logo: logo || defaultJob.logo ,
         position: position || defaultJob.position,
         salary: salary || defaultJob.salary ,
         jobType: jobType || defaultJob.jobType,
         remote: remote || defaultJob.remote,
         description: description || defaultJob.description,
         about: about || defaultJob.about ,
         skills: skillsArray,
         information: information || defaultJob.information,
         location:location || defaultJob.location,
    },{new:true});
    res.status(200).json(job);
   }
   catch(err){
      next(err);
   }
})
// filtering based on skills 
router.get("/filter/:skills", async(req,res,next)=>{
   try{
         const skills = req.params.skills;
         if(!skills){
            return res.status(403).send("wrong request");
         }
         const skillsArray =  skills.split(",").map(skill=>skill.trim());
         const jobs = await Job.find({skills: {$in: skillsArray }}).select("name logo position");
         res.status(200).json(jobs)
   }
   catch(err){
      next(err);
   }
})
// filtering based on name ,position, jobtype
router.get("/search/:query",async (req, res, next)=>{
   try{
         const query = req.params.query;
         const job = await Job.find({
            $or: [
                 { name: { $regex: query, $options:'i' } },
                 { position: { $regex: query, $options:'i' } },
                 { jobType: { $regex: query, $options:'i' } },
                 { description: { $regex: query, $options:'i' } }
            ]
         }).select(" name logo position");
         res.status(200).json(job);
   }
   catch(err){
      next(err);
   }
})

module.exports = router;
