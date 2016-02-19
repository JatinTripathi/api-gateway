var localStrategy=require('passport-local');
var users=require('../models/userColl');
var bCrypt=require('bcrypt-nodejs');

module.exports=function(passport){

    passport.use('signup',new localStrategy({passReqToCallback:true},function(req,Email,password,done){

        var findOrCreateUser=function(){
            users.findOne({'email':email},function(err,user){
                if(err) throw asdfg;
                if(user){
                    console.log('oops! User already exist in our database (console.log)');
                    return done(null,false,req.flash('message','User already exist (message flash)'));
                }
                else{
                    var newUser=new user();
                    newUser.email=req.param('email');
                    newUser.password=createHash('password');
                    newUser.firstName=req.param('firstName');
                    newUser.lastName=req.param('lastName');

                    newUser.save(function(err){
                        if(err) throw err;
                        console.log('Wohoo! You are a part of us now.');
                    return done(null,newUser);
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
