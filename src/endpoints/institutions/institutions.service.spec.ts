import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { InstitutionsService } from './institutions.service';
import { Institutions } from '@prisma/client';

describe('InstitutionsService', () => {
	let service: InstitutionsService;
	let prisma: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InstitutionsService, PrismaService],
		}).compile();

		service = module.get<InstitutionsService>(InstitutionsService);
		prisma = module.get<PrismaService>(PrismaService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return all institutions', async () => {
		let institutions: Institutions[] = await prisma.institutions.createManyAndReturn({
			data: [
				{
					id: undefined,
					name: 'Test Institution 1',
					type: 'SCHOOL',
					access: 'PUBLIC',
					color: '#FFFFFFF',
					website: 'https://test.institution1.com'
				},
				{
					id: undefined,
					name: 'Test Institution 2',
					type: 'SCHOOL',
					access: 'PRIVATE',
					color: '#000000',
					website: 'https://test.institution1.com'
				},
			],
		});

		expect(await service.findAll()).toBe(institutions);
	});

	it('should return an institutions', async () => {
		let institutions: Institutions[] = await prisma.institutions.createManyAndReturn({
			data: [
				{
					id: undefined,
					name: 'Test Institution 1',
					type: 'SCHOOL',
					access: 'PUBLIC',
					color: '#FFFFFFF',
					website: 'https://test.institution1.com'
				},
				{
					id: undefined,
					name: 'Test Institution 2',
					type: 'SCHOOL',
					access: 'PRIVATE',
					color: '#000000',
					website: 'https://test.institution1.com'
				},
			],
		});

		expect(await service.findOne(institutions[0].id)).toBe(institutions[0].id);
	});
});