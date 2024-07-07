import { User } from "src/users/user.entity";
import { OrganisationsService } from "./organisations.service";

describe('OrganisationsService', () => {

  // createDefaultOrganisation should handle users with no firstName
  it('should handle users with no firstName when createDefaultOrganisation is called', async () => {
    const mockUser = { firstName: '', userId: '1' } as User;
    const mockOrganisationRepository = {
      save: jest.fn().mockResolvedValue({
        orgId: '1',
        name: "'s Organisation",
        users: [mockUser],
      }),
    };
    const service = new OrganisationsService(
      mockOrganisationRepository as any,
      {} as any,
    );
    const result = await service.createDefaultOrganisation(mockUser);
    expect(result.name).toBe("'s Organisation");
    expect(result.users).toContain(mockUser);
    expect(mockOrganisationRepository.save).toHaveBeenCalledWith({
      name: "'s Organisation",
      users: [mockUser],
    });
  });
});
