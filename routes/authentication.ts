import Express from "express"
import { getAllUsers, loginUser, logout, registerUser } from "../controllers/auth";
import { validateCookie } from "../mddlewares/validateCookies";

const authRouter = Express.Router();

// authRouter.get("/test" , (req , res) => {
//     res.send("Api is Done and working")
// })

//post method
authRouter.post("/signup" , registerUser);
authRouter.post("/login" , loginUser);
authRouter.post("/logout" , logout);
authRouter.get("/getAllUsers" ,validateCookie , getAllUsers )

export default authRouter;

//to get protected , we use middlewares to get the process protected