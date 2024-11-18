import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LearningPath } from '../../learning-paths/schemas/path.schema';
import { Role } from '../../roles/role.enum';

export interface UserProfile {
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  position?: string;
  industry?: string;
  experienceLevel?: string;
  education?: string[];
  experience?: {
    title: string;
    company: string;
    duration: string;
    description?: string;
  }[];
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  [x: string]: any;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: Object, default: {} })
  profile: UserProfile;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'LearningPath' }],
  })
  enrolledCourses: LearningPath[];

  @Prop()
  industry: string;

  @Prop()
  experienceLevel: string;

  // Virtual getter for id
  get id(): string {
    return this._id.toString();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtuals
UserSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure virtuals are included in the JSON/Object output
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
