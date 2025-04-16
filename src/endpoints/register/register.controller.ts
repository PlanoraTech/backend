import { Controller, Post, Body } from '@nestjs/common';
import {
    ApiTags,
    ApiForbiddenResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { Access } from '@app/decorators/access.decorator';
import { AccessType } from '@prisma/client';

@ApiTags('Register')
@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    /**
     * Register a new user.
     *
     * @remarks This operation registers a new user and returns a token for authentication.
     */
    @Post()
    @Access(AccessType.PUBLIC)
    @ApiCreatedResponse({
        description: 'Successfully registered and returned the token.',
    })
    @ApiForbiddenResponse({
        description:
            'Forbidden. You do not have permission to access this operation.',
    })
    create(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
        return this.registerService.create(registerDto);
    }
}
