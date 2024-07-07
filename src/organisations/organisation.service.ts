import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organisation } from './organisation.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrganisationsService {
  constructor(
    @InjectRepository(Organisation)
    private organisationsRepository: Repository<Organisation>,
  ) {}

  async createDefaultOrganisation(user: User): Promise<Organisation> {
    const organisation = new Organisation();
    organisation.name = `${user.firstName}'s Organisation`;
    organisation.users = [user];
    return this.organisationsRepository.save(organisation);
  }

  async create(organisation: Organisation, user: User): Promise<Organisation> {
    organisation.users = [user];
    return this.organisationsRepository.save(organisation);
  }

  async findByUser(user: User): Promise<Organisation[]> {
    return this.organisationsRepository
      .createQueryBuilder('organisation')
      .innerJoin('organisation.users', 'user', 'user.userId = :userId', { userId: user.userId })
      .getMany();
  }

  async findOneById(orgId: string): Promise<Organisation> {
    return this.organisationsRepository.findOne({ where: { orgId } });
  }

  async addUserToOrganisation(orgId: string, user: User): Promise<Organisation> {
    const organisation = await this.findOneById(orgId);
    if (!organisation) {
      throw new Error('Organisation not found');
    }
    organisation.users.push(user);
    return this.organisationsRepository.save(organisation);
  }
}
