import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientProxyFactory, Transport} from '@nestjs/microservices';
import {AppController} from "./app.controller";
import {RedisClient} from 'redis';
import {CacheService} from "./cache.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
    ],
    controllers: [
        AppController
    ],
    providers: [
        CacheService,
        {
            provide: 'SUBSCRIBERS_SERVICE',
            useFactory: (configService: ConfigService) => {
                const user = configService.get('RABBITMQ_USER');
                const password = configService.get('RABBITMQ_PASS');
                const host = configService.get('RABBITMQ_HOST');
                const queueName = configService.get('RABBITMQ_QUEUE_NAME');
                const vhost = configService.get('RABBITMQ_QUEUE_VHOST');
                return ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`amqp://${user}:${password}@${host}/${vhost}`],
                        queue: queueName,
                        queueOptions: {
                            durable: true,
                        },
                    },
                })
            },
            inject: [ConfigService],
        },
        {
            provide: 'REDIS_CLIENT',
            useFactory: async (configService: ConfigService) => {
                return new RedisClient({
                    host: configService.get('REDIS_HOST'),
                    port: +configService.get('REDIS_PORT', 6379),
                });
            },
            inject: [ConfigService]
        },
    ],
})
export class AppModule {

}
