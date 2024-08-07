import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            log: [
                {
                    emit: 'event',
                    level: 'query',
                },
            ],
        });
    }

    async onModuleInit(): Promise<void> {
        await this.$connect();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // this.$on('query', async (e) => {
        //     if (process.env.NODE_ENV == "development") {
        //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //         // @ts-ignore
        //         console.log(`${e.query} ${e.params}`);
        //     }
        // });
    }

    async enableShutdownHooks(app: INestApplication): Promise<void> {
        // @ts-ignore
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}