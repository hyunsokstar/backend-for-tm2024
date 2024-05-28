import { Module } from '@nestjs/common';
import { DevBattleService } from './dev-battle.service';
import { DevBattleController } from './dev-battle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevBattle } from './entities/dev-battle.entity';
import { TagForDevBattle } from './entities/tag.entity';
import { TeamForDevBattle } from './entities/team-for-dev-battle.entity';
import { DevProgressForTeam } from './entities/dev-progress-for-team.entity';
import { MemberForDevTeam } from './entities/member-for-dev-team.entity';
import { UsersModel } from 'src/users/entities/users.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevBattle,
      TagForDevBattle,
      TeamForDevBattle,
      DevProgressForTeam,
      MemberForDevTeam,
      UsersModel
    ])
  ],
  controllers: [DevBattleController],
  providers: [DevBattleService],
})
export class DevBattleModule { }
