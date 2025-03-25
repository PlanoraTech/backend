import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { LogoutService } from './logout.service';

describe('LogoutService', () => {
	let service: LogoutService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [LogoutService, PrismaService],
		}).compile();

		service = module.get<LogoutService>(LogoutService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});