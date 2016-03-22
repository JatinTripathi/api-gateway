# API Gateway Microservice
Working as a first layer of a microservices application, it provides initialization of user experience by authenticating and then autherizing to use other end microservices by reverse proxing all the request to appropriate services.
Its a plain script for creating an API gateway with close to really basic UI(working on improvements). 

##Prerequisites:
*Docker-engine
*Mongodb Docker Container

##Built-up
Start Docker Engine and Mongo Container,
Run
'docker build --name <username>/api-gateway /path/to/Dokerfile'
in your terminal and then,
'docker run -it --link mongo:db <username>/api-gateway bash'

##APIs
This microservice have few consumable API
