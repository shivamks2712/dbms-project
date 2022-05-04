const express = require ('express');
const router = express.Router();
const Post = require('../../models/Posts');
const User = require('../../models/User');
const {check,validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

//                               Create new Post.
router.post('/',
[auth,[check('text','Text is required').not().isEmpty()]],
async (req,res)=>{
const errors = validationResult(req);
if(!errors.isEmpty()) return res.status(400).send(errors.array());
 try{
const user = await User.findById(req.user.id);
const newPost = {
    text:req.body.text,
    name:user.name,
    avatar:user.avatar,
    user:req.user.id,
}
if(req.body.imageURL) newPost.imageURL=req.body.imageURL;
const post = new Post(newPost) ;
await post.save();
res.status(200).send(post);
}

catch(exc){
    res.status(400).send('Server Error')
}

})

//                               Fetching all posts
router.get('/',auth,async (req,res)=>{
    const posts = await Post.find().sort({date:-1});
    if(posts) return res.status(200).json(posts);
    res.status(404).send('Cannot get Posts now!')
})


//                           fetching post by id
router.get('/:id',auth,async (req,res)=>{
 try{  
     const post= await Post.findById(req.params.id);
    if(post) return res.status(200).send(post)
}
catch(exc){
    res.status(400).send('Cannot find Post')
}
})
//                           Likes and Dislikes
router.post('/like/:id',auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(!post) return res.status.apply(400).send('No post Found');
        var ind = post.likes.map(like=>like._id.toString());
        ind=ind.indexOf(req.user.id);
        console.log(ind)
         if(ind==-1) {
           post.likes.push(req.user.id);
           await post.save();
           return res.status(200).send('Post Liked')
           }
        post.likes.splice(ind,1);
        await post.save()
        return res.status(200).send('Post Unliked')
     }
     catch(exc){
         res.status(400).send('Cannot find Post')
     }
})
  
//                                    Comments Posts and Delete
// router.post('/comment/:id',auth,async(req,res)=>{
//     try{
//         const post= await Post.findById(req.params.id);
//         if(!post) return res.status.apply(400).send('No post Found');
//         const user = User.findById(req.user.id);
//         const comment ={
//             user: req.user.id,
//             text: req.body.text,
//             avatar: user.avatar,
//             name:user.name,
//         }
//         post.comments.push(comment);
//         await post.save();
//         res.status(200).send('Comment Posted')
//      }
//      catch(exc){
//          res.status(400).send('Cannot find Post')
//      }
// })

// router.delete('/comment/:id',auth,async(req,res)=>{
//     // try{
//         const post= await Post.findById(req.params.id);
//         if(!post) return res.status.apply(400).send('No post Found');
//         var ind = post.comments.map(comment=>comment._id.toString());
//         ind=ind.indexOf(req.body.commentId);
//         console.log(ind);
//          if(ind==-1) {
//            return res.status(200).send('Comment not Found')
//            }
//        if(post.comments[ind].user.toString()==req.user.id){
//            post.comments.splice(ind,1);
//            await post.save();
//            return res.status(200).send('Post Deleted');
//        }
//        return res.status(401).send('Permission Denied')
//       }
//       catch(exc){
//           res.status(400).send('Cannot find Post')
//       }
// })



//                           Delete post 
router.delete('/:id',auth,async (req,res)=>{
    try{  
        const post= await Post.findById(req.params.id);
        if(!post) return res.status.apply(400).send('No post Found');
    //        check the user
       if(post.user!=req.user.id) return res.status(401).json({
           "user":post.user,
           "postedBy":req.user.id
       });
       await post.remove();
       res.status(200).send('Post Deleted')
   }
   catch(exc){
       res.status(400).send('Cannot find Post')
   }
})

module.exports=router;