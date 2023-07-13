"use strict";

const express = require("express");
const cors = require("cors");
const con = require("./Utilities/mysqlCon");
const app = express();
const port = process.env.port || 9000;
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const uuid = require("uuid");
const ip = require("ip");

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
    `select * from posts order by created_date desc limit 100  `,

    function (err, result, field) {
      console.log("Data fetched and send");
      res.json({ response: result });
    }
  );
});

app.post("/changePassword",bodyParser.json(),(req,res)=>{
  console.log(req.body)

  con.query(`select userId,password from users where users.username=${req.body.username};`,function(err,result){
    // console.log([...result],err)
    const [data] = [...result];
    console.log(data ,"result of change password check")
    console.log(req.body.password,data.password ,"to see password match")
    if(req.body.password === data.password){
      con.query(`update  users set users.password='${req.body.newPassword}' where  users.userId=${data.userId}`,function(err,result){
        console.log(result,err)
        if(err === null) {
          res.send(true);
        }
        else{
          res.send(false)
        }
      })
    }
    else{
      console.log(req.body.password === result.password)
      res.send(JSON.stringify("Incorrect Password"));
    }
  })
})
app.post("/changeAvatar",bodyParser.json(),(req,res)=>{
  console.log(req.body)
  con.query(`update users set users.imgUrl = ${req.body.imageUrl} where users.userId=${req.body.userId}`,(err,result)=>{
    console.log(result ,"avatar changed");
    res.send(true)
  })

 
})
app.post("/checkUsername", bodyParser.json(), (req, res) => {
  con.query(
    `select username from users  where username="${req.body.username}";`,
    function (err, result) {
      console.log(result[0]?.username, req.body.username);
      if (result[0]?.username === req.body.username) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
  // res.send(JSON.stringify(req.body.username));
});
app.post("/checkComment", bodyParser.json(), (req, res) => {
  console.log(req.body.id,req.body.username , "check comment")
  if(req.body.id == undefined || req.body.username == undefined){
    res.send(false)
  }
  else{
  con.query(
    `select * from comments  where comments.postId=${req.body.id} && comments.username=${con.escape(req.body.username)};`,
    function (err, result) {
      // console.log(result,err)
      if (result[0]) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
}
  // res.send(JSON.stringify(req.body));
});
app.post("/updateComment", bodyParser.json(), (req, res) => {
  console.log(req.body)
  con.query(
    `update comments set comments.content=${con.escape(req.body.content)}  where comments.commentId=${req.body.id}`,
    function (err, result) {
      console.log(result,err);
      if (result.affectedRows == 1) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
 
});
app.post("/deleteComment", bodyParser.json(), (req, res) => {
  console.log(req.body)
  con.query(
    `delete from comments where comments.commentId=${req.body.id}`,
    function (err, result) {
      console.log(result,err);
      if (result.affectedRows == 1) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
 
});
app.get("/popular", (req, res) => {
    
  con.query(
    `select postId,topic from posts ORDER BY posts.likes DESC LIMIT 5`,
    function (err, result) {
      // console.log(result);
      res.json(result)
    }
  );
 
});
app.post("/checkLike", bodyParser.json(), (req, res) => {
  console.log(req.body)
  con.query(
    `select * from likes where username=${req.body.username} AND postId=${req.body.id}`,
    function (err, result) {
      console.log(result)
      if (result[0]) {
        console.log(result , "Like founded");
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
 
});
app.post("/like", bodyParser.json(), (req, res) => {
  console.log(req.body , "liked")
  con.query(
    `select likes from posts where  postId=${req.body.id}`,
    function (err, result) {
      
      const updatedLike = result[0].likes + 1;
      console.log(updatedLike , "likes")
      con.query(`insert into likes (postId, username) values (${req.body.id},${req.body.username})`,
      function(err,result3){
        console.log(result3 ,err)
      })
      con.query(`update posts set likes = ${updatedLike} where postId =${req.body.id}` , function(err,result2){
        console.log( "updated in = posts")
        res.send(JSON.stringify(true))
      })  
 
    }
  );
 
    
  
});
app.post("/login", bodyParser.json(), (req, res) => {
  console.log(req.body);
  console.log(req.body.username);
  const user = req.body.username;
  const pass = req.body.password;
  con.query(
    `select * from users where username="${user}" and password="${pass}" `,
    function (err, result) {
      console.log(JSON.stringify(result));
      if (result.length === 0) {
        res.send(JSON.stringify("false"));
      } 
      else {
        const value = {
          userId: result[0].userId,
          name: result[0].name,
          email: result[0].email,
          username: result[0].username,
          imgUrl: result[0].imgUrl,
          created_date: result[0].created_date,
          last_login:result[0].last_login,
          userType:result[0].userType,
        };
        res.send(JSON.stringify(value));
    
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
     const avatar = req.files.avatar;
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
app.post("/reg", bodyParser.json(), (req, res) => {
  // console.log(req.body);
  con.query(
    `INSERT INTO users ( name,username, email , password) VALUES ("${req.body.name}","${req.body.username}","${req.body.email}","${req.body.password}");`,
    function (err, result) {
      if (result?.affectedRows) {
        console.log(result?.affectedRows);
        res.send(JSON.stringify("true"));
      } else {
        res.send(JSON.stringify("false"));
      }
    }
  );
  // res.send(JSON.stringify(req.body));
});
app.post("/post", bodyParser.json(), (req, res) => {
  console.log(req.body.content)
  const imgUrl =  req.body.imgUrl;
  const topic = con.escape(req.body.topic)
  const content= con.escape(req.body.content)
  if(req.body.topic){
    con.query(
      `INSERT INTO posts(topic,content,username,imgUrl) 
      VALUES (${topic},${content},'${req.body.username}',"${imgUrl}" ); `,
      function (err, result) {
        res.send(true);
        console.log("error" ,err)
        // console.log("Result of somthing",result);
      }
    );
  }
  else{
    res.send(false)
  }

});
app.post("/fullpost", bodyParser.json(), (req, res) => {
  con.query(`select *  from posts p where p.postId = "${req.body.id}"`, 
  function(err ,result){
    console.log(err ,result)
    if(result[0]){
      const data={...result[0]}
      res.send(JSON.stringify(data))
    }
    else{
      res.send(JSON.stringify(false))
    }
  })
});
// gives all comments of that post
app.post("/comments" , bodyParser.json() ,(req,res)=>{
  con.query(`select * from comments where comments.postId = "${req.body.id}" ORDER BY created_date DESC;` , function(err ,result){
    if(result){
      const data = [...result]
      res.send(JSON.stringify(data))
    }
    else{
      res.send(JSON.stringify("nodata"))
    }
  })

})
//this is to comment
app.post("/comment" , bodyParser.json() ,(req,res)=>{
  console.log(req.body)
  con.query(`INSERT INTO comments ( content,username, postId , imgUrl) VALUES (${con.escape(req.body.content)},"${req.body.username}","${req.body.postId}","${req.body.imgUrl}");`,
   function(err ,result){
  console.log(err, result)
  if(err){
    res.send(false)
  }
  else(
    res.send(true)
  )
  })
})
// deleting post 
app.post("/deletePost", bodyParser.json(), (req, res) => {
  console.log(req.body);
  con.query(
    `delete  from posts  where posts.postId=${JSON.stringify(req.body.postId)};`,
    function (err, result) {
      if (result.affectedRows === 0) {
        res.send(JSON.stringify(false));
      } else {
        res.send(JSON.stringify(true));
      }
    }
  );
  con.query(
    `delete  from comments where comments.postId="${req.body.postId}";`,
    function (err, result) {
      if (result.affectedRows === 0) {
       console.log(err)
      } else {
        console.log("comment deleted")
      }
    }
  );
});
app.post("/userInfo", bodyParser.json(), (req, res) => {
  const user = req.body.username;
  con.query(
    `select userId,name,email,username,created_date ,imgUrl,last_login from users where username="${user}"  `,
    function (err, result) {
      if (result[0]) {
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
      } else {
        console.log("No user found");
        res.send(JSON.stringify("false"));
      }
    }
  );
});

// Listening to port
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Listening in address:${ip.address()}:${port}`);
});
