import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { AccessType, Roles } from "@prisma/client";
import { Access, AccessTypes } from "../decorators/access.decorator";
import { SecretService } from "../endpoints/auth/secret/secret.service";

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
                        switch (await SecretService.seamlessAuth(request.query.token as string)) {
                            case true:
                                switch (await SecretService.getIfInstitutionIsAssignedToAUserByToken(request.query.token as string, request.params.institutionId)) {
                                    case true:
                                        return true;
                                    default:
                                        return false;
                                }
                            default:
                                return false;
                        }
                    default:
                        return false;
                }
            case AccessTypes.PRIVATE:
                switch (await SecretService.seamlessAuth(request.query.token as string)) {
                    case true:
                        switch (await SecretService.getIfRoleIsAssignedToAUserByToken(request.query.token as string, Roles.DIRECTOR)) {
                            case true:
                                switch (await SecretService.getIfInstitutionIsAssignedToAUserByToken(request.query.token as string, request.params.institutionId)) {
                                    case true:
                                        return true;
                                    default:
                                        return false;
                                }
                            default:
                                return false;
                        }
                    default:
                        return false;
                }
            default:
                return false;
        }
    }
}