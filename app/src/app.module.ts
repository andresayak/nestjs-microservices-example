import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    controllers: [AppController],
    providers: [
        {
            provide: 'SERVICE_A_SUBSCRIBE',
            useFactory: (configService: ConfigService) => {
                const user = configService.get('RABBITMQ_USER');
                const password = configService.get('RABBITMQ_PASS');
                const host = configService.get('RABBITMQ_HOST');
                const vhost = configService.get('RABBITMQ_QUEUE_VHOST');

                return ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [`amqp://${user}:${password}@${host}/${vhost}`],
                        queue: 'serviceA',
                        queueOptions: {
                            durable: true,
                        },
                    },
                })
            },
            inject: [ConfigService],
        },
    ],
})
export class AppModule {
}
