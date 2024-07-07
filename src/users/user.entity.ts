import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Organisation } from '../organisations/organisation.entity';

@Entity()
@Unique(['userId', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToMany(() => Organisation, (organisation) => organisation.users)
  organisations: Organisation[];
}
