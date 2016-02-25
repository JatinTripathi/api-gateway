var winston=require('winston');
winston.emitErrs=true;

var logger=new (winston.Logger)({
    transports:[
        new (winston.transports.Console)({
            level:'info',
            handleExpection:true,
            colorize:true
            
        }),
        new (winston.transports.Console)({
            level:'debug',
            handleException:true,
            colorize:true
        })],    
    exitonErrors:false
    });

module.exports=logger;
module.exports.stream={
    write:function(message,encoding){
        logger.info(message);
    }
};
