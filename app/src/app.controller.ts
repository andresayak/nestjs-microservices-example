import {Controller, Get, Inject, Param} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";

@Controller()
export class AppController {
    constructor(@Inject('SERVICE_A_SUBSCRIBE') private client: ClientProxy) {
    }

    @Get('/businessCase1/:address')
    businessCase1(@Param('address') address: string) {
        return new Promise((done, reject) => {
            try {
                this.client.send('businessCase1', address).subscribe(done);
            } catch (e) {
                reject();
            }
        })
    }
}
