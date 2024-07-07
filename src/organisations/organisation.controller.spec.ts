import { OrganisationsController } from "./organisations.controller";

describe('OrganisationsController', () => {

    // retrieve all organisations for authenticated user
    it('should retrieve all organisations for authenticated user', async () => {
      const mockOrganisationsService = {
        findByUser: jest.fn().mockResolvedValue([{ orgId: '1', name: 'Test Org' }]),
      };
      const mockRequest = { user: { userId: '123' } };
      const organisationsController = new OrganisationsController(mockOrganisationsService as any);
  
      const result = await organisationsController.getOrganisations(mockRequest);
  
      expect(mockOrganisationsService.findByUser).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: {
          organisations: [{ orgId: '1', name: 'Test Org' }],
        },
      });
    });

    // retrieve organisations when user has none
    it('should return empty array when user has no organisations', async () => {
      const mockOrganisationsService = {
        findByUser: jest.fn().mockResolvedValue([]),
      };
      const mockRequest = { user: { userId: '123' } };
      const organisationsController = new OrganisationsController(mockOrganisationsService as any);
  
      const result = await organisationsController.getOrganisations(mockRequest);
  
      expect(mockOrganisationsService.findByUser).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: {
          organisations: [],
        },
      });
    });
});
