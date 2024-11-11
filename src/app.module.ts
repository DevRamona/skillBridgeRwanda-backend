import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LearningPathsModule } from './learning-paths/learning-paths.module';
import { JobsModule } from './jobs/jobs.module';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { AuthnestService } from './g/authnest/authnest.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule, CoursesModule, JobsModule, LearningPathsModule],
  controllers: [AppController],
  providers: [AppService, AuthnestService],
})
export class AppModule {}
