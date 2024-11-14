import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';
import { User } from '../../users/schemas/user.schema';

export type LearningPathDocument = LearningPath & Document;

@Schema({ timestamps: true })
export class LearningPath {
  [x: string]: any;
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  skillLevel: string;

  @Prop({ required: true })
  estimatedDuration: string;

  @Prop({ required: true })
  careerTrack: string;

  @Prop([String])
  requiredSkills: string[];

  @Prop([String])
  outcomes: string[];

  @Prop({ required: true })
  industry: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  courses: Course[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  enrolledUsers: User[];

  @Prop({ default: 0 })
  popularity: number;

  @Prop({ type: Number, default: 0 })
  rating: number;
}

export const LearningPathSchema = SchemaFactory.createForClass(LearningPath);
