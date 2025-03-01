import { Reflector } from '@nestjs/core';

export enum AccessTypes {
    PUBLIC,
    RESTRICTED,
    GRANTED,
    PRIVATE,
    ADMIN,
}

export const Access = Reflector.createDecorator<AccessTypes>();