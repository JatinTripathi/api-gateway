var remember=require('passport-remember-me').Strategy;

module.exports=function(passport,logger){
  passport.use('rememberMe',
  new remember(
    function(token,done){
      Token.consume(token,function(err,user){
        if(err) logger.debug(err);
        if(!user){return(null,false);}
        return(null,user);
      });
    },
    function(user,done){
      var token=utils.generateTocken(64);
      Token.save(tocken,{userId:users.id},function(err){
        if(err) throw err;
        return done(null,user);
      });
    }
  ));
};
