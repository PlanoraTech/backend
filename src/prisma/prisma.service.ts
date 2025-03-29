import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
                { emit: 'event', level: 'error' },
            ],
        });
    }
    async onModuleInit() {
        this.$on('query' as never, (event: {message: string}) => {
            Logger.debug(event, PrismaService.name);
        });
        this.$on('info' as never, (event: {message: string}) => {
            Logger.log(event.message, PrismaService.name);
        });
        this.$on('warn' as never, (event: {message: string}) => {
            Logger.warn(event.message, PrismaService.name);
        });
        this.$on('error' as never, (event: {message: string}) => {
            Logger.error(event.message, PrismaService.name)
        });
        await this.$connect();
    }
}
