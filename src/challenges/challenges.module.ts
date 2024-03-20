import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { ChallengesModel } from './entities/challenge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChallengesModel,
      UsersModel
    ])
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule { }
