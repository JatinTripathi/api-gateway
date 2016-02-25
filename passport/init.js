var users=require('../models/userColl');
var signinStrategy=require('./signin');
var signupStrategy=require('./signup');
var rememberMeStrategy=require('./rememberMe');


module.exports=function(passport){
    passport.serializeUser(function(user,done){
        console.log('Serializing user: '+user);
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        users.findById(id,function(err,user){
            if(err) throw err;
            console.log('Desirializing User: '+user.firstName+' '+user.lastName);
            done(err,user);
        });
    });
    signinStrategy(passport);
    signupStrategy(passport);
    rememberMeStrategy(passport,logger);
};
