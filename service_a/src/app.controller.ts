import {
    Controller,
    Inject,
    UseInterceptors
} from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {ServiceB} from './service-b.service';
import {ClearCacheInterceptor} from "./clear.interceptor";

@Controller()
export class AppController {
    constructor(@Inject(ServiceB) private serviceB: ServiceB) {
    }

    @UseInterceptors(ClearCacheInterceptor)
    @MessagePattern('businessCase1')
    async businessCase1(@Payload() payload: { address: string }, @Ctx() context: RmqContext): Promise<any> {
        const {address} = payload;

        const isApproved = await this.serviceB.checkApproved(address, '123');
        if (!isApproved) {
            await this.serviceB.approve('123');
        }
        const balance = await this.serviceB.getBalance(address);
        if (balance < 5) {
            await this.serviceB.feed(address, 5 - balance);
        }

        const signature = await this.serviceB.sign();

        return await this.serviceB.send('123', address, signature);
    }
}
