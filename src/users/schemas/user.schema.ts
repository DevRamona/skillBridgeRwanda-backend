import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LearningPath } from '../../learning-paths/schemas/path.schema';

export type UserDocument = Document & User;

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
    type: {
      education: String,
      experience: String,
      certifications: [String],
    },
  })
  profile: {
    education: string;
    experience: string;
    certifications: string[];
  };

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'LearningPath' }],
  })
  learningPaths: LearningPath[];

  @Prop()
  industry: string;

  @Prop()
  experienceLevel: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
