// import express from 'express';
// import bodyParser, { urlencoded } from 'body-parser';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended: true}));
// let tokenSave: string = " ";

// async function main(){
//     type User = {
//         email: string,
//         password: string
//     }
//     let userList: User[] = [];
//     router.post("/signup",async (req, res)=>{
//         try{
//             const email = req.body.email;
//             const password = req.body.password;
//             const hashedPassword = await bcrypt.hash(password, 10);
//             userList.push({
//                 email: email,
//                 password: hashedPassword
//             });
//         }
//         catch(e){
//             res.status(401).send({
//                 message: "signup failed"
//             });
//         }
//         res.status(201).send({
//             message: "signup successful"
//         });
//     });
//     router.post("/login",async (req, res)=>{
//         try{
//             const {email, password} = req.body;
//             const user = userList.find((user)=>user.email === email);
//             if(!user){
//                 res.status(401).send({
//                     message : "Invalid credentials"
//                 })
//                 return;
//             }
//             const passwordMatch = bcrypt.compare(password, user.password);
//             if(!passwordMatch){
//                 res.status(401).send({
//                     message: "Invalid credentials"
//                 });
//                 return;
//             }
//             //Generate JWT token
//             const token = jwt.sign({id: 1},"your_secret_key",{
//                 expiresIn: "1hr",
//             })
//             tokenSave = token;
//             res.json(token);
//         }
//         catch(e){
//             console.error(e){
//                 res.status(500).send({
//                     message: "Internal Server Error"
//                 });
//             }
//         }
//     })
// }
// main();
// export {router, tokenSave}

import axios from 'axios';
import {tokenSave} from './auth.js';

export default function Hit(){
    axios.post('http://localhost:3000/check',{
        Headers: {
            "authorization":`${tokenSave}`
        }
    })
}