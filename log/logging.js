var winston=require('winston');
winston.emitErrs=true;

var logger=new (winston.Logger)({
    transports:[
        new (winston.transports.Console)({
            timestamp:true,
            level:'info',
            handleExceptions:true,
            colorize:true

        }),
        new (winston.transports.File)({
            level:'debug',
            handleExceptions:true,
            filename:'./log/logfiles.log',
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
