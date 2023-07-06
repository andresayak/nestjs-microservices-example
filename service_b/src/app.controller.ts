import {Controller, Inject} from '@nestjs/common';
import {ClientProxy, Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {CacheService} from "./cache.service";

@Controller()
export class AppController {
    constructor(@Inject('SUBSCRIBERS_SERVICE') private client: ClientProxy,
                @Inject(CacheService) private cache: CacheService) {
    }

    async runSubTask(context: RmqContext, cmd: string, data: any,): Promise<any> {
        const key = this.getCacheIdByTaskContext(context);
        let result = await this.cache.hget(key, cmd);
        if (!result) {
            result = await new Promise((done) => {
                this.client.send(cmd, data).subscribe(done);
            });
            await this.cache.hset(key, cmd, JSON.stringify(result));
        }
        return result;
    }

    getCacheIdByTaskContext(context: RmqContext): string {
        const originalMsg = context.getMessage();
        const taskId = originalMsg.properties.correlationId;
        return 'task_' + taskId;
    }

    @MessagePattern('test1')
    async test1(@Payload() data: string, @Ctx() context: RmqContext): Promise<string> {
        console.log('data1', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        let nextMessage = await this.runSubTask(context, 'test2', data);
        channel.ack(originalMsg);
        await this.cache.del(this.getCacheIdByTaskContext(context));
        return 'OK 1\t' + nextMessage;
    }

    @MessagePattern('test2')
    async test2(@Payload() data: string, @Ctx() context: RmqContext): Promise<string> {
        console.log('data2', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        let nextMessage = await this.runSubTask(context, 'test3', data);
        return new Promise((done) => {
            setTimeout(async () => {
                console.log('OK 2 success');
                channel.ack(originalMsg);
                await this.cache.del(this.getCacheIdByTaskContext(context));
                done('OK 2\t' + nextMessage)
            }, 10 * 1000);
        });
    }

    @MessagePattern('test3')
    test3(@Payload() data: string, @Ctx() context: RmqContext): Promise<string> {
        console.log('data3', data);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        return new Promise((done) => {
            setTimeout(async () => {
                const message = 'OK 3 ' + new Date().getTime();
                console.log(message);
                channel.ack(originalMsg);
                done(message);
            }, 10 * 1000);
        });
    }
}
