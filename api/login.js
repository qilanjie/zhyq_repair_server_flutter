const express = require("express");
const router = express.Router();
const secret = {
  cert: "123",
};
const jwt = require("jsonwebtoken");
const db = require("../db/db.js");
const sha1 = require("sha1");

const creatToken = (id, userName, role) => {
  return jwt.sign(
    {
      id: id,
      userName: userName,
      role: role,
    },
    secret.cert,
    { expiresIn: "7d" }
  );
};

router.post("/api/private/v1/login", (req, res) => {
  console.log(req.body);
  db.User.findOne({ userName: req.body.userName }, (err, doc) => {
    if (err) {
      console.log(err);
    } else if (doc) {
      
      const salt = doc.salt;
      if (doc.userPassword === sha1(req.body.userPassword + salt)) {
        const token = creatToken(doc._id, doc.userName, doc.role);
        
        res.sendResult({
          id: doc._id,
          name: doc.userName,
          token: token,
        },200,"登录成功！")
       
      } else {
        res.sendResult(null,401,"密码不正确！");
      }
    } else {
      res.sendResult(null,401,"此用户未注册！");
      
    }
  });
});

module.exports = router;
