import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    enum: ['student', 'employer', 'educator', 'admin'],
    default: 'student',
  })
  role: string;

  @Prop([String])
  skills: string[];

  @Prop({
    type: [
      {
        education: String,
        experience: String,
        certifications: [String],
      },
    ],
  })
  profile: Record<string, any>;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'LearningPath' }],
  })
  learningPaths: MongooseSchema.Types.ObjectId[];
    industry: string;
    experienceLevel: string;
    id: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
