import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true })
  experienceLevel: string;

  @Prop({ required: true })
  employmentType: string;

  @Prop()
  salary: string;

  @Prop([String])
  requirements: string[];

  @Prop([String])
  responsibilities: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  applicants: User[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  deadline: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
