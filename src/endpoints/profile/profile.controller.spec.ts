import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { SecretService } from '@app/auth/secret/secret.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfileController', () => {
    let controller: ProfileController;
    let service: ProfileService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [ProfileService, SecretService, PrismaService],
        }).compile();

        controller = module.get<ProfileController>(ProfileController);
        service = module.get<ProfileService>(ProfileService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should retrieve user profile', async () => {
        const request = { user: { id: 'userId' } } as any;
        const profile = {
            email: 'test@example.com',
            institutions: [
                {
                    institution: { name: 'Institution 1' },
                    role: 'admin',
                },
            ],
        } as any;

        jest.spyOn(service, 'get').mockResolvedValue(profile);

        const result = await controller.get(request);
        expect(result).toEqual(profile);
    });

    it('should update user password', async () => {
        const request = { user: { id: 'userId' } } as any;
        const profile: UpdateProfileDto = {
            newPassword: 'newPassword123',
            oldPassword: 'oldPassword123',
        };

        jest.spyOn(service, 'updatePassword').mockResolvedValue();

        await expect(
            controller.update(request, profile),
        ).resolves.not.toThrow();

        expect(service.updatePassword).toHaveBeenCalledWith('userId', profile);
    });

    it('should remove user profile', async () => {
        const request = { user: { id: 'userId' } } as any;

        jest.spyOn(service, 'remove').mockResolvedValue();

        await expect(controller.remove(request)).resolves.not.toThrow();

        expect(service.remove).toHaveBeenCalledWith('userId');
    });

    it('should throw NotFoundException if user profile is not found', async () => {
        const request = { user: { id: 'invalidUserId' } } as any;

        jest.spyOn(service, 'get').mockRejectedValue(
            new NotFoundException('User not found'),
        );

        await expect(controller.get(request)).rejects.toThrow(
            NotFoundException,
        );
    });
});
