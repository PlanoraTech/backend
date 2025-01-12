import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		let responseMessage = exception;

		if (exception instanceof PrismaClientKnownRequestError)
		{
			switch (exception.code)
			{
				case 'P2025':
					responseMessage = new NotFoundException;
					break;
				default:
					responseMessage = new BadRequestException;
					break;
			}
		}

		console.log(exception);

		if (typeof responseMessage.getStatus !== 'function')
		{
			responseMessage = new InternalServerErrorException;
		}

		response.status(responseMessage.getStatus()).json({
			statusCode: responseMessage.getStatus(),
			message: responseMessage.message
		});
	}
}