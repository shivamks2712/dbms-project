const jwt = require ('jsonwebtoken');
const config= require('config');


module.exports= function(req,res,next){
 //  get token fro header
 const token = req.header('x-auth-token');
 if(!token) return res.status(401).json({
     msg:'no token provided , auth denied!'
 })
 try{
    // if valid token return _id as defined in userSchema.generateAuthToken()  function...... 
  const decode = jwt.verify(token, config.get('jwtToken'));
  req.user= decode;
  next();
 } 
catch(exc){
return res.status(401).send('Invalid Token');
}
}