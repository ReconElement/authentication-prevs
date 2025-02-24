import express from "express";
import { auth } from "./auth.js";
const PORT = process.env.PORT || 3000;
const app = express();

app.use('/routes',auth);


app.listen(PORT, ()=>{
    console.log(`Server listening on PORT: ${PORT}`);
});

