import { UsersController } from "./users.controller";

describe('UsersController', () => {

    // retrieve user successfully with valid ID
    it('should retrieve user successfully when valid ID is provided', async () => {
      const mockUsersService = {
        findOneById: jest.fn().mockResolvedValue({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        }),
      };
      const usersController = new UsersController(mockUsersService as any);
      const result = await usersController.getUser('1');
      expect(mockUsersService.findOneById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        status: 'success',
        message: 'User retrieved successfully',
        data: {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
      });
    });

    // user not found for given ID
    it('should return not found when user does not exist for given ID', async () => {
      const mockUsersService = {
        findOneById: jest.fn().mockResolvedValue(null),
      };
      const usersController = new UsersController(mockUsersService as any);
      try {
        await usersController.getUser('2');
      } catch (error) {
        expect(mockUsersService.findOneById).toHaveBeenCalledWith('2');
        expect(error.status).toBe(404);
        expect(error.message).toBe('User not found');
      }
    });
});
