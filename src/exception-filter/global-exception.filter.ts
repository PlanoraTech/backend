import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const response: Response = host.switchToHttp().getResponse<Response>();

		Logger.error(exception, GlobalExceptionFilter.name);

		if (exception instanceof PrismaClientValidationError) {
			exception = new BadRequestException("Something is missing from your request");
		}

		if (exception instanceof PrismaClientKnownRequestError) {
			switch (exception.code) {
				case 'P2025':
					exception = new NotFoundException;
					break;
				case 'P2002':
					exception = new ConflictException;
					break;
				default:
					exception = new BadRequestException;
					break;
			}
		}

		if (!(exception instanceof ThrottlerException) && (typeof exception.getStatus !== 'function' || exception.response.message == undefined)) {
			exception = new InternalServerErrorException;
		}

		response.status(exception.getStatus()).send({
			statusCode: exception.getStatus(),
			message: exception.response.message || exception.response,
		});
	}
}