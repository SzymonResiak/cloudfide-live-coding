import {
    ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException, HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'

// Adding exception filter to catch all unhandled errors.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const timestamp = new Date().toISOString()

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Internal server error'

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            message = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message || errorResponse;

            this.logger.warn(
                `[${request.method} ${request.url} Handled HttpException ${status}: ${JSON.stringify(message)}]`
            )

        } else if(exception instanceof Error) {
            message = exception.message;

            this.logger.error(
                `[${request.method} ${request.url} Unhandled error: ${exception.message}]`,
                exception.stack
            )
        } else {
            this.logger.error(
                `[${request.method} ${request.url} Unknown exception type caught.]`,
                exception
            )
        }

        // for error code 500:
        if (status === HttpStatus.INTERNAL_SERVER_ERROR && !(exception instanceof HttpException)) {
            this.logger.error(
                `Internal server error details: `, exception
            )
        }

        response.status(status).json({
            statusCode: status,
            timestamp: timestamp,
            path: request.url,
            message: message
        })
    }
}