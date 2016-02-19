module.exports=function(req){
  var data={
    from:'Jatin Tripathi',
    to:req.param.Email,
    subject:'My Verification Mail',
    html:'Hey, you trying my application hah. Alright then <a href="http://0.0.0.0:3030/home?' + req.params.mail + '">Click Here to authenticate your account</a>'
  }
  return data;
};
