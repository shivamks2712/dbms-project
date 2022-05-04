const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const bodyParser = require('body-parser')
const Cors = require('cors')
const app= express();

app.use(Cors({
    origin: "*",
 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//                                 MONGODB connection
var db =config.get('mongoURI')
mongoose.connect(db)
.then(()=>{
    console.log('MOngoDb connected')
}) 
.catch(()=>{
    console.log('Connection failed to mongoDb');
    process.exit(1);
})
 
//                                     Routes  Define
 
app.use('/api/user',require('./routes/api/user'));
app.use('/api/post',require('./routes/api/posts'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/auth',require('./routes/api/auth'));





//                                     Api Ports and connections                        
const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log('Active on PORT '+ PORT)
})