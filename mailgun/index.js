var verification=require('./verification');

module.exports=function(Mailgun,req){

  var apiKey='key-42e20f5a90e601ebbdb9a52d8164733a';
  var domainName='sandbox2dbe16208a5c4ca993c7d563adcac177.mailgun.org';
  var sender='pratap.jatintripathi@gmail.com';

  var mailgun=new Mailgun({apikey:apikey,domain:domainName});

  verification(req);
  return data;
};
