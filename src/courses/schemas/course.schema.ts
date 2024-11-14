import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LearningPath } from '../../mocks/learning-path.mock';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LearningPath' })
  learningPath: LearningPath;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  level: string;

  @Prop([String])
  topics: string[];

  @Prop({ required: true })
  instructor: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
