import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaClient } from '@prisma/client';
import { InstitutionsService } from 'src/endpoints/institutions/institutions.service';

@Module({
	controllers: [RoomsController],
	providers: [RoomsService, InstitutionsService, PrismaClient],
})
export class RoomsModule { }