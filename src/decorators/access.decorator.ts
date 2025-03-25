import { Reflector } from '@nestjs/core';
import { AccessType } from '@prisma/client';

export const Access = Reflector.createDecorator<AccessType>();
