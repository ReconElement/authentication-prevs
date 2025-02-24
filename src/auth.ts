import express from "express";
const auth = express.Router();
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
auth.use(express.json());
auth.use(express.urlencoded({ extended: true }));

async function main() {
  const db = new PrismaClient();

  //handling POST request /signup
  auth.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
    //find if an user already exists with the same credentials, i.e, username, password, email 
    const users = await db.user.findMany({
        where: {
            OR: [
                {
                    name: name,
                },
                {
                    email: email,
                },
            ]
        }
    });
    // console.log(users);
    if(users.length!=0){
        res.status(409).send({
            message: "User with the same credentials already exists, try with a new username or email"
        });
        return;
    }
      await db.user.create({
        data: {
          email: email,
          name: name,
          password: hashedPassword,
        },
      });
    } catch (e) {
      res.status(401).send({
        message: "Signup failed",
      });
    }
    res.status(201).send({
      message: "Signup successful",
    });
  });

  //handling POST request for /login
  auth.post("/login", async (req, res) => {
    try {
      //login can work on parameters {username & password} or {email and password}
      const { usernameOrEmail, password } = req.body;
      const user = await db.user.findFirst({
        where: {
          OR: [
            {
              name: usernameOrEmail,
            },
            {
              email: usernameOrEmail,
            },
          ],
        },
      });
      if (!user) {
        res.status(401).send({
          message: "Invalid credentials",
        });
        return;
      }
      if (user.password) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          res.status(401).send({
            message: "Invalid credentials",
          });
          return;
        }
      } else {
        res.status(404).send({
          //this case might appear if an user has logged in through OAuth instead
          message: "User not found, can be logged in through OAuth instead",
        });
        return;
      }
      //Generate JWT Token
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "1hr",
      });
      res.json(token);
    } catch (e) {
      console.error(500);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  });
}
main();
export {auth};