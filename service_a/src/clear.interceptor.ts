import {CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, Scope} from "@nestjs/common";
import {ClientProxy, CONTEXT, RequestContext} from "@nestjs/microservices";
import {Observable, tap} from "rxjs";
import {CacheService} from "./cache.service";

@Injectable({scope: Scope.REQUEST})
export class ClearCacheInterceptor implements NestInterceptor {

    constructor(@Inject(CONTEXT) private ctx: RequestContext,
                @Inject('SERVICE_B_SUBSCRIBE') private client: ClientProxy,
                @Inject(CacheService) private cache: CacheService) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(async () => {
                    this.ackChannel();
                    await this.cache.del(this.getCacheIdByTaskContext());
                    console.log(`After... ${Date.now() - now}ms`)
                }),
            );
    }

    ackChannel() {
        const channel = this.ctx.getContext().getChannelRef();
        const originalMsg = this.ctx.getContext().getMessage();
        channel.ack(originalMsg);
    }

    getCacheIdByTaskContext(): string {
        const originalMsg = this.ctx.getContext().getMessage();
        const taskId = originalMsg.properties.correlationId;
        return 'task_' + taskId;
    }
}
