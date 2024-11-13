import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { LearningPath } from '../../learning-paths/entities/learning-path.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @ManyToOne(() => LearningPath, learningPath => learningPath.courses)
  learningPath: LearningPath;
}