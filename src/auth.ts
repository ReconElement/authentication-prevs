import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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
      const token = jwt.sign({ id: 1 }, "your_secret_key", {
        expiresIn: "1hr",
      });
      res.json(token);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  });
}

main();
export {router};
