import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../users/user.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  orgId: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.organisations)
  @JoinTable()
  users: User[];
}
