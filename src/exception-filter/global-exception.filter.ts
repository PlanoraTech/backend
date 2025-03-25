import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const response: Response = host.switchToHttp().getResponse<Response>();

		Logger.error(exception, GlobalExceptionFilter.name);

		if (exception instanceof PrismaClientInitializationError || exception instanceof PrismaClientUnknownRequestError || exception instanceof PrismaClientRustPanicError) {
			exception = new InternalServerErrorException;
		}

		if (exception instanceof PrismaClientValidationError) {
			exception = new BadRequestException("Something is missing from your request");
		}

		if (exception instanceof PrismaClientKnownRequestError) {
			switch (exception.code) {
				case 'P2001':
					exception = new NotFoundException;
					break;
				case 'P2002':
					exception = new ConflictException;
					break;
				case 'P2015':
					exception = new NotFoundException;
					break;
				case 'P2025':
					exception = new NotFoundException;
					break;
				default:
					exception = new InternalServerErrorException;
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