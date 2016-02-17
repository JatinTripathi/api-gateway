var users=require('../models/userColl');

module.exports=function(passport){
    passport.serializeUser(function(user,done){
        console.log('Serializing user: '+user);
        done(null,user.Email);
    });
    
    passport.deserializeUser(function(id,done){
        users.findbyId(id,function(err,user){
            if(err) throw err;
            console.log('Desirializing User: '+user.firstName+' '+user.lastName);
            done(err,user);
        });
    });
};