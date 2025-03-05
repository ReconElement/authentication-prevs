import express from "express";
const auth = express.Router({});
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import passport from 'passport';
import { Strategy as GithubStrategy } from "passport-github2";

auth.use(express.json());
auth.use(express.urlencoded({ extended: true }));

const db = new PrismaClient();
async function main() {

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
      // console.error(500);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  });

  auth.post("/loginGithub",async (req, res)=>{
    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/loginGithub/callback"
        //@ts-ignore
    },async function(accessToken, refreshToken, profile, done){
        console.log(profile);
        console.log(accessToken);
        //@ts-ignore
        return done(err, user);
    }
    ))
  });

  auth.get('/github', ()=>{
    passport.authenticate('github',{scope: ['user: email']});
  })

  auth.get('/github/callback',(req, res)=>{
    passport.authenticate('github',{failureRedirect: '/loginGithub'})
    //succesful authentication, redirect home 
    res.redirect('/');
  })
}
main().then(()=>{
    db.$disconnect();
});
export {auth};