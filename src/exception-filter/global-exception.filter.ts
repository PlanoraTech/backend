import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: Logger) { }
	catch(exception: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		this.logger.error(exception, 'GlobalExceptionFilter');

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

		response.status(exception.getStatus()).json({
			statusCode: exception.getStatus(),
			message: exception.response.message || exception.response,
		});
	}
}