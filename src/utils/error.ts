import { ApolloError } from 'apollo-server-express';

import logger from './logger';

export enum ErrorCodes {
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  Conflict = 'CONFLICT',
  EntityNotFound = 'ENTITY_NOT_FOUND'
}

export class ConflictError extends Error {}
export class EntityNotFoundError extends Error {}

export const handleError = (loggerLabel: string, error: any) => {
  logger.error({
    label: loggerLabel,
    message: error.message
  });

  let errorMessage = error.message;
  let errorCode = ErrorCodes.InternalServerError;

  if (error instanceof ConflictError) {
    errorCode = ErrorCodes.Conflict;
  } else if (error instanceof EntityNotFoundError) {
    errorCode = ErrorCodes.EntityNotFound
  } else {
    errorMessage = 'Internal server error';
    errorCode = ErrorCodes.InternalServerError;
  }

  throw new ApolloError(errorMessage, errorCode);
};
