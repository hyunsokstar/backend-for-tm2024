import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe, NotFoundException, Res, BadRequestException } from '@nestjs/common';
import { DevBattleService } from './dev-battle.service';
import { CreateDevBattleDto } from './dto/create-dev-battle.dto';
import { UpdateDevBattleDto } from './dto/update-dev-battle.dto';
import { AddTeamToDevBattleDto } from './dto/add-team-to-dev-battle.dto';
import { DevBattle } from './entities/dev-battle.entity';
import { AddDevProgressForTeamDto } from './dto/add-dev-progress-for-team.dto';
import { DevProgressForTeam } from './entities/dev-progress-for-team.entity';
import { TeamForDevBattle } from './entities/team-for-dev-battle.entity';
import { AddItemToSpecificFieldForTeamDevSpecDto } from './dto/add-Item-to-Specific-field-for-team-dev-spec.dto';

@Controller('dev-battle')
export class DevBattleController {
  constructor(private readonly devBattleService: DevBattleService) { }

  @Patch('/team/:teamId/update-dev-spec-specific-field')
  async addItemToSpecificFieldForDevSpec(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() devSpecForTeamBattleUpdateDto: AddItemToSpecificFieldForTeamDevSpecDto,
  ): Promise<void> {
    await this.devBattleService.addItemToSpecificFieldForDevSpec(teamId, devSpecForTeamBattleUpdateDto);
  }

  @Delete('/teams/:teamId')
  async deleteTeam(@Param('teamId', ParseIntPipe) teamId: number, @Res() res): Promise<void> {
    await this.devBattleService.deleteTeamForDevBattle(teamId);

    // Return an appropriate response object
    const responseObject = { message: `Team with ID ${teamId} deleted successfully` };
    res.status(200).json(responseObject);
  }

  @Post(':devBattleId/add-team')
  async addTeamToDevBattle(@Param('devBattleId') devBattleId: number, @Body() addTeamToDevBattleDto: AddTeamToDevBattleDto): Promise<DevBattle> {
    console.log("dev battle team add ??");
    return await this.devBattleService.addTeamToDevBattle(devBattleId, addTeamToDevBattleDto);
  }

  @Post('/teams/:teamId/progress')
  @HttpCode(201)
  async addDevProgressForTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() addDevProgressForTeamDto: AddDevProgressForTeamDto,
  ): Promise<DevProgressForTeam> {
    return await this.devBattleService.addDevProgressForTeam(teamId, addDevProgressForTeamDto);
  }

  @Delete('/progressForDevBattle/:idForProgressForDevBattle')
  @HttpCode(200)
  async deleteDevProgressForTeam(
    @Param('idForProgressForDevBattle', ParseIntPipe) idForProgressForDevBattle: number,
  ): Promise<{ message: string }> {
    console.log('task 요청!');
    try {
      return await this.devBattleService.deleteDevProgressForTeam(idForProgressForDevBattle);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post('/teams/:teamId/member/:memberId')
  @HttpCode(201)
  async addMemberToTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {

    console.log("멤버 추가 요청 받음 ", teamId, memberId);


    const result = await this.devBattleService.addMemberToTeam(teamId, memberId);

    if (result.statusCode === 200) {
      return result;
    }

    // 새로운 멤버인 경우
    const memberForDevTeam = result.data;
    const member = memberForDevTeam.user;
    const team = memberForDevTeam.team;

    return {
      statusCode: 201,
      message: 'Member has been added to team',
      data: {
        member: {
          id: member.id,
          nickname: member.nickname,
          position: memberForDevTeam.position,
        },
        team: {
          id: team.id,
          name: team.name,
        },
      },
    };
  }

  @Post()
  create(@Body() createDevBattleDto: CreateDevBattleDto) {
    return this.devBattleService.createDevBattle(createDevBattleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.devBattleService.removeDevBattleById(id);
      return { message: `DevBattle deleted successfully for ${id}` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: error.message };
      }
      throw error;
    }
  }

  @Get('/teams')
  async getAllTeams(): Promise<TeamForDevBattle[]> {
    return await this.devBattleService.getAllTeams();
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devBattleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevBattleDto: UpdateDevBattleDto) {
    return this.devBattleService.update(+id, updateDevBattleDto);
  }

}
