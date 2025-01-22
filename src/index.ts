import express from 'express';
import {router} from './auth.js'
import jwt, { JwtPayload } from 'jsonwebtoken';
const app = express();
const PORT = 3000;
const JWT_SECRET = "your_secret_key"
app.use('/auth',router);

const auth = function (req: express.Request, res: express.Response , next: express.NextFunction){
    const token = req.headers.authorization;
    console.log(token);
    if(token){
        jwt.verify(token, JWT_SECRET, (error, decoded)=>{
            if(error){
                res.status(401).send({
                    message: "Unauthorized"
                });
            }
            else{
                res.json({
                    login: true,
                    data: decoded
                });
                next();
            }
        });
        
        
    }
    else{
        res.status(401).send({
            message: "Unauthorized"
        });
    }
}
app.use(auth);
app.get("/check",(req, res)=>{
    res.send({
        message: "You are authorized"
    })
})

app.listen(PORT, ()=>{
    console.log(`App listening to PORT: ${PORT}`);
});

