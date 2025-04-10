import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfileService', () => {
    let service: ProfileService;
    let prismaService: PrismaService;
    let secretService: SecretService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProfileService, SecretService, PrismaService],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
        prismaService = module.get<PrismaService>(PrismaService);
        secretService = module.get<SecretService>(SecretService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should retrieve user profile', async () => {
        const user = {
            email: 'test@example.com',
            institutions: [
                {
                    institution: { name: 'Institution 1' },
                    role: 'admin',
                },
            ],
        } as any;

        jest.spyOn(prismaService.users, 'findUniqueOrThrow').mockResolvedValue(
            user,
        );

        const result = await service.get('userId');
        expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
        jest.spyOn(prismaService.users, 'findUniqueOrThrow').mockRejectedValue(
            new NotFoundException('User not found'),
        );

        await expect(service.get('invalidUserId')).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should update user password', async () => {
        const profile: UpdateProfileDto = {
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123',
        };

        jest.spyOn(secretService, 'encryptPassword').mockResolvedValue(
            'encryptedPassword',
        );
        jest.spyOn(prismaService.users, 'update').mockResolvedValue({} as any);

        await expect(
            service.updatePassword('userId', profile),
        ).resolves.not.toThrow();

        expect(secretService.encryptPassword).toHaveBeenCalledWith(
            'newPassword123',
        );
        expect(prismaService.users.update).toHaveBeenCalledWith({
            select: { id: true },
            data: { password: 'encryptedPassword' },
            where: { id: 'userId' },
        });
    });

    it('should remove user', async () => {
        jest.spyOn(prismaService.users, 'delete').mockResolvedValue({} as any);

        await expect(service.remove('userId')).resolves.not.toThrow();

        expect(prismaService.users.delete).toHaveBeenCalledWith({
            select: { id: true },
            where: { id: 'userId' },
        });
    });
});
