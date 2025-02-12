import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { SecretService } from "../endpoints/auth/secret/secret.service";
import { Access, AccessTypes } from "../decorators/access.decorator";
import { InstitutionsService } from "src/endpoints/institutions/institutions.service";
import { AccessType, Roles } from "@prisma/client";
import { UsersService } from "src/endpoints/users/users.service";

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
                switch (await InstitutionsService.getInstitutionAccessById(request.params.institutionId)) {
                    case AccessType.PUBLIC:
                        return true;
                    case AccessType.PRIVATE:
                        switch (await SecretService.seamlessAuth(request.query.token as string)) {
                            case true:
                                switch (await UsersService.getIfInstitutionIsAssignedToAUserByToken(request.query.token as string, request.params.institutionId)) {
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
                        switch (await UsersService.getIfRoleIsAssignedToAUserByToken(request.query.token as string, Roles.DIRECTOR)) {
                            case true:
                                switch (await UsersService.getIfInstitutionIsAssignedToAUserByToken(request.query.token as string, request.params.institutionId)) {
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