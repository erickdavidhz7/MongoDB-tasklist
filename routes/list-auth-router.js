const express = require("express");
const listAuthRouter = express.Router();
const validateJWT = require("../middlewares/validateJWT");
const validRole = require("../middlewares/validRole");
const connectDB = require("../db");
const UserModel = require("../schemas/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Ruta para registrar un nuevo usuario
listAuthRouter.post("/register", async (req, res) => {
  try {
    const dataUser = req.body;
    dataUser.role = dataUser.role ?? "User";
    await connectDB();
    const usersArrayDB = await UserModel.find({});
    const validateUniqueEmail = usersArrayDB.some(
      userDB => userDB.email === dataUser.email
    );

    if (validateUniqueEmail) {
      return res.status(400).send({
        error: "This email has been used already.",
      });
    }

    const newUser = new UserModel(dataUser);
    newUser.save();

    return res.status(200).send({ newUser: newUser });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
});

// Ruta para que un usuario pueda hacer login
listAuthRouter.post("/login", async (req, res) => {
  try{
    const dataUser = req.body;
    await connectDB();
    const usersArrayDB = await UserModel.find({});
    const validateUser = usersArrayDB.find(
      userDB =>
        userDB.email === dataUser.email && userDB.password === dataUser.password
    );
  
    if (!validateUser) {
      return res.status(400).send({ error: "Invalid User" });
    }
  
    const payLoad = {
      id: validateUser._id,
      email: validateUser.email,
      role: validateUser.role,
    };
  
    const token = jwt.sign(payLoad, process.env.SECRET);
    return res
      .status(200)
      .send({ message: `Welcome ${dataUser.email}`, token: token });

  } catch(e){
    console.log(e);
    res.status(400).send({message: "Something went wrong!", error: e.message});
  }
});

// Ruta para autenticar el usuario que ha echo login
listAuthRouter.get("/auth", validateJWT, validRole, (req, res) => {
  res.send({ authentication: "The authentication has been succesful" });
});

module.exports = listAuthRouter;