import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type JobDocument = Document & Job;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  location: string;

  @Prop([String])
  requiredSkills: string[];

  @Prop([String])
  preferredSkills: string[];

  @Prop({ required: true })
  experienceLevel: string;

  @Prop({ required: true })
  employmentType: string;

  @Prop({ type: Number, required: true })
  salaryRange: number;

  @Prop({ required: true })
  industry: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  applicants: User[];
}

export const JobSchema = SchemaFactory.createForClass(Job);
