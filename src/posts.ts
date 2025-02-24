import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const posts = express.Router();
posts.use(express.json());
posts.use(express.urlencoded({extended: true}));

const db = new PrismaClient();
//Write CRUD APIs for the Posts
async function main(){
    let id: number;
    posts.use(function (req, res, next){
        const token = req.headers.authorization;
        try{
            if(token){
                const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
                if(typeof(decodedToken)!='string'){
                    id=decodedToken.id;
                }
            }
        } 
        catch(e){
            res.status(500).send({
                message: "Some error occurred, json token cannot be found"
            });
        }
        next();
    })
    posts.get('/',async (req, res)=>{
        const {title, content} = req.body;
        await db.post.create({
            data: {
                title: title,
                content: content,
                authorId: id
            }
        })
    })
}