var express=require('express');
var cookieParser=require('cookie-parser');
var passport=require('passport');
var session=require('express-session');
var path=require('path');
var bodyParser=require('body-parser');
var flash=require('connect-flash');
var passportInit=require('./passport/init');
var mongo=require('mongoose');
var logger=require('./log/logging.js');
var morgan=require('morgan');
var mongoSession=require('connect-mongo')(session);
var url=require('url');
var proxy=require('http-proxy');



//==============express config================//
var app=express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
//================logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length]',{'stream':logger.stream}));
logger.debug("Overriding 'Express' logger");



//==================db config=================//
mongo.connect('mongodb://mongo:27017/authen');



//==============view config==================//
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');



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
//==============passport config=================//
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
var isAuthenticated=function(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
};



//=================middleware(ifAthenticated)
var ifAuthenticated=function(req,res,next){
  if(req.isAuthenticated())
    res.redirect('/home');
  return next();
};



//================Index Routes=====================//
app.get('/',ifAuthenticated,function(req,res){
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

app.get('/home',isAuthenticated,function(req,res){
  res.render('home',{user:req.user});
});

app.get('/error',function(req,res){
  res.render('error');
});

app.get('/signout',function(req,res){
  req.logout();
  res.redirect('/');
});



//===============Proxy Server Routing==============//
var apiProxy=proxy.createProxyServer();

//=====End Points Address
var editor='http://localhost:8081';
var search='http://localhost:8983';

//=====End Points Routing
//Editor Microservice
app.all('/editor/*',isAuthenticated,function(req,res){
  logger.info('Transferring To Editor Microservice');
  apiProxy.web(req,res,{target:editor});
});

app.post('/publish',function(req,res,next){
  logger.info('Transferring to editor microservise for publishing');
  apiProxy.web(req,res,{target:editor});
  next();
}),function(req,res){
  res.redirect('/home');
};

//Search Microservice
app.all('/search/*',isAuthenticated,function(req,res){
  logger.info('Transferring To Search Microservice');
  //Persistent websocket connetion to search service
  apiProxy.ws(req,res,{target:search});
});


//===============port config==============//
var port=process.env.port || 8080;
app.listen(port);
logger.info('Server is listening at port '+port+'!');
