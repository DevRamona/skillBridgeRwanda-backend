import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LearningPath } from '../../learning-paths/schemas/path.schema';
import { Role } from 'src/roles/role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  id?: string; // Virtual property for _id

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

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

// Virtuals for `id`
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included in `toObject` and `toJSON` output
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
