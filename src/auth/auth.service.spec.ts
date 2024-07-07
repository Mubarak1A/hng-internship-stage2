import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

const mockUserService = {
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should validate user', async () => {
    const user = {
      userId: 'testId',
      email: 'test@example.com',
      password: await bcrypt.hash('testPassword', 10),
    };
    mockUserService.findOneByEmail.mockReturnValue(Promise.resolve(user));

    const result = await authService.validateUser('test@example.com', 'testPassword');
    expect(result).toEqual({ userId: 'testId', email: 'test@example.com' });
  });

  it('should return null if user validation fails', async () => {
    mockUserService.findOneByEmail.mockReturnValue(Promise.resolve(null));
    const result = await authService.validateUser('test@example.com', 'wrongPassword');
    expect(result).toBeNull();
  });

  it('should return JWT token on login', async () => {
    const user = { userId: 'testId', email: 'test@example.com' };
    mockJwtService.sign.mockReturnValue('testToken');
    const result = await authService.login(user);
    expect(result).toEqual({ accessToken: 'testToken', user });
  });
});
