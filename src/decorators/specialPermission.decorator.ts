import { Reflector } from '@nestjs/core';
import { SpecialPermissions } from '@prisma/client';

export const SpecialPermission = Reflector.createDecorator<SpecialPermissions[]>();