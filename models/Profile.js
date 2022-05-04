const mongoose = require('mongoose');


var ProfileSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    // ref:'user',
    ref:'users'
     },
 experience:[{
     title: {
        type:String,
        required:true,

     },
    company :{
        type:String,
        required:true
    },
    location: String,
    from:{
        type:Date,
        required:true
    },
    to:{
        type:Date,
        default:Date.now
    },
    current:{
       type: Boolean,
       default:false,
    },
    description:{
        type:String,
        default:''
    }  
    
 }],
 education:[{
    course: {
       type:String,
       required:true,

    },
   school :{
       type:String,
       required:true
   },
   location: {type:String,
         default:'not provided',
     },
  
   
}],

social:{
     linkedin:String,
     twitter:String,
     github: String,
     instagram:String,
},

 skills:{
       type:[String],
       required:true
},

 location:  {
  type:String,
  default:'not provided'  
},

 status:{
     type:String,
     required:true
 },

 date:{
     type:Date,
     default:Date.now
 }

})
module.exports=mongoose.model('Profile',ProfileSchema)