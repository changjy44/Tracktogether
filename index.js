const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
// const fileUpload = require('express-fileupload');

const apiRouter = require("./routes/api.routes");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());

// const Account = require('./models/account.model.js');
const db = require("./models");
// const Account = db.account;
const port = process.env.PORT || 8080;

const connectionParams = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
};

db.mongoose
  .connect(db.url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/public", express.static(path.join(__dirname, "public")));



app.listen(port, () => {
  console.log(`Server started on ${port}...`);
});
