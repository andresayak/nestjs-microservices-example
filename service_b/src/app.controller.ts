import {Controller, Inject} from '@nestjs/common';
import {ClientProxy, Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller()
export class AppController {
    constructor(@Inject('SERVICE_B') private client: ClientProxy) {
    }

    @MessagePattern('checkApproved')
    checkApproved(@Payload() data: string, @Ctx() context: RmqContext): Promise<any> {
        console.log('checkApproved', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                channel.ack(originalMsg);
                done(true);
            }, 2 * 1000);
        });
    }

    @MessagePattern('approve')
    approve(@Payload() data: string, @Ctx() context: RmqContext): Promise<any> {
        console.log('approve', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                channel.ack(originalMsg);
                done(true);
            }, 2 * 1000);
        });
    }

    @MessagePattern('getBalance')
    getBalance(@Payload() data: string, @Ctx() context: RmqContext): Promise<any> {
        console.log('getBalance', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                channel.ack(originalMsg);
                done(1);
            }, 2 * 1000);
        });
    }

    @MessagePattern('feed')
    feed(@Payload() data: string, @Ctx() context: RmqContext): Promise<any> {
        console.log('feed', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                channel.ack(originalMsg);
                done(1);
            }, 2 * 1000);
        });
    }

    @MessagePattern('sign')
    sign(@Payload() data: string, @Ctx() context: RmqContext): Promise<any> {
        console.log('sign', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                channel.ack(originalMsg);
                done(1);
            }, 2 * 1000);
        });
    }

    @MessagePattern('send')
    send(@Payload() data: string, @Ctx() context: RmqContext): Promise<any> {
        console.log('send', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                channel.ack(originalMsg);
                done(1);
            }, 2 * 1000);
        });
    }
}
