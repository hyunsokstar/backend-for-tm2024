import { Module } from '@nestjs/common';
import { DevRelayService } from './dev-relay.service';
import { DevRelayController } from './dev-relay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevRelay } from './entities/dev-relay.entity';
import { DevAssignment } from './entities/dev-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevRelay,
      DevAssignment
    ])
  ],
  controllers: [DevRelayController],
  providers: [DevRelayService],
})


export class DevRelayModule { }
// DevRelay 모듈 typeorm 으로 등록