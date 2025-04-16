import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsController', () => {
    let controller: EventsController;
    let service: EventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [EventsService, PrismaService],
        }).compile();

        controller = module.get<EventsController>(EventsController);
        service = module.get<EventsService>(EventsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create an event', async () => {
        jest.spyOn(service, 'create').mockResolvedValue();
        await expect(
            controller.create('institutionId', {
                title: 'Event Title',
                date: new Date('2023-01-01'),
            } as CreateEventDto),
        ).resolves.not.toThrow();
    });

    it('should retrieve all events', async () => {
        const events = [
            {
                institutionId: 'institutionId',
                id: 'eventId',
                title: 'Event Title',
                date: new Date('2023-01-01'),
            },
        ] as any;
        jest.spyOn(service, 'findAll').mockResolvedValue(events);
        const result = await controller.findAll('institutionId');
        expect(result).toEqual(events);
    });

    it('should retrieve a specific event', async () => {
        const event = {
            institutionId: 'institutionId',
            id: 'eventId',
            title: 'Event Title',
            date: new Date('2023-01-01'),
        } as any;
        jest.spyOn(service, 'findOne').mockResolvedValue(event);
        const result = await controller.findOne('institutionId', 'eventId');
        expect(result).toEqual(event);
    });

    it('should update an event', async () => {
        jest.spyOn(service, 'update').mockResolvedValue();
        await expect(
            controller.update('institutionId', 'eventId', {
                title: 'Updated Title',
                date: new Date('2023-01-02'),
            } as UpdateEventDto),
        ).resolves.not.toThrow();
    });

    it('should remove an event', async () => {
        jest.spyOn(service, 'remove').mockResolvedValue();
        await expect(
            controller.remove('institutionId', 'eventId'),
        ).resolves.not.toThrow();
    });
});
