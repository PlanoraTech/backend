import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaClient } from '@prisma/client';

describe('EventsController', () => {
	let controller: EventsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [EventsController],
			providers: [EventsService, PrismaClient],
		}).compile();

		controller = module.get<EventsController>(EventsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});