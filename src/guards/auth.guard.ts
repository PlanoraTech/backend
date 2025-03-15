import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { AccessType } from "@prisma/client";
import { Access } from "@app/decorators/access.decorator";
import { User } from "@app/interfaces/User.interface";
import { SecretService } from "@app/auth/secret/secret.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly secretService: SecretService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let access: AccessType = this.reflector.get<AccessType>(Access, context.getHandler());
        let request: (Request & { user: User }) = context.switchToHttp().getRequest<(Request & { user: User })>();
        if (!access) {
            request.user = await this.secretService.seamlessAuth(request.query.token as string);
            return true;
        }
        switch (access) {
            case AccessType.PUBLIC:
                return true;
            default:
                request.user = await this.secretService.seamlessAuth(request.query.token as string);
                return true;
        }
    }
}