var express=require('express');
var logger=require('morgan');
var cookieParser=require('cookie-parser');
var passport=require('passport');
var session=require('express-session');
var path=require('path');
var bodyParser=require('body-parser');
var flash=require('flash');
var passportInit=require('./passport/init');
var mongo=require('mongoose');



//==============express config================//
var app=express();
app.use(logger('combine'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));


//==================db config=================//
mongo.connect('mongodb://localhost:27017/passport');


//==============view config==================//
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');


//==============passport config=================//
app.use(session({secret:'authen',saveUninitialized:true,resave:true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportInit(passport);


//==============ROUTES====================//
app.get('/',function(req,res){
   res.render('signin',{message:req.flash('message')});
});
app.get('/signup',function(req,res){
  res.render('signup',{message:req.flash('message')});
});
app.post('/signin',passport.authenticate('login',{
  successRedirect:'/home',
  failureRedirect:'/',
  failurFlash:true
}));
app.post('/signup',passport.authenticate('signup',{
  successRedirect:'/home',
  failurRedirect:'/signup',
  failurFlash:true
}))


//===============port config==============//
var port=process.env.port || 8080;
app.listen(port);
console.log('Server is listening at port '+port+'!');
