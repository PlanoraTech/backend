import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';
import { AccessType, Permissions, Roles, RolesToPermissions, SpecialPermissions } from "@prisma/client";
import { Permission } from "@app/decorators/permission.decorator";
import { SpecialPermission } from "@app/decorators/specialPermission.decorator";
import { User } from "@app/interfaces/User.interface";
import { SecretService } from "@app/auth/secret/secret.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly secretService: SecretService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: (Request & { headers: { authorization: string }, user: User }) = context.switchToHttp().getRequest<(Request & { headers: { authorization: string }, user: User })>();
        if (!request.params.institutionId) {
            return true;
        }
        const permissions: Permissions[] = this.reflector.get<Permissions[]>(Permission, context.getHandler()) ?? [Permissions.READ, Permissions.WRITE];
        const specialPermissions: SpecialPermissions[] = this.reflector.get<SpecialPermissions[]>(SpecialPermission, context.getHandler()) ?? [];

        if (request.user) {
            const institutionConnectionToUser: {
                institutionId: string;
                role: Roles;
                presentatorId: string | null;
            } | undefined = request.user.institutions.find((institution) => institution.institutionId === request.params.institutionId);
            
            if (!institutionConnectionToUser) {
                throw new ForbiddenException("You do not have access to this institution");
            }

            const rolesToPermissions: RolesToPermissions[] = await this.secretService.getPermissionsForRoles();
            const userPermissions: Permissions[] = rolesToPermissions.find((roleToPermissions) => roleToPermissions.role === institutionConnectionToUser.role)?.permissions ?? [];
            const userSpecialPermissions: SpecialPermissions[] = rolesToPermissions.find((roleToPermissions) => roleToPermissions.role === institutionConnectionToUser.role)?.specialPermissions ?? [];
            
            if (!permissions.every((permission) => userPermissions.includes(permission))) {
                throw new ForbiddenException("You do not have the required permissions");
            }
            
            if (userSpecialPermissions.includes(SpecialPermissions.SUBSTITUTE)) {
                if (institutionConnectionToUser.role == Roles.DIRECTOR || (institutionConnectionToUser.role == Roles.PRESENTATOR && institutionConnectionToUser.presentatorId == request.params.substitutePresentatorId)) {
                    return true;
                }
                throw new ForbiddenException("You do not have the required permissions");
            }
            
            if (!(specialPermissions.every((specialPermission) => userSpecialPermissions.includes(specialPermission)))) {
                throw new ForbiddenException("You do not have the required permissions");
            }

            return true;
        }

        switch (request.method) {
            case "GET":
                switch (await this.secretService.getInstitutionAccessById(request.params.institutionId as string)) {
                    case AccessType.PUBLIC:
                        return true;
                    case AccessType.PRIVATE:
                        const user: User = await this.secretService.seamlessAuth(this.secretService.extractTokenFromHeader(request.headers.authorization));
                        return (user.institutions.find((institution) => institution.institutionId === request.params.institutionId) != undefined) ? true : false;
                }
            default:
                throw new ForbiddenException("You do not have access to this resource");
        }
    }
}