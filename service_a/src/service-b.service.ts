import {Inject, Injectable, Scope} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {CacheService} from "./cache.service";
import {CONTEXT, RequestContext} from '@nestjs/microservices';

@Injectable({scope: Scope.REQUEST})
export class ServiceB {
    constructor(@Inject(CONTEXT) private ctx: RequestContext,
                @Inject('SERVICE_B_SUBSCRIBE') private client: ClientProxy,
                @Inject(CacheService) private cache: CacheService) {
    }

    public checkApproved(address: string, value: string) {
        return this.request('checkApproved', {value});
    }

    public approve(value: string) {
        return this.request('approve', {value});
    }

    public async getBalance(address: string): Promise<number> {
        const result = await this.request('getBalance', {address});
        return parseInt(result);
    }

    public feed(address: string, value: number): Promise<any> {
        return this.request('feed', {address, value});
    }

    public send(value: string, address: string, signature: string): Promise<any> {
        return this.request('send', {address, value, signature});
    }

    public sign(): Promise<any> {
        return this.request('sign');
    }

    protected async request(command: string, params: any = {}): Promise<any> {
        const key = this.getCacheIdByTaskContext();
        let result = await this.cache.hget(key, command);
        if (!result) {
            result = await new Promise((done) => {
                this.client.send(command, params).subscribe(done);
            });
            await this.cache.hset(key, command, JSON.stringify(result));
        }
        return result;
    }

    protected getCacheIdByTaskContext(): string {
        const originalMsg = this.ctx.getContext().getMessage();
        const taskId = originalMsg.properties.correlationId;
        return 'task_' + taskId;
    }

}
