import { auth } from "./auth.js";
import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const db = new PrismaClient();
app.use('/routes',auth);
app.get('/test',(req, res)=>{
    res.send({
        message: "This endpoint is written before the middleware so it should probably work"
    })
})
app.use(function (req, res, next){
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.headers.authorization;
    if(token){
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if(decodedToken){
            console.log(`Request by user: ${decodedToken}`)
            next();
        }
        else{
            res.status(403).send({
                message: "Access denied"
            })
        }
    }
    else{
        res.status(500).send({
            message: "Some error occurred,json web token could not be found"
        });
    }
});

app.get('/hello',(req, res)=>{
    res.status(200).send({
        message: "Hello World"
    })
});

app.listen(PORT, ()=>{
    console.log(`Server listening on PORT: ${PORT}`);
});

