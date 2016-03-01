var express=require('express');
var cookieParser=require('cookie-parser');
var passport=require('passport');
var session=require('express-session');
var path=require('path');
var bodyParser=require('body-parser');
var flash=require('connect-flash');
var passportInit=require('./passport/init');
var mongo=require('mongoose');
var Mailgun=require('mailgun-js');
var logger=require('./log/logging.js');
var morgan=require('morgan');
var mongoSession=require('connect-mongo')(session);
var url=require('url');



//==============express config================//
var app=express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

//================logging
app.use(morgan('combine',{'stream':logger.stream}));
logger.debug("Overriding 'Express' logger");



//==================db config=================//
mongo.connect('mongodb://localhost:27017/authen');



//==============view config==================//
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');



//==============passport config=================//
//================middleware(session)
app.use(session({
    secret:'authentication',
    saveUninitialized:true,
    resave:true,
    store:new mongoSession({
        mongooseConnection:mongo.connection,
        db:'local',
        collection:'sessions',
        autoRemove:'disabled',
    })
}));

app.use(passport.initialize());
app.use(passport.session());
passportInit(passport,logger);
app.use(passport.authenticate('rememberMe'));
app.use(flash());


//================middleware(pageViews)
app.use(function(req,res,next){
  var views=req.session.views;
  if(!views){views=req.session.views={};}
  else{
    var pathname=url.parse(req.url).pathname;
    views[pathname]=(views[pathname]||0)+1;
  }
  next();
});



//================middleware(isAuthenticated)
var isAutenticated=function(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
};


//=================Mailgun Credentials===========//
var apiKey='key-42e20f5a90e601ebbdb9a52d8164733a';
var domainName='sandbox2dbe16208a5c4ca993c7d563adcac177.mailgun.org';
var sender='pratap.jatintripathi@gmail.com';



//==============ROUTES====================//
app.get('/',function(req,res){
   res.render('signin',{message:req.flash('req.session.views['/']'+'time')});
});

app.post('/signin',passport.authenticate('signin',{
  successRedirect:'/home',
  failureRedirect:'/signup',
  failurFlash:true}));

app.get('/signup',function(req,res){
  res.render('signup',{message:req.flash('message')});
});

app.post('/signup',passport.authenticate('signup',{
  successRedirect: '/home',
  failureRedirect:'/',
  failureFlash:true}));

app.get('/home',isAutenticated,function(req,res){
  res.render('home',{user:req.user});
});

app.get('/error',function(req,res){
  res.render('error');
});

app.get('/signout',function(req,res){
  req.logout();
  res.redirect('/');
});


//===============port config==============//
var port=process.env.port || 8080;
app.listen(port);
logger.info('Server is listening at port '+port+'!');
