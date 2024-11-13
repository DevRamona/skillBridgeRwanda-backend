import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LearningPath } from '../../learning-paths/schemas/path.schema';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'LearningPath' })
  learningPath: LearningPath;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
