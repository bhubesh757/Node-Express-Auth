import Express from "express";
import authRouter from "../routes/authentication";
import "dotenv/config"
import mongoose from "mongoose";
import bodyParse from "body-parser";
import cookieParser from "cookie-parser";

const app = Express();

app.use(bodyParse.json());
app.use(cookieParser());

const port = 3000;

app.listen(port , () => {
    console.log(`server is runnning on the port : ${port} `);
    
})

app.use("/auth" , authRouter);

mongoose.connect(process.env.MONGODB_URL as string).then(() => {
    console.log("mongodb is connected");
}).catch((err) => {
    console.error(err);
})