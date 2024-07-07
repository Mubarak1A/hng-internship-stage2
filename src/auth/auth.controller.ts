import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { OrganisationsService } from '../organisations/organisations.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private organisationsService: OrganisationsService,
  ) {}

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    if (!req.body) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    return this.authService.login(req.body);
  }

  @Post('register')
  async register(@Body() user: User) {
    const createdUser = await this.usersService.create(user);
    await this.organisationsService.createDefaultOrganisation(createdUser);
    const loginResponse = await this.authService.login(createdUser);
    return {
      status: 'success',
      message: 'Registration successful',
      data: loginResponse,
    };
  }
}
