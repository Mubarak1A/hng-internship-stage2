import { User } from "src/users/user.entity";
import { OrganisationsService } from "./organisations.service";

describe('OrganisationsService', () => {

    // createDefaultOrganisation should handle users with special characters in their names
    it('should handle users with special characters in their names when createDefaultOrganisation is called', async () => {
      const mockUser = { firstName: 'J@hn#', lastName: 'D$e%', userId: '2', email: 'john.doe@example.com', password: 'password', organisations: [] } as User;
      const mockOrganisationRepository = { save: jest.fn().mockResolvedValue({ ...mockUser, name: "J@hn#'s Organisation" }) };
      const service = new OrganisationsService(mockOrganisationRepository as any);
  
      const result = await service.createDefaultOrganisation(mockUser);
  
      expect(result.name).toBe("J@hn#'s Organisation");
      expect(result.users).toContain(mockUser);
      expect(mockOrganisationRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: "J@hn#'s Organisation", users: [mockUser] }));
    });
});
