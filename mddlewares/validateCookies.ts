import Express from 'express'
import User from "../schemas/user"
export const validateCookie = async  (
    req : Express.Request ,
     res : Express.Response ,
     next: Express.NextFunction) => {
    //check if the cookie is present or not 
    const cookie = req.cookies;

    if(cookie.AUTH_COOKIE){
        return res.status(401).send({message : "user is not Authorized , Login First"})
    }

    const userExistWithAcccessToken = await User.findOne({
        "authentication.access_token" : cookie.AUTH_COOKIE
    });

    if(!userExistWithAcccessToken) {
        return res.status(401).send({
            message : "You are not authorized To make the Request , Login !!"
        })
    }

    next();
}