import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { AccessType, Roles } from "@prisma/client";
import { Permissions } from "@app/decorators/permissions.decorator";
import { User } from "@app/interfaces/User.interface";
import { SecretService } from "@app/auth/secret/secret.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly secretService: SecretService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let roles: Roles = this.reflector.get<Roles>(Permissions, context.getHandler());
        if (Array.isArray(roles) && roles.length === 0) {
            return true;
        }
        let request: (Request & { user: User }) = context.switchToHttp().getRequest<(Request & { user: User })>();
        if (request.user) {
            if (roles && (roles.includes(Roles.PRESENTATOR) && request.params.substitutePresentatorId)) {
                return (request.user.institutions.find((institution) => institution.institutionId === request.params.institutionId && (institution.role === Roles.PRESENTATOR && institution.presentatorId === request.params.substitutePresentatorId || institution.role === Roles.DIRECTOR)) != undefined) ? true : false;
            }
            return (request.user.institutions.find((institution) => institution.institutionId === request.params.institutionId && institution.role === Roles.DIRECTOR) != undefined) ? true : false;
        }

        switch (request.method) {
            case "GET":
                switch (await this.secretService.getInstitutionAccessById(request.params.institutionId as string)) {
                    case AccessType.PUBLIC:
                        return true;
                    case AccessType.PRIVATE:
                        let user: User = await this.secretService.seamlessAuth(request.query.token as string);
                        return (user.institutions.find((institution) => institution.institutionId === request.params.institutionId) != undefined) ? true : false;
                }
            default:
                return false;
        }
    }
}