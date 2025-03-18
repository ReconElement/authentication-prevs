import express from 'express';
const oauth = express.Router();
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import passport from 'passport';
import {Strategy as GithubStrategy} from 'passport-github2';
import session from 'express-session';

oauth.use(express.json());
oauth.use(express.urlencoded({extended: true}));
oauth.use(session({secret: "keyboard cat", resave: false, saveUninitialized: false, cookie:{maxAge:60000}}));
async function main(){
    const db = new PrismaClient();

    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(obj, done){
        //@ts-ignore
        done(null, obj);
    })
    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth/github/callback"
        //@ts-ignore
    },async function(accessToken, refreshToken, profile, done){
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        done(null, profile);
    }));

    oauth.get('/',async (req, res)=>{
        const user = req.user;
        user?res.send({message: `User: ${req.user}`}):res.send({message: "Please log in"});
    });

    oauth.get('/account', ensureAuthenticated,function(req, res){
        const user = req.user;
        res.send({
            message: `User: ${req.user}`
        });
    });

    oauth.get('/login', async (req, res)=>{
        // res.redirect('/github');
        res.redirect('http://localhost:3000/oauth/github')
    })

    oauth.get('/github',passport.authenticate('github',{scope:[`user:email`]}), (req, res)=>{
        //redirects to github login page
    });

    oauth.get('/github/callback',passport.authenticate('github',{failureRedirect: '/login'}),function(req, res){
        // Object.defineProperty(req.session, "isAuthenticated",{
        //     value: true
        // });
        const isAuthenticated: boolean= true;
        //@ts-ignore
        res.send({message: "You're logged in"});
    });

    oauth.get('/logout',(req, res, next)=>{
        req.logout(function(err){
            if(err){return next(err);}
        });

    })

    //ensureAuthenticated middleware function 
    function ensureAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction){
        let currentTime = new Date().getTime();
        const expires = req.session.cookie.expires?.getTime();
        if(expires){
            if(expires>currentTime){
                next();
            }
            else{
                res.redirect('/login');
            }
        }
    }
}
main();
export {oauth}
