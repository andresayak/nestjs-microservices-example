import {Inject} from "@nestjs/common";
import {RedisClient} from "redis";

export class CacheService {
    constructor(@Inject('REDIS_CLIENT') private client: RedisClient) {
    }

    async hset(key: string, field: string, value: string): Promise<void> {
        return new Promise((done) => {
            this.client.hset(key, field, JSON.stringify(value), done);
        });
    }

    async del(key: string): Promise<void> {
        return new Promise((done) => {
            this.client.del(key, done);
        });
    }

    async hget(key: string, field: string): Promise<string | undefined> {
        return await new Promise(done => this.client.hget(key, field, (err, reply) => {
            return done(JSON.parse(reply));
        }));
    }
}
