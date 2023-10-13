const express = require("express");
const app = express();
const port = 8000;
const listViewRouter = require("./routes/list-view-router");
const listEditRouter = require("./routes/list-edit-router");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const validateJWT = require("./middlewares/validateJWT");
const validRole = require("./middlewares/validRole");
const connectDB = require("./db");
const UserModel = require("./schemas/userModel");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(listViewRouter);
app.use(listEditRouter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "DELETE"]);
  next();
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to my task list server!" });
});

app.get("/this-should-exists", (req, res) => {
  res.status(404).send({ error: "Not found" });
});

app.post("/register", async (req, res) => {
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
    return res.status(400).send({ error: e });
  }
});

app.post("/login", async (req, res) => {
  const dataUser = req.body;
  await connectDB();
  const usersArrayDB = await UserModel.find({});
  const validateUser = usersArrayDB.find(
    userDB =>
      userDB.email === dataUser.email && userDB.password === dataUser.password
  );

  if (!validateUser) {
    return res.status(400).send({ error: "User invalid" });
  }

  const payLoad = {
    email: validateUser.email,
    role: validateUser.role,
  };
  req.role = validateUser.role;
  const token = jwt.sign(payLoad, process.env.SECRET);
  return res
    .status(200)
    .send({ message: `Welcome ${dataUser.email}`, token: token });
});

app.get("/auth", validateJWT, validRole, (req, res) => {
  res.send({ authentication: "The authentication has been succesful" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
