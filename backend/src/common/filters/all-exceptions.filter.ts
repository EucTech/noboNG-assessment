import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorCodeValue } from '../errors/error-codes';
import { PrismaErrorCode, isPrismaKnownRequestError } from '../errors/prisma-error.guard';

interface ErrorResponseBody {
  statusCode: HttpStatus;
  code: string;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.buildBody(exception, request);

    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${body.statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} -> ${body.statusCode} ${body.code}`);
    }

    response.status(body.statusCode).json(body);
  }

  private buildBody(exception: unknown, request: Request): ErrorResponseBody {
    const base = { path: request.url, timestamp: new Date().toISOString() };

    if (exception instanceof HttpException) {
      const status: HttpStatus = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return { ...base, statusCode: status, code: this.fallbackCode(status), message: payload };
      }

      const record = payload as Record<string, unknown>;
      const message = Array.isArray(record.message)
        ? 'Some of the details you entered are not valid.'
        : ((record.message as string) ?? exception.message);

      return {
        ...base,
        statusCode: status,
        code: (record.code as string) ?? this.fallbackCode(status),
        message,
        details: Array.isArray(record.message) ? record.message : record.details,
      };
    }

    if (isPrismaKnownRequestError(exception)) {
      if (exception.code === PrismaErrorCode.UNIQUE_CONSTRAINT) {
        return {
          ...base,
          statusCode: HttpStatus.CONFLICT,
          code: ErrorCode.VALIDATION_FAILED,
          message: 'A record with these details already exists.',
        };
      }

      if (exception.code === PrismaErrorCode.RECORD_NOT_FOUND) {
        return {
          ...base,
          statusCode: HttpStatus.NOT_FOUND,
          code: ErrorCode.INTERNAL_ERROR,
          message: 'The requested record could not be found.',
        };
      }
    }

    return {
      ...base,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Something went wrong on our side. Please try again.',
    };
  }

  private fallbackCode(status: HttpStatus): ErrorCodeValue {
    if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.UNPROCESSABLE_ENTITY) {
      return ErrorCode.VALIDATION_FAILED;
    }
    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      return ErrorCode.RATE_LIMITED;
    }
    return ErrorCode.INTERNAL_ERROR;
  }
}
