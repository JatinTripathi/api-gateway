var localStrategy=require('passport-local').Strategy;
var users=require('../models/userColl');
var bCrypt=require('bcrypt-nodejs');
var Mailgun=require('mailgun-js');


//=================Mailgun Credentials===========//
var apiKey='key-42e20f5a90e601ebbdb9a52d8164733a';
var domainName='sandbox2dbe16208a5c4ca993c7d563adcac177.mailgun.org';
var sender='pratap.jatintripathi@gmail.com';



module.exports=function(passport){

    passport.use('signup',new localStrategy({usernameField:'email',passwordField:'password',passReqToCallback:true},function(req,email,password,done){

        var findOrCreateUser=function(){
            users.findOne({'email':email},function(err,user){
                if(err) throw err;
                if(user){
                    console.log('oops! User already exist in our database (console.log)');
                    return done(null,false,req.flash('message','User already exist (message flash)'));
                }
                else{
                    var newUser=new users();
                    newUser.email=email;
                    newUser.password=createHash(password);
                    newUser.firstName=req.body.firstName;
                    newUser.lastName=req.body.lastName;
                       
                    newUser.save(function(err){
                        if(err) throw err;
                        console.log('New Signup of '+users.email);
                        return done(null,newUser);
                    
                    //
                    //mailgun
                    //
                    });
                }
            });
        };
     
        process.nextTick(findOrCreateUser);

    }));

//==============password encryption=================//
    var createHash=function(password){
        return bCrypt.hashSync(password,bCrypt.genSaltSync(10),null);
    };

};
