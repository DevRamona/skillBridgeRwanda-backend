import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/schemas/user.schema';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column('simple-array')
  requiredSkills: string[];

  @Column('simple-array')
  preferredSkills: string[];

  @Column()
  experienceLevel: string;

  @Column()
  employmentType: string;

  @Column({ type: 'decimal' })
  salaryRange: number;

  @Column()
  industry: string;

  @ManyToMany(() => User)
  @JoinTable()
  applicants: User[];
}
