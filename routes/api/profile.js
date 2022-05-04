const express = require ('express');
const router = express.Router();
const Profile= require('../../models/Profile');
const User= require('../../models/User');
const {check,validationResult} = require('express-validator')
const auth = require('../../middleware/auth')



//                              Get myProfile
router.get('/me',auth,async (req,res)=>{
  try{
    const profile =await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']).select('-_id');
    if(!profile)return res.status(400).json({
      msg:'There is no Profile for the user..'
    })
    res.status(200).json(profile);
  }
  catch(exc){
      res.status(400).send('cannot get profile')
  }
})

//                                       Get All Users       
router.get('/users',async function(req,res){
   
  try {
   const profile = await Profile.find().populate('user',['name','avatar']).select('-_id');
   if(profile) return res.status(200).json(profile);
   res.status(400).send('cannot fetch profile')
}
  catch(exc){
      res.status(400).send('Server Error')
  }
})
//                                   Get  Profiles by userId
router.get('/user/:user_id',async function(req,res){
   
   try {
    const profile = await Profile.find({user:req.params.user_id}).populate('user',['name','avatar']).select('-_id');
    if(profile) return res.status(200).json(profile);
    res.status(400).send('cannot fetch profile')
}
   catch(exc){
       res.status(400).send('No profile for this user')
   }
})
//                          Delete Profile and User and posts



router.delete('/',auth,async (req,res) => {
    try {
        await Profile.findOneAndRemove({user:req.user.id}); //  removing user profile
        await User.findOneAndRemove({_id:req.user.id});     //  removing user
        res.status(400).send('Deleted Sucessfully')
    }
    catch(exc){
          res.status(400).send('Server Error')
    }
})



//                           create or update my profile

router.post('/',
[auth,
[
 check('status','Ststus is required')
 .not()
 .isEmpty(),
 check('skills','Add atleast one skill')
 .not()
 .isEmpty()
]
],
async (req,res)=>{
const errors=validationResult(req);
if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
const profileFields ={};

if(req.body.skills)profileFields.skills = req.body.skills.split(',').map(skill=>skill.trim());
if(req.body.bio)profileFields.company = req.body.bio;
if(req.body.githubusername)profileFields.company = req.body.githubusername;
if(req.body.location)profileFields.location = req.body.location;
if(req.body.status)profileFields.status=req.body.status;


//                                creating Social media fields..

profileFields.social={}
if(req.body.facebook) profileFields.social.facebook= req.body.facebook;
if(req.body.instagram) profileFields.social.instagram= req.body.instagram;
if(req.body.linkedin) profileFields.social.linkedin= req.body.linkedin;
if(req.body.twitter) profileFields.social.twitter= req.body.twitter;
profileFields.user= req.user.id;
try{
    let profile =await Profile.findOne({user:req.user.id});
    if(profile){
       profile = await Profile.findOneAndUpdate(
         {user:req.user.id},
         {$set:profileFields},
             // if the user has new parameters add it also..     
       );
      return res.json(profileFields)
    }
    //                     if profile not found....
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  }
catch(err){
    console.error(err.message)
    res.status(400).send('Server Error')
}
})

//                        Adding   Experience
router.put('/experience',[
    auth,
    [
      check('title','Title is required').not().isEmpty(),
      check('company','company name is required').not().isEmpty(),
      check('from','Joining Date is required').not().isEmpty(),
    ]],
    async (req,res)=>{
  const errors = validationResult(req)
        if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
   const {title,company,location,from,to,current,description} = req.body;
    
   var newExp = {};
   if(location) newExp.location=location;
   if(to) newExp.to=to;
   if(current) newExp.current=current;
   if(description) newExp.description=description;
   newExp.title=title;
   newExp.company=company;
   newExp.from=from;
   try{
       const profile=await Profile.findOne({user:req.user.id});
      profile.experience.push(newExp);
      await profile.save();
      res.status(200).json(profile)
   }
   catch(exc){
       res.status(400).send('Server Error')
   }
    
    
    }
)

//                                          Deleting Experience
router.delete('/experience/:experience_id',auth,async(req,res)=>{
    try{
    const profile=await Profile.findOne({user:req.user.id});
    const index = profile.experience.map(exp=>exp._id).indexOf(req.params.experience_id);
    profile.experience.splice(index,1);
    await profile.save();
    res.status(200).json(profile.experience)
 }
   catch(exc){
    res.status(400).send('Server Error')
   }
})




module.exports=router;