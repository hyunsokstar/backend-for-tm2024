import { Module } from '@nestjs/common';
import { DevBattleService } from './dev-battle.service';
import { DevBattleController } from './dev-battle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevBattle } from './entities/dev-battle.entity';
import { TagForDevBattle } from './entities/tag.entity';
import { TeamForDevBattle } from './entities/team-for-dev-battle.entity';
import { DevProgressForTeam } from './entities/dev-progress-for-team.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevBattle,
      TagForDevBattle,
      TeamForDevBattle,
      DevProgressForTeam
    ])
  ],
  controllers: [DevBattleController],
  providers: [DevBattleService],
})
export class DevBattleModule { }
