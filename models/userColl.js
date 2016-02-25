var mongo=require('mongoose');

module.exports=mongo.model('users',{
    id:'string',
    email:'string',
    password:'string',
    firstName:'string',
    lastName:'string',
    profession:'string'
});
