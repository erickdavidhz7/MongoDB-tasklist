const express = require("express");
const app = express();
const port = process.envPORT ?? 8000;
const listViewRouter = require("./routes/list-view-router");
const listEditRouter = require("./routes/list-edit-router");
const listAuthRouter = require("./routes/list-auth-router");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(listAuthRouter)
app.use(listViewRouter);
app.use(listEditRouter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "DELETE"]);
  next();
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "Welcome to my to do list server!" });
});

app.get("/this-should-exists", (req, res) => {
  res.status(404).send({ error: "Not found" });
});


app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});

