var localStrategy=require('passport-local');
var users=require('../models/userColl');
var bcrypt=require('bcrypt-nodejs');

module.exports=function(passport){
//==================local strategy======================//
    passport.use('signin',
    new localStrategy({passReqToCallback:true},
    function(req,email,password,done){
       
        users.findOne({'email':email},function(err,user){
           
           if(err) throw err;
           
           if(!user){
              console.log('E-mail ID is not registered');
              return done(null,false,req.flash(('message','Invalid E-mail ID')))}
           
           
           if(!isValidPassword){
              console.log('Invalid Password');
              return done(null,false,req.flash('message','Invalid Password'))}
           
           
           return done(null,user);
           }
        )}
     ));
     
     
//===============password processing=====================//
     var isValidPassword=function(user,password){
       return bcrypt.comparesync(password,user.password);
    };
};