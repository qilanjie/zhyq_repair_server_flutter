const express = require("express");
const router = express.Router();
const db = require("../db/db.js");
const confirmToken = require("../middlewares/confirmToken");
const rand = require("csprng");
const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
// 修改账户密码
router.post("/api/private/v1/user", confirmToken, (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const userInfo = jwt.decode(token);
  if (userInfo.userName == req.body.userName || userInfo.userName == "admin") {
    const salt = rand(160, 36);
    const user = {
      salt: salt,

      userPassword: sha1(req.body.userPassword + salt),
      updateAt: Date(),
    };

    db.User.updateOne({ userName: req.body.userName }, user, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(`{"msg":"更新成功！"}`);
      }
    });
  } else {
    res.status(401).end(`{"msg":"你没权限修改非自己账户！"}`);
  }
});
// 注册
router.post("/api/private/v1/register", (req, res) => {
  // const token = req.headers.authorization.split(" ")[1];
  // console.log(jwt.decode(token));
  // const userInfo = jwt.decode(token);
  // db.Role.findOne({ role: userInfo.role }, (err, doc) => {
  //   if (err) {
  //     console.log(err);
  //   } else if (doc) {
  //     const permissions = doc.permissions;
  //     console.log(doc);
  //     if (permissions.indexOf("创建账户") > -1) {
  //       const salt = rand(160, 36);
  //       const user = {
  //         salt: salt,
  //         userName: req.body.name,
  //         userPassword: sha1(req.body.password + salt),
  //       };

  //       db.User.create(user, (err) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           res.status(200).send(`{"msg":"创建账户成功！"}`);
  //         }
  //       });
  //     } else {
  //       res.status(401).end(`{"msg":"你没权限创建账户！"}`);
  //     }
  //   } else {
  //     res.status(401).end(`{"msg":"此账户没注册！"}`);
  //   }
  // });

  db.User.findOne({ userName: req.body.userName }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (doc) {
      res.sendResult(null,401,"用户名已经存在了！");
     
    } else {
      const salt = rand(160, 36);
      const user = {
        userName: req.body.userName,
        userPassword: sha1(req.body.userPassword + salt),
        salt: salt,
        role: "",
        name: req.body.name,       
        department: req.body.department,
        mobile: req.body.mobile,
        createdAt: Date(),
        updateAt: Date(),
      };

      db.User.create(user, (err) => {
        if (err) {
          console.log(err);
          
          res.sendResult(null,401,"创建账户失败！");
        } else {
          res.sendResult(null,200,"创建账户成功！");
          
        }
      });
    }
  });
});
module.exports = router;
