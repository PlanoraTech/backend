import { Reflector } from '@nestjs/core';
import { Roles } from '@prisma/client';

export const Permissions = Reflector.createDecorator<Roles[]>();