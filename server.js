var express=require('express');
var cookieParser=require('cookie-parser');
var passport=require('passport');
var session=require('express-session');
var path=require('path');
var bodyParser=require('body-parser');
var flash=require('flash');
var passportInit=require('./passport/init');
var mongo=require('mongoose');
var Mailgun=require('mailgun-js');
var logger=require('./log/logging.js');
var morgan=require('morgan');



//==============express config================//
var app=express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

//==logging
app.use(morgan('combine',{'stream':logger.stream}));
logger.debug("Overriding 'Express' logger");



//==================db config=================//
mongo.connect('mongodb://localhost:27017/authen');



//==============view config==================//
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');



//==============passport config=================//
app.use(session({secret:'authen',saveUninitialized:true,resave:true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportInit(passport,logger);



//=================Mailgun Credentials===========//
var apiKey='key-42e20f5a90e601ebbdb9a52d8164733a';
var domainName='sandbox2dbe16208a5c4ca993c7d563adcac177.mailgun.org';
var sender='pratap.jatintripathi@gmail.com';



//==============ROUTES====================//
app.get('/',function(req,res){
   res.render('signin',{message:req.flash('message')});
});

app.post('/signin',passport.authenticate('signin',{
  successRedirect:'/home',
  failureRedirect:'/',
  failurFlash:true}));

app.get('/signup',function(req,res){
  res.render('signup',{message:req.flash('message')});
});

app.post('/signup',passport.authenticate('signup',{
  successRedirect: '/home',
  failureRedirect:'/',
  failureFlash:true}));

app.get('/home',function(req,res){
  
//mailgun verification mail setup
  var mailer=new Mailgun({apikey:apiKey,domain:domainName});
  var data={
    from:sender,
    to:req.body.email,
    subject:'Verification Mail',
    html:'Hey, you trying my application hah. Alright then <a href="http://0.0.0.0:3030/home?' + req.params.mail + '">Click Here to authenticate your account</a>'
  };
  mailer.message().send(data,function(err,body){
    if(err) throw err;
    else{
      console.log('Sent Verification Mail');
    }
  });
  
  res.render('home',{user:req.user});
});

app.get('/error',function(req,res){
  res.render('error');
});



//===============port config==============//
var port=process.env.port || 8080;
app.listen(port);
logger.info('Server is listening at port '+port+'!');
