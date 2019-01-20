const express=require('express');
const app=express();
const cors=require('cors');
const mong = require('mongoose');
const user=require('./user');
const savedUser = require('./savedUser');
app.use(cors());
mong.connect('mongodb://blisston:blisston@cluster0-shard-00-00-6c6rc.mongodb.net:27017,cluster0-shard-00-01-6c6rc.mongodb.net:27017,cluster0-shard-00-02-6c6rc.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
{
    useNewUrlParser:true
});

app.use('/user',user);
app.use('/saved',savedUser);

module.exports=app;
