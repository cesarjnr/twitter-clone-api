import faker from 'faker';
import { Request, Response } from 'express';
import { format } from 'date-fns';

import { UserService } from '../../src/services/UserService';
import { UserController } from '../../src/controllers/UserController';

describe('UserController', () => {
  const mockReq = {} as jest.Mocked<Request>;
  const mockRes = {} as jest.Mocked<Response>;
  const mockUserService = {} as jest.Mocked<UserService>;
  const userController = new UserController(mockUserService);

  beforeAll(() => {
    console.error = jest.fn();
    mockRes.status = jest.fn().mockReturnThis();
    mockRes.json = jest.fn().mockReturnThis();
    mockUserService.create = jest.fn();
  });

  afterEach(() => {
    mockReq.body = {};
  });

  describe('create', () => {
    const requestPayload = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(16),
      dateOfBirth: format(faker.date.past(), 'yyyy-MM-dd'),
      username: faker.internet.userName()
    };

    beforeEach(() => {
      mockReq.body = requestPayload;
    });

    it('Should successfully create a user and return the status code 201', async () => {
      await userController.create(mockReq, mockRes);

      expect(mockUserService.create).toHaveBeenCalledWith(requestPayload);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('Should catch an exception and return the status code 500', async () => {
      mockUserService.create.mockRejectedValue(new Error('Some error'));

      await userController.create(mockReq, mockRes);

      expect(mockUserService.create).toHaveBeenCalledWith(requestPayload);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
        message: 'Something went wrong. Please try again in a few minutes!'
      });
    });
  });
});
