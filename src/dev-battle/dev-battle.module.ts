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
import { DevSpecForTeamBattle } from './entities/dev-spec-for-team-battle.entity';
import { TechNotesModel } from 'src/technotes/entities/technotes.entity';
import { SkilNotesModel } from 'src/technotes/entities/skilnotes.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevBattle,
      TagForDevBattle,
      TeamForDevBattle,
      DevProgressForTeam,
      MemberForDevTeam,
      UsersModel,
      DevSpecForTeamBattle,
      TechNotesModel,
      SkilNotesModel
    ])
  ],
  controllers: [DevBattleController],
  providers: [DevBattleService],
})
export class DevBattleModule { }
