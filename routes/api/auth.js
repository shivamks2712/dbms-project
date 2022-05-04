const express = require ('express');
const User = require('../../models/User');
const router = express.Router();
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator')
const bcrypt = require('bcrypt');

//                           Authecating signedUp user
router.get('/',auth,async(req,res)=>{
   try{ 
       console.log(req.user.id)
       const user = await User.findById(req.user.id).select('-password');
       res.json(user);
}
catch(exc){
    res.status(400).send('Internal Server Error')
}

})


//                             User Login

router.post('/',
[
    check('email','Please use a valid email').exists(),
    check('password','Password required').exists().isLength({min:8})
],
 async (req,res)=>{
    //                 validation of user Data....
    // console.log(req.body)
    const err =  validationResult(req);
    if(!err.isEmpty()) return res.status(400).json({errors:err.array()});
        
    //                 cheacking if user already exists or not
    let user = await User.findOne({email:req.body.email});
     if (!user) return res.status(401).send('Invalid Credentials');
  
     

    //                 Dycrypting the password........

     const isMatch = await bcrypt.compare(req.body.password,user.password);
     if(!isMatch)return res.status(401).send('Invalid Credentials');
    
     try {  
        var token = jwt.sign(
       {id:user._id},
       config.get('jwtToken'),
       {expiresIn:36000}
      );
      res.header('x-auth-token',token).send({token,user});
    }
    catch(exp){
        res.send('cannot create token')
    }
   
  

})

module.exports=router;