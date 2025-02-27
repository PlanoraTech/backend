import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { AccessType, Roles } from "@prisma/client";
import { Access, AccessTypes } from "@app/decorators/access.decorator";
import { SecretService } from "@app/endpoints/auth/secret/secret.service";

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let access: AccessTypes = this.reflector.get<AccessTypes>(Access, context.getHandler());
        if (!access) {
            return true;
        }
        let request: Request = context.switchToHttp().getRequest();
        switch (access) {
            case AccessTypes.RESTRICTED:
                switch (await SecretService.getInstitutionAccessById(request.params.institutionId)) {
                    case AccessType.PUBLIC:
                        return true;
                    case AccessType.PRIVATE:
                        if (await SecretService.seamlessAuth(request.query.token as string)) {
                            return await SecretService.getIfInstitutionIsAssignedToAUserByToken(request.query.token as string, request.params.institutionId);
                        }
                        return false;
                    default:
                        return false;
                }
            case AccessTypes.GRANTED:
                return await this.checkAccess(request.query.token as string, request.params.institutionId, [Roles.PRESENTATOR, Roles.DIRECTOR]);
            case AccessTypes.PRIVATE:
                return await this.checkAccess(request.query.token as string, request.params.institutionId, [Roles.DIRECTOR]);
            default:
                return false;
        }
    }

    private async checkAccess(token: string, institutionId: string, roles: Roles[]): Promise<boolean> {
        if (await SecretService.seamlessAuth(token)) {
            return await SecretService.getIfRoleWithInstitutionIsAssignedToAUserByToken(token, institutionId, roles);
        }
        return false;
    }
}