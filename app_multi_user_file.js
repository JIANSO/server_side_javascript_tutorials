var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var sha256 = require('sha256');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));
app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(uname === user.username && sha256(pwd+user.salt) === user.password){
      req.session.displayName = user.displayName;
      return req.session.save(function(){
          res.redirect('/welcome');
      });
    }
  }
  res.send('Who are you? <a href="/auth/login">login</a>');
});
var users = [
  {
    username:'egoing',
    password:'4e3906f022fa70dc61b695c4a761956688cb97e724a51ca0aaafc5a97dea59c5',
    salt:'!@#@!#$aaa',
    displayName:'Egoing'
  },
  {
    username:'K8805',
    password:'0b5699baf59161ae196596d500f5b1531b92916c3f840950a2815b28bdb50eed',
    salt:'!@#$adsfav#@$',
    displayName:'K5'
  }
];
app.post('/auth/register', function(req, res){
  var user = {
    username:req.body.username,
    password:req.body.password,
    displayName:req.body.displayName
  };
  users.push(user);
  req.session.displayName = req.body.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
app.get('/auth/register', function(req, res){
  var output = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});
app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});
app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
