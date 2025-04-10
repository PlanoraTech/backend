import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

describe('SubjectsService', () => {
    let service: SubjectsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubjectsService, PrismaService],
        }).compile();

        service = module.get<SubjectsService>(SubjectsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a subject', async () => {
        const subject: CreateSubjectDto = {
            name: 'Math',
            subjectId: 'MATH101',
        };
        jest.spyOn(prismaService.subjects, 'create').mockResolvedValue(
            {} as any,
        );

        await expect(
            service.create('institutionId', subject),
        ).resolves.not.toThrow();

        expect(prismaService.subjects.create).toHaveBeenCalledWith({
            select: { id: true },
            data: { ...subject, institutionId: 'institutionId' },
        });
    });

    it('should retrieve all subjects', async () => {
        const subjects = [
            {
                id: '1',
                name: 'Math',
                subjectId: 'MATH101',
                institutionId: 'institutionId',
            },
        ];
        jest.spyOn(prismaService.subjects, 'findMany').mockResolvedValue(
            subjects,
        );

        const result = await service.findAll('institutionId');
        expect(result).toEqual(subjects);
    });

    it('should retrieve a specific subject', async () => {
        const subject = {
            id: '1',
            name: 'Math',
            subjectId: 'MATH101',
            institutionId: 'institutionId',
        };
        jest.spyOn(
            prismaService.subjects,
            'findUniqueOrThrow',
        ).mockResolvedValue(subject);

        const result = await service.findOne('institutionId', '1');
        expect(result).toEqual(subject);
    });

    it('should throw NotFoundException if subject is not found', async () => {
        jest.spyOn(
            prismaService.subjects,
            'findUniqueOrThrow',
        ).mockRejectedValue(new NotFoundException('Subject not found'));

        await expect(
            service.findOne('institutionId', 'invalidId'),
        ).rejects.toThrow(NotFoundException);
    });

    it('should update a subject', async () => {
        const subject: UpdateSubjectDto = { name: 'Updated Math' };
        jest.spyOn(prismaService.subjects, 'update').mockResolvedValue(
            {} as any,
        );

        await expect(
            service.update('institutionId', '1', subject),
        ).resolves.not.toThrow();

        expect(prismaService.subjects.update).toHaveBeenCalledWith({
            select: { id: true },
            data: subject,
            where: { id: '1', institutionId: 'institutionId' },
        });
    });

    it('should remove a subject', async () => {
        jest.spyOn(prismaService.subjects, 'delete').mockResolvedValue(
            {} as any,
        );

        await expect(
            service.remove('institutionId', '1'),
        ).resolves.not.toThrow();

        expect(prismaService.subjects.delete).toHaveBeenCalledWith({
            select: { id: true },
            where: { id: '1', institutionId: 'institutionId' },
        });
    });
});
