# API Gateway Microservice
Working as a first layer of a microservices application, it provides initialization of user experience by authenticating and then autherizing to use other end microservices by reverse proxing all the request to appropriate services.
Its a plain script for creating an API gateway with close to really basic UI(working on improvements). 

## Prerequisites:
* Docker-engine
* Mongodb Docker Container

## Built-up
Start Docker Engine and Mongo Container,
Run
`docker build --name <username>/api-gateway /path/to/api-gateway's/Dokerfile`
in your terminal and then,
`docker run -it --link mongo:db <username>/api-gateway bash`
This service will work on port 8080.

## APIs
This microservice communicates with clients and End-Services using HTTP RESTful API mostly GET and POST. The service consumes initial GET and POST Request to authenticate and autherize the users and then storing all the user data in Mongodb Database.
Then for better user experience there are features like,
* Remember Me
* Keep me Signed In: If user leaves the application without signing-out
* Email Verification (In Progress)

For Initialization
`GET  localhost:8080/`

For Singing In
`POST localhost:8080/signin`
with an application content body in JSON format, it will constitute a password and an Email ID property fields

For Requesting Sign Up Page
`GET localhost:8080/signup`

FOR Posting Data
`POST localhost:8080/signup`
This request will constitute four property fields in JSON Format, below is the user database model
```javascript
mongoose.model({
  _id:String,
  password:String,
  email:String,
  firstName:String,
  lastName:String})
```

Then using Express.js and http-proxy libraries of Node.js, proxying rest of the HTTP request to responsible services
I have used my other microservices for [Online Editor](https://github.com/JatinTripathi/editor-service) and [Search](https://github.com/JatinTripathi/search-service) as end services with this gateway
```javascript
//===============Proxy Server Routing==============//
var apiProxy=proxy.createProxyServer();

//=====End Points Address
var editor='http://editor';
var search='http://search';

//=====End Points Routing
//Editor Microservice
app.all('/editor/*',isAuthenticated,function(req,res){
  logger.info('Transferring To Editor Microservice');
  apiProxy.web(req,res,{target:editor});
});

//Search Microservice
app.all('/search/*',isAuthenticated,function(req,res){
  logger.info('Transferring To Search Microservice');
  //Persistent websocket connetion to search service
  apiProxy.ws(req,res,{target:search});
});
```
