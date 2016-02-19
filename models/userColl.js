var mongo=require('mongoose');

module.exports=mongo.model('users',{
    email:'string',
    password:'string',
    firstName:'string',
    lastName:'string',
    profession:'string'
});
