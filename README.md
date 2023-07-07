# Microservices with NestJS example

Microservices with NestJS: RabbitMQ, Redis, and Docker Compose Example

## Description

This project demonstrates how to work with microservices using NestJS, RabbitMQ, Redis and Docker Compose. 

It consists of two NestJS containers, one for the Swagger API documentation and a simple endpoint to create tasks and send them to RabbitMQ. 
The second NestJS container contains a microservice that implements the commands test1, test2, and test3. 

In the example, the first container calls the test1 command, and test1 calls the test2 and test3 commands. Before invoking a subcommand, the script checks whether the result of that command's execution is present in the cache. This is done for fault tolerance. 

If a task fails to execute completely for some reason, it will be restarted. 

If the subtasks have already been executed, it skips their execution and retrieves the results from the cache. The cache is stored in Redis, and after a successful task execution, the cache is cleared. 

All containers are launched using Docker Compose.

### Installation

1. To run this project locally, please follow the instructions below:

```
git clone git@github.com:andresayak/nestjs-microservices-example.git
```

2. Navigate to the project directory:

```
cd nestjs-microservices-example
```

3. Create a .env file in the root directory of the project and set the following environment variables:
```
RABBITMQ_QUEUE_NAME=test-subscribers
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_VHOST=test
```

### Usage

1. Start the Docker containers using Docker Compose:
```
   docker-compose up
```
2. Once the containers are up and running, you can access the Swagger API documentation at http://localhost. This endpoint allows you to create tasks and send them to RabbitMQ.
3. The microservice with the implementation of the test1, test2, and test3 commands will be available for communication through RabbitMQ. You can interact with it programmatically or via the Swagger API.
### License
This project is licensed under the MIT License.

### Contributing
Contributions are welcome! If you find any issues or want to enhance the project, feel free to open a pull request.

### Contact
If you have any questions or suggestions, please feel free to reach out to the project maintainer:
Thank you for using this project! 

I hope it helps you understand microservices with NestJS, RabbitMQ, and Redis using Docker Compose.
