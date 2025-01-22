import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
// import Hit from "./auth2.js";
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
let tokenSave = " ";
async function main() {
  type User = {
    email: string;
    password: string;
  };
  let userList: User[] = [];
  router.post("/signup", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10);
      userList.push({
        email: email,
        password: hashedPassword,
      });
    } catch (e) {
      res.send(401).send({
        message: "Sign up failed",
      });
    }
    res.status(201).send({
      message: "Signed up successfully",
    });
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("token").send({
      message: "Logged out successfully",
    });
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = userList.find((user) => user.email === email);
      if (!user) {
        res.status(401).send({
          message: "Invalid credentials",
        });
        return;
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).send({
          error: "Invalid Credentials",
        });
        return;
      }

      //Generate JWT token
      const token = jwt.sign({id: 1}, "your_secret_key", {
        expiresIn: "1hr",
      });
      tokenSave = token;
      res.json(token);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  });
  function Hit(){
    axios.post("http://localhost:3000/check",{
      Headers:{
        "authorization":`${tokenSave}`
      }
    }).then(()=>{
      console.log(tokenSave);
    });
  }
  setInterval(Hit, 60000);
}

main();
export {router, tokenSave};
