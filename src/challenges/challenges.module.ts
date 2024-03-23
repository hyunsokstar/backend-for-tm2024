import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { ChallengesModel } from './entities/challenge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SubChallengesModel } from './entities/sub_challenge.entity';
import { ParticipantsForSubChallengeModel } from './entities/participants-for-sub-challenge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      ChallengesModel,
      SubChallengesModel,
      ParticipantsForSubChallengeModel
    ])
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule { }
