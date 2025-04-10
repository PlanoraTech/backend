import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsService', () => {
    let service: EventsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EventsService, PrismaService],
        }).compile();

        service = module.get<EventsService>(EventsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create an event', async () => {
        jest.spyOn(prismaService.events, 'create').mockResolvedValue({
            id: 'eventId',
            institutionId: 'institutionId',
            title: 'Event Title',
            date: new Date('2023-01-01'),
        });
        await expect(
            service.create('institutionId', {
                title: 'Event Title',
                date: new Date('2023-01-01'),
            } as CreateEventDto),
        ).resolves.not.toThrow();
    });

    it('should retrieve all events', async () => {
        const events = [
            {
                id: 'eventId',
                title: 'Event Title',
                date: new Date('2023-01-01'),
                institutionId: 'institutionId',
            },
        ];
        jest.spyOn(prismaService.events, 'findMany').mockResolvedValue(events);
        const result = await service.findAll('institutionId');
        expect(result).toEqual(events);
    });

    it('should retrieve a specific event', async () => {
        const event = {
            id: 'eventId',
            title: 'Event Title',
            date: new Date('2023-01-01'),
            institutionId: 'institutionId',
        };
        jest.spyOn(prismaService.events, 'findUniqueOrThrow').mockResolvedValue(
            event,
        );
        const result = await service.findOne('institutionId', 'eventId');
        expect(result).toEqual(event);
    });

    it('should update an event', async () => {
        jest.spyOn(prismaService.events, 'update').mockResolvedValue({
            id: 'eventId',
            title: 'Event Title',
            date: new Date('2023-01-01'),
            institutionId: 'institutionId',
        });
        await expect(
            service.update('institutionId', 'eventId', {
                title: 'Updated Title',
                date: new Date('2023-01-02'),
            } as UpdateEventDto),
        ).resolves.not.toThrow();
    });

    it('should remove an event', async () => {
        jest.spyOn(prismaService.events, 'delete').mockResolvedValue({
            id: 'eventId',
            title: 'Event Title',
            date: new Date('2023-01-01'),
            institutionId: 'institutionId',
        });
        await expect(
            service.remove('institutionId', 'eventId'),
        ).resolves.not.toThrow();
    });
});
