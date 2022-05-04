const express = require ('express');
const User = require('../../models/User');
const {check,validationResult} = require('express-validator')
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');


//                        Creating new Account  SIGNUP ....  
router.post('/',
[
    check('name','Name is required').not().isEmpty(),
    check('email','Please use a valid email').not().isEmpty().isEmail(),
    check('password','Password should be atleast 8 charecter long').isLength({min:8})
],
 async (req,res)=>{
    //                 validation of user Data....
    console.log(req.body)
    const err =  validationResult(req);
    if(!err.isEmpty()) return res.status(300).json({errors:err.array()});
        
    //                 cheacking if user already exists or not
    let user = await User.findOne({email:req.body.email});
     if (user) return res.status(401).send('Email already Registered');
    //                 this modules get the profile pic of user through their email....
     const avatar = gravatar.url(req.body.email,{
         s:'200',
         r:'pg',
         d:'mm' //if url not found give default url of annonymous prof pic.
     })
     user = new User(req.body);
     user.avatar = avatar;
    //                 Bycrypting the password........
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
      user= await user.save()
    
     try {  
         var token = jwt.sign(
        {id:user._id},
        config.get('jwtToken'),
        {expiresIn:36000}
       );
       res.header('x-auth-token',token).send("Account created sucessfully");
     }
     catch(exp){
         res.send('cannot create token')
     }
   
  

})


module.exports=router;