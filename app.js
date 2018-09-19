var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
// //配置跨域模块
//var cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
////类似login 的路由对象
var detailRouter = require('./routes/detail');
var productRouter = require('./routes/product');
var userassetRouter = require('./routes/userasset');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//配置跨域模块;允许哪个地址跨域访问
// app.use(cors({
//     origin:['http://127.0.0.1:8080','http://localhost:8080','http://127.0.0.1:8000','http://localhost:8000'],
//     credentials:true
// }));

app.use(logger('dev'));
// :status 状态码 :url :date 日期  :tiny 预定义格式化 :short  :dev
// 将日志信息进行永久存储
var logStream = fs.createWriteStream(__dirname + 'public/log.txt');
app.use(logger('short',{stream: logStream}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);

app.use('/detail',detailRouter);
app.use('/product',productRouter);
app.use('/assets',userassetRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 // res.render('error');
});

module.exports = app;
