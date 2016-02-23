var winston=require('winston');
var app=require('express')();
var morgan=require('morgan');
winston.emitErrs=true;


    var logger=new winston.Logger({
        transport:[
            new winston.transports.File({
                level:'info',
                filename:'./logfiles.log',
                handleException:true,
                json:true,
                maxsize:5242880,
                maxFiles:5,
                colorize:true
            }),
            new winston.transports.Console({
                level:'debug',
                handleException:true,
                json:false,
                colorize:true
            })],
        exitOnError:false
    });

module.exports=logger;
module.exports.stream={
    write:function(message,encoding){
        logger.info(message);
    }
};

app.use(morgan('combine',{'stream':logger.stream}));