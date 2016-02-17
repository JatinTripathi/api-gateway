var mongo=require('mongoose');

module.exports=mongo.model('users',{
    Email:'string',
    password:'string',
    firstName:'string',
    lastName:'string',
    profession:'string'
});