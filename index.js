const express = require("express");
const port = process.env.PORT || 8080;
const app = express();

var router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// server setup
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});

const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/database-intro";

mongoose.connect(url, { useNewUrlParser: true});
const db = mongoose.connection;

db.once("open", _ => {
  console.log("Databse connected:", url);
});

db.on("error", err => {
  console.error("Connection error:", err);
});

// create a model
const Schema = mongoose.Schema;

const item = new Schema({
  image_url: String,
  date: String,
});

const Result = mongoose.model("result", item);

// The method of the root url. Be friendly and welcome our user :)
router.get("/", function (req, res) {
  res.json({ message: "Welcome to the APOD app." });
});

router.get("/favorite", function (req, res) {
  Result.find().then((results) => {
    res.json({ message: "Return all images.", results: results});
  });
});

router.post("/add", function (req, res) {
  const result = new Result({
    image_url: req.body.image_url,
    date: req.body.date,
  });
  result.save((error, document) => {
    if (error) {
      res.json({ status: "failure" });
    } else {
      res.json({
        status: "success",
        id: result._id,
        content: req.body,
      });
    }
  })
});

router.delete("/delete", function (req, res) {
  Result.deleteOne({ date: req.body.date }, (error) => {
    if (error) {
      res.json({ status: "failure" });
    } else {
      res.json({ status: "success" });
    }
  });
});

app.use("/api", router); // API Root url at: http://localhost:8080/api

