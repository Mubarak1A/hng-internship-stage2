import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Organisation } from './organisation.entity';
import { User } from 'src/users/user.entity';

@Controller('api/organisations')
export class OrganisationsController {
  constructor(private organisationsService: OrganisationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrganisations(@Request() req) {
    const organisations = await this.organisationsService.findByUser(req.user);
    return {
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orgId')
  async getOrganisation(@Param('orgId') orgId: string) {
    const organisation = await this.organisationsService.findOneById(orgId);
    return {
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: organisation,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrganisation(@Body() organisation: Organisation, @Request() req) {
    const createdOrganisation = await this.organisationsService.create(organisation, req.user);
    return {
      status: 'success',
      message: 'Organisation created successfully',
      data: createdOrganisation,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orgId/users')
  async addUserToOrganisation(@Param('orgId') orgId: string, @Body() body: { userId: string }) {
    const organisation = await this.organisationsService.addUserToOrganisation(orgId, body.userId);
    return {
      status: 'success',
      message: 'User added to organisation successfully',
    };
  }
}
