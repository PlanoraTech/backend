import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AccessType, Rooms } from '@prisma/client';
import { RoomsFromAppointmentsService, RoomsService } from './rooms.service';
import { Access } from '@app/decorators/access.decorator';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    create(
        @Param('institutionId') institutionId: string,
        @Body() createRoomDto: CreateRoomDto,
    ): Promise<void> {
        return this.roomsService.create(institutionId, createRoomDto);
    }

    @Get()
    @Access(AccessType.PUBLIC)
    findAll(@Param('institutionId') institutionId: string): Promise<Rooms[]> {
        return this.roomsService.findAll(institutionId);
    }

    @Get(':id')
    @Access(AccessType.PUBLIC)
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<Rooms> {
        return this.roomsService.findOne(institutionId, id);
    }

    @Patch(':id')
    update(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
        @Body() updateRoomDto: UpdateRoomDto,
    ): Promise<void> {
        return this.roomsService.update(institutionId, id, updateRoomDto);
    }

    @Delete(':id')
    remove(
        @Param('institutionId') institutionId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.roomsService.remove(institutionId, id);
    }
}

@Controller([
    'timetables/:timetableId/appointments/:appointmentId/rooms',
    'presentators/:presentatorId/appointments/:appointmentId/rooms',
    'rooms/:roomId/appointments/:appointmentId/rooms',
])
export class RoomsFromAppointmentsController {
    constructor(private readonly roomsService: RoomsFromAppointmentsService) {}

    @Post(':id')
    add(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.roomsService.add(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
        );
    }

    @Get()
    @Access(AccessType.PUBLIC)
    findAll(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
    ): Promise<Rooms[]> {
        return this.roomsService.findAll(institutionId, {
            timetableId: timetableId,
            presentatorId: presentatorId,
            roomId: roomId,
            appointmentId: appointmentId,
        });
    }

    @Get(':id')
    @Access(AccessType.PUBLIC)
    findOne(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<Rooms> {
        return this.roomsService.findOne(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
        );
    }

    @Delete(':id')
    remove(
        @Param('institutionId') institutionId: string,
        @Param('timetableId') timetableId: string,
        @Param('presentatorId') presentatorId: string,
        @Param('roomId') roomId: string,
        @Param('appointmentId') appointmentId: string,
        @Param('id') id: string,
    ): Promise<void> {
        return this.roomsService.add(
            institutionId,
            {
                timetableId: timetableId,
                presentatorId: presentatorId,
                roomId: roomId,
                appointmentId: appointmentId,
            },
            id,
        );
    }
}
