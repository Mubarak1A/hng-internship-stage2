import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from './organisation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationRepository: Repository<Organisation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createDefaultOrganisation(user: User): Promise<Organisation> {
    const organisation = new Organisation();
    organisation.name = `${user.firstName}'s Organisation`;
    organisation.users = [user];
    return this.organisationRepository.save(organisation);
  }

  async create(organisation: Organisation, user: User): Promise<Organisation> {
    organisation.users = [user];
    return this.organisationRepository.save(organisation);
  }

  async findByUser(user: User): Promise<Organisation[]> {
    return this.organisationRepository
      .createQueryBuilder('organisation')
      .innerJoin('organisation.users', 'user', 'user.userId = :userId', { userId: user.userId })
      .getMany();
  }

  async findOneById(orgId: string): Promise<Organisation> {
    return this.organisationRepository.findOne({ where: { orgId }, relations: ['users'] });
  }

  async addUserToOrganisation(orgId: string, userId: string): Promise<Organisation> {
    const organisation = await this.findOneById(orgId);
    if (!organisation) {
      throw new NotFoundException(`Organisation with ID ${orgId} not found`);
    }
    
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!organisation.users) {
      organisation.users = [];
    }

    organisation.users.push(user);
    return this.organisationRepository.save(organisation);
  }
}
