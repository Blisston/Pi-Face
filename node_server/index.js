const http=require('http');
const app=require('./app');
const cors=require('cors');
app.use(cors());
const port =3000;
const server =http.createServer(app);
server.listen(port);
