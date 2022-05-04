var mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    } ,
    text:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    likes:[{
       user:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
         }
    }],
  
    // comments:[{
    //     user:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'users' 
    //     },
    //     text:{
    //       type:String,
    //       required:true,
    //     },
    //     name:{
    //       type:String,
    //     },
    //     avatar:{
    //     type:String,
    //     },
    //     date:{
    //     type:Date,
    //     default:Date.now
    //     }
    //  }],
    imageURL:{
      type:String,
    },
    date:{
        type:Date,
        default:Date.now
        }
})

module.exports = mongoose.model('Post',postSchema)