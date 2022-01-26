var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const api = require("./api/index.js");
var app = express();
// 允许跨域
app.use(require('cors')())
// 初始化统一响应机制
var resextra = require('./modules/resextra')
app.use(resextra)
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(__dirname + '/dist'))
app.use("/public/image/", express.static(__dirname + '/public/image/'))
api(app);

// 如果没有路径处理就返回 Not Found
app.use(function (req, res, next) {
  res.sendResult(null, 404, 'Not Found')
})


module.exports = app;
