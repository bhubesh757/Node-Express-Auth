import Expresss from "express"
import User from "../schemas/user";
import bcrypt, { genSalt } from "bcrypt"
import jwt from "jsonwebtoken"


const registerUser = async (req : Expresss.Request , res : Expresss.Response) => {
    console.log("register is smashing");
    const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(401).send({ message: "Required name, email and password" });
  }

  // Check if this user already exists or not
  const userExist = await User.findOne({
    email,
  });

  if (userExist) {
    res.status(401).send({ message: "User with same email already exists." });
  }

  // If not create record of this user
  const hashedpassword = await bcrypt.hash(password, 12);
  console.log(hashedpassword);

  const newUser = new User({
    name,
    email,
    authentication: {
      password: hashedpassword,
    },
  });

  newUser.save();

  // return user info
  res.status(201).send({message : " User Account has been Created Successfully" , user : newUser});
}

const loginUser = async (req : Expresss.Request , res : Expresss.Response) => {
    console.log("login is smashed");

    //fetch email and pass from the req body
    const {email , password} = req.body;

    if (!email || !password) {
        return res.status(401).send({ message: "Required email and password" });
      }

    //validate the email 
    const userExist = await User.findOne({
        email,
    }).select("+authentication.password");

    if(!userExist){
        return res.status(400)
        .send({message : "User with this mail does not exists, create the user using the Signup"})
    }
    //validate the password , with db password and input pass
    const passMatch = bcrypt.compare(password , userExist?.authentication?.password as string)

    if(!passMatch){
        return res.status(401).send({message : "Invalid credentials"});
    }

    

    //access token in cookie
    const token = jwt.sign(String(userExist?._id) , process.env.APP_SECRET  as string) 
    //return the status code 200 with user succes login
    res.cookie("AUTH_COOKIE" , token , {httpOnly: true,
    })

    //setting he acccesss toke and get saved in the mongodb database
    if(userExist.authentication){
        userExist.authentication.access_token = token
    }

    await userExist?.save();
    return res.status(200).send({message : "User Logged in Successfully" , accessToken : token})
    
}

const logout = (req : Expresss.Request , res : Expresss.Response) => {
    console.log("logout is smashed");
    //logout 

    res.cookie("AUTH_COOKIE" , " ");
    return res.status(200).send({message : "user logged Out successfully"});

}

const getAllUsers = async (req : Expresss.Request , res : Expresss.Response) => {
    const allUsers = await User.find()

    return res.status(200).send(allUsers)
}

export {
    registerUser,
    loginUser,
    logout,
    getAllUsers
}


//to get the rid of the error req : Expresss.Request , res : Expresss.Response


//create a cluster in the mongodb

