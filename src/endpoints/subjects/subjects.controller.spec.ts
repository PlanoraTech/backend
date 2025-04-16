import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

describe('SubjectsController', () => {
    let controller: SubjectsController;
    let service: SubjectsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubjectsController],
            providers: [SubjectsService, PrismaService],
        }).compile();

        controller = module.get<SubjectsController>(SubjectsController);
        service = module.get<SubjectsService>(SubjectsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a subject', async () => {
        jest.spyOn(service, 'create').mockResolvedValue();
        await expect(
            controller.create('institutionId', {
                name: 'Subject Name',
            } as CreateSubjectDto),
        ).resolves.not.toThrow();
    });

    it('should retrieve all subjects', async () => {
        const subjects = [
            {
                id: 'subjectId',
                name: 'Subject Name',
                institutionId: 'institutionId',
                subjectId: 'subjectId',
            },
        ] as any[];
        jest.spyOn(service, 'findAll').mockResolvedValue(subjects);
        const result = await controller.findAll('institutionId');
        expect(result).toEqual(subjects);
    });

    it('should retrieve a specific subject', async () => {
        const subject = {
            id: 'subjectId',
            name: 'Subject Name',
            institutionId: 'institutionId',
            subjectId: 'subjectId',
        } as any;
        jest.spyOn(service, 'findOne').mockResolvedValue(subject);
        const result = await controller.findOne('institutionId', 'subjectId');
        expect(result).toEqual(subject);
    });

    it('should update a subject', async () => {
        jest.spyOn(service, 'update').mockResolvedValue();
        await expect(
            controller.update('institutionId', 'subjectId', {
                name: 'Updated Subject Name',
            } as UpdateSubjectDto),
        ).resolves.not.toThrow();
    });

    it('should remove a subject', async () => {
        jest.spyOn(service, 'remove').mockResolvedValue();
        await expect(
            controller.remove('institutionId', 'subjectId'),
        ).resolves.not.toThrow();
    });
});
