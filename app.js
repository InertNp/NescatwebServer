"use strict";

const express = require("express");
const cors = require("cors");
const con = require("./Utilities/mysqlCon");
const app = express();
const port = process.env.port || 9000;
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const uuid = require("uuid");

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(express.static("public"));
app.use("/img", express.static("img"));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/posts", (req, res) => {
  con.query(
    `select * from posts  order by created_date desc limit 100`,
    function (err, result, field) {
      JSON.stringify(result);
      console.log("Data fetched and send");
      res.json({ response: result });
    }
  );
});

app.post("/login", bodyParser.json(), (req, res) => {
  const user = req.body.username;
  const pass = req.body.username;
  con.query(
    `select * from users where username="${user}" and password="${pass}" `,
    function (err, result) {
      JSON.stringify(result);
      if (result.length === 0) {
        res.send(JSON.stringify("false"));
      } else {
        res.send(JSON.stringify(result));
        console.log(result);
      }
    }
  );
});

app.post("/img", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;
      const avatarName = `${uuid.v4()}-${avatar.name}`;
      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      avatar.mv("./img/" + avatarName);

      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: avatarName,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/post", bodyParser.json(), (req, res) => {
  console.log(req.body);
  const imgUrl = null || req.body.imgUrl;
  const des = null || req.body.des;
  con.query(
    `INSERT INTO posts(title,description,authorID ,author ,imgUrl) 
    VALUES ("${req.body.title}","${des}","${req.body.authorId}","${req.body.author}","${imgUrl}" ); `,
    function (err, result) {
      res.send(JSON.stringify("true"));
      console.log(result);
    }
  );
  // res.send(JSON.stringify(req.body));
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("listening in port ", port);
});
