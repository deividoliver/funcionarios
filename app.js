  'use strict'
  //require node_modules
  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var hbs = require('express-hbs');
  var mongoose = require('mongoose');
  var session = require('express-session');
  var update = require('update');

  //require routes
  var index = require('./routes/index');
  var users = require('./routes/users');
  var funcionario = require('./controllers/funcionario');
  var nivel_de_acesso = require('./controllers/nivel_de_acesso')

  var app = express();

  app.use(session({
  secret: 'keyboard cat',
  }));

  //Set up default mongoose connection
  var mongoDB = 'mongodb://127.0.0.1/empresa';

  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
  //Get the default connection
  var db = mongoose.connect(mongoDB,{ user: '', pass: '' }, function(err){
    if(err){
      console.log('houve um erro na conexão com o banco');
    }else{
      console.log('não houve um erro na conexão com o banco');

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:')); 
    }
  });

  // view engine setup
  
  hbs.registerHelper('checkedBox', function(check) {
    
    check = hbs.Utils.escapeExpression(check);
    var result = '';
    
    if(check === 'true'){
      result = ' checked ';  
    } 

    return new hbs.SafeString(result);
  });

  hbs.registerHelper('select', function(_id_nivel, option){
    option = hbs.Utils.escapeExpression(option);
    _id_nivel = hbs.Utils.escapeExpression(_id_nivel);
    var result = '';
    if(option === _id_nivel){
      result = ' selected ';
    }

    return new hbs.SafeString(result);
  });

  app.engine('html', hbs.express4({
    partialsDir: __dirname + '/views/partials',
    extname: 'html'
  }));
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');


  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  var router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Application' });
  });


  // mount the router on the app
  app.use('/', router);
  app.use('/users', users);
  app.use('/funcionario',funcionario);
  app.use('/nivel_de_acesso', nivel_de_acesso);



  console.log('Application Iniciada...')


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;
