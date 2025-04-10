import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, PrismaService],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a user', async () => {
        jest.spyOn(service, 'add').mockResolvedValue();
        await expect(
            controller.create('institutionId', {
                email: 'test@example.com',
            } as UserDto),
        ).resolves.not.toThrow();
    });

    it('should retrieve all users', async () => {
        const users = [{ id: 'userId', email: 'test@example.com' }];
        jest.spyOn(service, 'findAll').mockResolvedValue(users);
        const result = await controller.findAll('institutionId');
        expect(result).toEqual(users);
    });

    it('should remove a user', async () => {
        jest.spyOn(service, 'remove').mockResolvedValue();
        await expect(
            controller.remove('institutionId', 'userId'),
        ).resolves.not.toThrow();
    });
});
