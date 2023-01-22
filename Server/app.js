var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var productRouter = require('./routes/productRouter');
var cartRouter = require('./routes/cartRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/ZakkaDB';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/cart',cartRouter);
app.use('/', indexRouter);
/*

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders',leaderRouter);
*/
app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
