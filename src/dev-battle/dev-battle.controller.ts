import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseIntPipe, NotFoundException, Res, BadRequestException, HttpStatus, Req } from '@nestjs/common';
import { DevBattleService } from './dev-battle.service';
import { CreateDevBattleDto } from './dto/create-dev-battle.dto';
import { UpdateDevBattleDto } from './dto/update-dev-battle.dto';
import { AddTeamToDevBattleDto } from './dto/add-team-to-dev-battle.dto';
import { DevBattle } from './entities/dev-battle.entity';
import { AddDevProgressForTeamDto } from './dto/add-dev-progress-for-team.dto';
import { DevProgressForTeam, DevStatus } from './entities/dev-progress-for-team.entity';
import { TeamForDevBattle } from './entities/team-for-dev-battle.entity';
import { AddItemToSpecificFieldForTeamDevSpecDto } from './dto/add-Item-to-Specific-field-for-team-dev-spec.dto';
import { UpdateDevProgressForTeamDto } from './dto/update-dev-progress.dto';
import { AddTodoForDevBattleDto } from './dto/add-todo-for-dev-battle.dto';
import { TodoForDevBattleSubject } from './entities/todo-for-dev-battle-subject.entity';
@Controller('dev-battle')
export class DevBattleController {
  constructor(private readonly devBattleService: DevBattleService) { }

  @Post()
  create(@Body() createDevBattleDto: CreateDevBattleDto, @Req() req) {
    const loginUser = req.user
    if (!loginUser) {
      return {
        message: "로그인 하세요"
      }
    }

    return this.devBattleService.createDevBattle(createDevBattleDto, loginUser);
  }

  @Patch(':id')
  async updateDevBattleSubject(@Param('id') id: string, @Body('subject') subject: string) {
    const result = await this.devBattleService.updateDevBattleSubject(+id, subject);
    return { message: `DevBattle with ID ${id} updated successfully`, devBattle: result };
  }

  @Patch('/dev-progress/:devProgressId/update-status')
  @HttpCode(HttpStatus.OK)
  async updateDevProgressStatus(
    @Param('devProgressId', ParseIntPipe) devProgressId: number,
    @Body('status') status: string
  ): Promise<{ message: string; devProgress: DevProgressForTeam }> {
    // Validate status
    if (!Object.values(DevStatus).includes(status as DevStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    try {
      const devProgress = await this.devBattleService.updateDevProgressStatus(devProgressId, status as DevStatus);
      return { message: 'Dev progress status updated successfully', devProgress };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Failed to update dev progress status');
    }
  }

  @Post('/:devBattleId/todo')
  @HttpCode(201)
  async addTodoForDevBattle(
    @Param('devBattleId', ParseIntPipe) devBattleId: number,
    @Body() addTodoForDevBattleDto: AddTodoForDevBattleDto,
  ): Promise<TodoForDevBattleSubject> {
    console.log("dev battle id : ", devBattleId);
    return await this.devBattleService.addTodoForDevBattle(devBattleId, addTodoForDevBattleDto);
  }

  @Get()
  findAll() {
    return this.devBattleService.findAllDevBattle();
  }

  @Patch('/dev-progress/:progressId')
  async updateDevProgressForTeam(
    @Param('progressId', ParseIntPipe) progressId: number,
    @Body() updateDevProgressForTeamDto: UpdateDevProgressForTeamDto,
  ): Promise<DevProgressForTeam> {
    return this.devBattleService.updateDevProgressForTeam(progressId, updateDevProgressForTeamDto);
  }

  @Post('/teams/:teamId/progress')
  @HttpCode(201)
  async addDevProgressForTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() addDevProgressForTeamDto: AddDevProgressForTeamDto,
  ): Promise<DevProgressForTeam> {
    return await this.devBattleService.addDevProgressForTeam(teamId, addDevProgressForTeamDto);
  }

  @Post(':devBattleId/add-team')
  async addTeamToDevBattle(@Param('devBattleId') devBattleId: number, @Body() addTeamToDevBattleDto: AddTeamToDevBattleDto): Promise<DevBattle> {
    console.log("dev battle team add ??");
    return await this.devBattleService.addTeamToDevBattle(devBattleId, addTeamToDevBattleDto);
  }

  @Delete('/teams/:teamId')
  async deleteTeam(@Param('teamId', ParseIntPipe) teamId: number, @Res() res): Promise<void> {
    console.log("team delete check teamId : ", teamId);
    await this.devBattleService.deleteTeamForDevBattle(teamId);
    const responseObject = { message: `Team with ID ${teamId} deleted successfully` };
    res.status(200).json(responseObject);
  }

  @Patch('/team/:teamId/update-dev-spec/:fieldName')
  async updateForSpecificDevSpecForNotArryTypeForTeamBattle(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('fieldName') fieldName: string,
    @Body('itemText') itemText: string,
  ): Promise<{ message: string }> {
    await this.devBattleService.updateForSpecificDevSpecForNotArryTypeForTeamBattle(
      teamId,
      fieldName,
      itemText,
    );
    return { message: 'Successfully updated the field for team\'s dev spec' };
  }

  @Patch('/team/:teamId/update-dev-spec-specific-field')
  async addItemToSpecificFieldForDevSpec(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() devSpecForTeamBattleUpdateDto: AddItemToSpecificFieldForTeamDevSpecDto,
  ): Promise<void> {
    await this.devBattleService.addItemToSpecificFieldForDevSpec(teamId, devSpecForTeamBattleUpdateDto);
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

  @Post('bulk-create')
  async bulkCreateDevBattles(@Body() subjects: string[]) {
    return this.devBattleService.bulkCreateDevBattles(subjects);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devBattleService.findOne(+id);
  }


}
