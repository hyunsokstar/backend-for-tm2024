import { Catch, ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status = exception instanceof HttpException ? exception.getStatus() : 500;

        console.log("exception : ", exception);

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            detailedMessage: '더 자세한 에러 내용을 여기에 추가하세요.',
        });
    }
}
