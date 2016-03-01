var localStrategy=require('passport-local').Strategy;
var users=require('../models/userColl');
var bcrypt=require('bcrypt-nodejs');

module.exports=function(passport,logger){
//==================local strategy======================//
    passport.use('signin',
    new localStrategy({passReqToCallback:true,
            usernameField:'email',
            passwordField:'password'},
        function(req,email,password,done){
         
            users.findOne({'email':email},function(err,user){
              
               if(err) logger.debug('Some error in finding emails');
                   
               if(user){
                  console.log('E-mail ID is not registered');
                  return done(null,false,req.flash(('message','Invalid E-mail ID')));}
                 
                   
               if(!isValidPassword(user,password)){
                  console.log('Invalid Password');
                  return done(null,false,req.flash('message','Invalid Password'));}
                 
                 
               return done(null,user);
               }
            );}
         ));


//===============password processing=====================//
     var isValidPassword=function(user,password){
         logger.info('Encrypting Password');
       return bcrypt.compareSync(password,user.password);
    };
};
