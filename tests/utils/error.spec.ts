import { ApolloError } from 'apollo-server-express';

import { ConflictError, EntityNotFoundError, ErrorCodes, handleError } from '../../src/utils/error';

jest.mock('../../src/utils/logger');

describe('error', () => {
  describe('handleError', () => {
    it('Should catch a ConflictError exception and throw an ApolloError exception', async () => {
      const conflictError = new ConflictError('Some conflict message');
      const apolloError = new ApolloError('Some conflict message', ErrorCodes.Conflict);
      const functionCall = () => { handleError('ConflictError', conflictError) };

      expect(functionCall).toThrowError(apolloError);
    });

    it('Should catch an EntityNotFoundError exception and throw an ApolloError exception', async () => {
      const entityNotFoundError = new EntityNotFoundError('Some not found message');
      const apolloError = new ApolloError('Some not found message', ErrorCodes.EntityNotFound);
      const functionCall = () => { handleError('EntityNotFoundError', entityNotFoundError) };
      
      expect(functionCall).toThrowError(apolloError);
    });

    it('Should catch some other exception and throw an ApolloError exception', async () => {
      const error = new Error('Some error message');
      const apolloError = new ApolloError('Internal server error', ErrorCodes.InternalServerError);
      const functionCall = () => { handleError('Error', error) };

      expect(functionCall).toThrow(apolloError);
    });
  });
});
