import express from 'express';
import { PrismaClient } from '@prisma/client';

const posts = express.Router();
posts.use(express.json());
posts.use(express.urlencoded({extended: true}));

//Write CRUD APIs for the Posts
async function main(){
    let id;
    posts.use(function (req, res, next){
        
    })
    posts.get('/',async (req, res)=>{
        const {title, content} = req.body;

    })
}