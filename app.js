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
//var update = require('update');
var git = require("nodegit");


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
var db = mongoose.connect(mongoDB, { user: '', pass: '' }, function (err) {
  if (err) {
    console.log('houve um erro na conexão com o banco');
  } else {
    console.log('não houve um erro na conexão com o banco');

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }
});

// view engine setup

hbs.registerHelper('checkedBox', function (check) {

  check = hbs.Utils.escapeExpression(check);
  var result = '';

  if (check === 'true') {
    result = ' checked ';
  }

  return new hbs.SafeString(result);
});

hbs.registerHelper('select', function (_id_nivel, option) {
  option = hbs.Utils.escapeExpression(option);
  _id_nivel = hbs.Utils.escapeExpression(_id_nivel);
  var result = '';
  if (option === _id_nivel) {
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
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Application' });
});


// mount the router on the app
app.use('/', router);
app.use('/users', users);
app.use('/funcionario', funcionario);
app.use('/nivel_de_acesso', nivel_de_acesso);



console.log('Application Iniciada...')

/*
// Clone a given repository into the `./tmp` folder.
git.Clone("https://github.com/deividoliver/funcionarios", "../../teste")
  // Look up this known commit.
  .then(function (repo) {
    console.log('chegou aqui');
    // Use a known commit sha from this repository.
    return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
  })
  // Look up a specific file within that commit.
  .then(function (commit) {
    return commit.getEntry("README.md");
  })
  // Get the blob contents from the file.
  .then(function (entry) {
    // Patch the blob to contain a reference to the entry.
    return entry.getBlob().then(function (blob) {
      blob.entry = entry;
      return blob;
    });
  })
  // Display information about the blob.
  .then(function (blob) {
    // Show the path, sha, and filesize in bytes.
    console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");


    // Show a spacer.
    console.log(Array(72).join("=") + "\n\n");

    // Show the entire file.
    console.log(String(blob));
  })
  .catch(function (err) { console.log(err); });*/


var repoDir = "../../teste";
console.log('implementação para a pasta teste 2');
var repository;

// Open a repository that needs to be fetched and fast-forwarded
git.Repository.open(path.resolve(__dirname, repoDir))
  .then(function(repo) {
    repository = repo;

    return repository.fetchAll({
      callbacks: {
        credentials: function(url, userName) {
          return git.Cred.sshKeyFromAgent(userName);
        },
        certificateCheck: function() {
          return 1;
        }
      }
    });
  })
  // Now that we're finished fetching, go ahead and merge our local branch
  // with the new one
  .then(function() {
    return repository.mergeBranches("master", "origin/master");
  })
  .done(function() {
    console.log("Done!");
  });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
