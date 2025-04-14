import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AccessType } from '@prisma/client';
import { Access } from '@app/decorators/access.decorator';
import { User } from '@app/interfaces/user';
import { SecretService } from '@app/auth/secret/secret.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly secretService: SecretService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const access: AccessType = this.reflector.get<AccessType>(
            Access,
            context.getHandler(),
        );
        const request: Request & {
            headers: { authorization: string };
            user: User;
            token: string;
        } = context.switchToHttp().getRequest<
            Request & {
                headers: { authorization: string };
                user: User;
                token: string;
            }
        >();
        if (!access) {
            request.token = this.secretService.extractTokenFromHeader(
                request.headers.authorization,
            );
            request.user = await this.secretService.seamlessAuth(request.token);
            return true;
        }
        switch (access) {
            case AccessType.PUBLIC:
                return true;
            default:
                request.token = this.secretService.extractTokenFromHeader(
                    request.headers.authorization,
                );
                request.user = await this.secretService.seamlessAuth(
                    request.token,
                );
                return true;
        }
    }
}
