import {Controller, Get, Inject} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";

@Controller()
export class AppController {
    constructor(@Inject('SUBSCRIBERS_SERVICE') private client: ClientProxy) {
    }

    @Get('/create_task')
    getHello() {
        return new Promise((done, reject) => {
            try {
                this.client.send('test1', 'Start_' + new Date().getTime()).subscribe(async (observerOrNext) => {
                    const result = await observerOrNext;
                    console.log('result', result);
                    done(result);
                });
            } catch (e) {
                reject();
            }
        })
    }
}
