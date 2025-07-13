const http=require('http');
const app=require('./app');
const port=process.env.PORT || 3000;
const setupSocket = require('./Connection/Socket');
const server=http.createServer(app);
const io = setupSocket(server);
server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})

