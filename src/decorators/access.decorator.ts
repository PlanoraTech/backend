import { Reflector } from '@nestjs/core';

export enum AccessTypes {
    PUBLIC,
    RESTRICTED,
    PRIVATE,
    ADMIN,
}

export const Access = Reflector.createDecorator<AccessTypes>();