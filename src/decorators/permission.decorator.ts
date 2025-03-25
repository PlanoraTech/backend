import { Reflector } from '@nestjs/core';
import { Permissions } from '@prisma/client';

export const Permission = Reflector.createDecorator<Permissions[]>();
