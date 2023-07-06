import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {AppModule} from './app.module';

async function bootstrap() {
    const user = process.env['RABBITMQ_USER'];
    const password = process.env['RABBITMQ_PASS'];
    const host = process.env['RABBITMQ_HOST'];
    const queueName = process.env['RABBITMQ_QUEUE_NAME'];
    const vhost = process.env['RABBITMQ_QUEUE_VHOST'];

    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: [`amqp://${user}:${password}@${host}/${vhost}`],
            queue: queueName,
            noAck: false,
            queueOptions: {
                durable: true
            },
        },
    });
    await microservice.listen()
}

bootstrap();
