import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		console.log(exception);
		
		if (exception instanceof PrismaClientKnownRequestError)
		{
			switch (exception.code)
			{
				case 'P2025':
					exception = new NotFoundException;
					break;
				case 'P2002':
					exception = new ConflictException("Already exists");
					break;
				default:
					exception = new BadRequestException;
					break;
			}
		}

		if (typeof exception.getStatus !== 'function' || exception.response.message == undefined)
		{
			exception = new InternalServerErrorException;
		}

		response.status(exception.getStatus()).json({
			statusCode: exception.getStatus(),
			message: exception.response.message,
		});
	}
}