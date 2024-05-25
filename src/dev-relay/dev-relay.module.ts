import { Module } from '@nestjs/common';
import { DevRelayService } from './dev-relay.service';
import { DevRelayController } from './dev-relay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevRelay } from './entities/dev-relay.entity';
import { DevAssignment } from './entities/dev-assignment.entity';
import { DevAssignmentSubmission } from './entities/dev-assignment-submission.entity';
import { CategoryForDevAssignment } from './entities/category-for-dev-assignment.entity';
import { SubjectForCategory } from './entities/subject-for-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevRelay,
      DevAssignment,
      DevAssignmentSubmission,
      CategoryForDevAssignment,
      SubjectForCategory
    ])
  ],
  controllers: [DevRelayController],
  providers: [DevRelayService],
})


export class DevRelayModule { }
// DevRelay 모듈 typeorm 으로 등록