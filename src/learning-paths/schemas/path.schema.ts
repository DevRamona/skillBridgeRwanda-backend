import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/schemas/user.schema';

@Entity()
export class LearningPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  skillLevel: string;

  @Column()
  estimatedDuration: string;

  @Column()
  careerTrack: string;

  @Column('simple-array')
  requiredSkills: string[];

  @Column('simple-array')
  outcomes: string[];

  @Column()
  industry: string;

  @ManyToMany(() => Course)
  @JoinTable()
  courses: Course[];

  @ManyToMany(() => User)
  @JoinTable()
  enrolledUsers: User[];

  @Column({ default: 0 })
  popularity: number;

  @Column({ type: 'decimal', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
