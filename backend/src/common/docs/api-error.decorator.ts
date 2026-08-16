import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseEntity } from './error-response.entity';

export const ApiBadRequest = (description: string) =>
  applyDecorators(ApiResponse({ status: 400, description, type: ErrorResponseEntity }));

export const ApiNotFound = (description: string) =>
  applyDecorators(ApiResponse({ status: 404, description, type: ErrorResponseEntity }));

export const ApiConflict = (description: string) =>
  applyDecorators(ApiResponse({ status: 409, description, type: ErrorResponseEntity }));

export const ApiPaymentRequired = (description: string) =>
  applyDecorators(ApiResponse({ status: 402, description, type: ErrorResponseEntity }));
