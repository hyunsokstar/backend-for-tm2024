import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevBattleService } from './dev-battle.service';
import { CreateDevBattleDto } from './dto/create-dev-battle.dto';
import { UpdateDevBattleDto } from './dto/update-dev-battle.dto';
import { AddTeamToDevBattleDto } from './dto/add-team-to-dev-battle.dto';
import { DevBattle } from './entities/dev-battle.entity';

@Controller('dev-battle')
export class DevBattleController {
  constructor(private readonly devBattleService: DevBattleService) { }

  @Post(':devBattleId/add-team')
  async addTeamToDevBattle(@Param('devBattleId') devBattleId: number, @Body() addTeamToDevBattleDto: AddTeamToDevBattleDto): Promise<DevBattle> {
    console.log("dev battle team add ??");
    return await this.devBattleService.addTeamToDevBattle(devBattleId, addTeamToDevBattleDto);
  }

  @Patch(':id/tag')
  async addTagToDevBattle(@Param('id') devBattleId: number, @Body('textForTag') textForTag: string) {
    return await this.devBattleService.addTagToDevBattle(devBattleId, textForTag);
  }

  @Get()
  findAll() {
    return this.devBattleService.findAllDevBattle();
  }

  @Post('bulk-create')
  async bulkCreateDevBattles(@Body() subjects: string[]) {
    return this.devBattleService.bulkCreateDevBattles(subjects);
  }

  @Post()
  create(@Body() createDevBattleDto: CreateDevBattleDto) {
    return this.devBattleService.createDevBattle(createDevBattleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devBattleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevBattleDto: UpdateDevBattleDto) {
    return this.devBattleService.update(+id, updateDevBattleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devBattleService.remove(+id);
  }
}
