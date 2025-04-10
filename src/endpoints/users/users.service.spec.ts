import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, PrismaService],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should add a user to an institution', async () => {
        const userDto: UserDto = { email: 'test@example.com' };
        jest.spyOn(
            prismaService.usersToInstitutions,
            'create',
        ).mockResolvedValue({
            userId: 'userId',
            role: 'PRESENTATOR',
            institutionId: 'institutionId',
            presentatorId: 'presentatorId',
        });

        await expect(
            service.add('institutionId', userDto),
        ).resolves.not.toThrow();
        expect(prismaService.usersToInstitutions.create).toHaveBeenCalledWith({
            select: { institutionId: true },
            data: {
                user: { connect: { email: userDto.email } },
                institution: { connect: { id: 'institutionId' } },
            },
        });
    });

    it('should retrieve all users for an institution', async () => {
        const users = [
            {
                id: 'userId',
                email: 'test@example.com',
                password: 'hashedPassword',
            },
        ];
        jest.spyOn(prismaService.users, 'findMany').mockResolvedValue(users);

        const result = await service.findAll('institutionId');
        expect(result).toEqual(users);
        expect(prismaService.users.findMany).toHaveBeenCalledWith({
            select: { id: true, email: true },
            where: {
                institutions: {
                    some: { institutionId: 'institutionId' },
                },
            },
        });
    });

    it('should remove a user from an institution', async () => {
        jest.spyOn(
            prismaService.usersToInstitutions,
            'delete',
        ).mockResolvedValue({
            userId: 'userId',
            role: 'PRESENTATOR',
            institutionId: 'institutionId',
            presentatorId: 'presentatorId',
        });

        await expect(
            service.remove('institutionId', 'userId'),
        ).resolves.not.toThrow();
        expect(prismaService.usersToInstitutions.delete).toHaveBeenCalledWith({
            select: { institutionId: true },
            where: {
                userId_institutionId: {
                    userId: 'userId',
                    institutionId: 'institutionId',
                },
                institution: { id: 'institutionId' },
            },
        });
    });
});
