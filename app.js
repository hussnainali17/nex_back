const express=require('express')
const app=express();
const connectTODB=require('./db/db')
const cors=require('cors');
const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');
//const socketIO = require('socket.io');
const UserRoutes=require('./Routes/users.routes');
const ProfileRoutes=require('./Routes/Profile.routes');
const ChatRoutes=require('./Routes/chat.routes');
const RequestRoutes=require('./Routes/Request.routes');
const mailRoutes=require('./Routes/mail.routes');
dotenv.config();
app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true
}));


// app.use(cors({
//   //origin: 'https://final-front-g5tb.onrender.com', // React frontend URL
//   origin:'http://localhost:5173',
 //  credentials: true                // ✅ Allow cookies to be sent
// }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
connectTODB();
app.get('/',(req,res)=>{
    res.send('Hello World');
});
app.use('/users',UserRoutes);
app.use('/profile',ProfileRoutes);
app.use('/chat',ChatRoutes);
app.use('/request',RequestRoutes);
app.use('/mail',mailRoutes);

module.exports=app; 