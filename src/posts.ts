import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const posts = express.Router();
posts.use(express.json());
posts.use(express.urlencoded({ extended: true }));

const db = new PrismaClient();
//Write CRUD APIs for the Posts
async function main() {
  let userId: number;
  posts.use(function (req, res, next) {
    try {
      const token = req.headers.authorization;
      if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (typeof decodedToken != "string") {
          userId = decodedToken.id;
        }
      }
    } catch (e) {
      res.status(500).send({
        message: "Some error occurred, json token cannot be found",
      });
    }
    next();
  });
  posts.post("/", async (req, res) => {
    try {
      //handle the duplicates, if duplicate present don't change
      const { title, content } = req.body;
      const search = await db.post.findFirst({
        where: {
          content: content,
        },
      });
      if (search) {
        res.status(403).send({
          message:
            "Post content already exist, same post cannot be posted again and again",
        });
      }
      const created = await db.post.create({
        data: {
          title: title,
          content: content,
          authorId: userId,
        },
      });
      if (created) {
        res.status(201).send({
          message: "Post created successfully",
        });
      }
    } catch (e) {
      res.status(500).send({
        message: "Internal server error",
      });
    }
  });
  //get all posts
  posts.get("/", async (req, res) => {
    // const posts = await db.post.findMany();
    // res.status(200).json(posts);
    try {
      const posts = await db.post.findMany();
      if (posts.length == 0) {
        res.status(200).send({
          message: "No posts found",
        });
      } else {
        res.status(200).json(posts);
      }
    } catch (e) {
      res.status(500).send({
        message: "Internal server error",
      });
    }
  });
  //get specific posts based on id
  posts.get("/:id", async (req, res) => {
    try {
      let id: number = parseInt(req.params.id);
      const post = await db.post.findUnique({
        where: { id: id },
      });
      if (!post) {
        res.status(404).send({
          message: "Post not found",
        });
      } else {
        res.status(200).json(post);
      }
    } catch (e) {
      res.status(500).send({
        message: "Internal server error",
      });
    }
  });
  //update specific posts
  posts.post("/update/:id", async (req, res) => {
    //can only be updated by the author of the post or admin, admin role to be set later
    try {
      let id: number = parseInt(req.params.id);
      const { title, content } = req.body;
      const postFound = await db.post.findFirst({
        where: {id: id, authorId: userId}
      });
      if(postFound){
        const update = await db.post.update({
          where: {id: id},
          data: {
            title: title,
            content: content,
          }
        });
        res.status(204).json(update);
      }
      else{
        res.status(404).send({
          message: `Post with id: ${id} requested is not found`
        });
      }
    } catch (e) {
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  });
  //delete specific posts 
  posts.delete("/delete/:id", async (req, res)=>{
    //only the post owner can delete his posts, or the admin upon creation of roles to be created for admin as well
    try{
      const id = parseInt(req.params.id);
      const postFound = await db.post.findFirst({
        where: {
          id: id,
          authorId: userId,
        }
      });
      if(postFound){
        const deleteUser = await db.post.delete({
          where: {id: id, authorId: userId}
        });
        res.status(200).send({
          message: "Post successfully deleted"
        });
      }
      else{
        res.status(404).send({
          message: `Post with id: ${id} not found`
        });
      }
    }
    catch(e){
      res.status(500).send({
        message: `Internal Server Error`
      })
    }
  });
}

main();
export { posts };
