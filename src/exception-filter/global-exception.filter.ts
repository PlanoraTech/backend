import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();
		let responseObject = exception;

		if (exception instanceof PrismaClientKnownRequestError)
		{
			switch (exception.code)
			{
				case 'P2025':
					responseObject = new NotFoundException;
					break;
				default:
					responseObject = new BadRequestException;
					break;
			}
		}

		console.log(exception);

		if (typeof responseObject.getStatus !== 'function' || typeof responseObject.message !== 'string')
		{
			responseObject = new InternalServerErrorException;
		}

		response.status(responseObject.getStatus()).json({
			statusCode: responseObject.getStatus(),
			message: responseObject.message
		});
	}
}