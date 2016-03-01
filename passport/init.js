var users=require('../models/userColl');
var signinStrategy=require('./signin');
var signupStrategy=require('./signup');
var rememberMeStrategy=require('./rememberMe');


module.exports=function(passport,logger){
    passport.serializeUser(function(user,done){
        logger.info('Serializing user: '+user.email);
        done(null,user._id);
    });

    passport.deserializeUser(function(id,done){
        users.findById(id,function(err,user){
            if(err) throw err;
            logger.info('Desirializing User: '+user.firstName+' '+user.lastName);
            done(err,user);
        });
    });
    signinStrategy(passport);
    signupStrategy(passport);
    rememberMeStrategy(passport,logger);
};
