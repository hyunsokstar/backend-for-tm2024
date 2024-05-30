import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDevBattleDto } from './dto/update-dev-battle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DevBattle } from './entities/dev-battle.entity';
import { Repository } from 'typeorm';
import { CreateDevBattleDto } from './dto/create-dev-battle.dto';
import { TagForDevBattle } from './entities/tag.entity';
import { TeamForDevBattle } from './entities/team-for-dev-battle.entity';
import { AddTeamToDevBattleDto } from './dto/add-team-to-dev-battle.dto';
import { DevProgressForTeam } from './entities/dev-progress-for-team.entity';
import { AddDevProgressForTeamDto } from './dto/add-dev-progress-for-team.dto';
import { MemberForDevTeam } from './entities/member-for-dev-team.entity';
import { AddMemberForDevTeamDto } from './dto/add-member-for-dev-team.dto';
import { UsersModel } from 'src/users/entities/users.entity';

@Injectable()
export class DevBattleService {

  constructor(
    @InjectRepository(DevBattle)
    private devBattleRepo: Repository<DevBattle>,
    @InjectRepository(TagForDevBattle)
    private tagForDevBattleRepo: Repository<TagForDevBattle>,
    @InjectRepository(TeamForDevBattle)
    private teamForDevBattleRepo: Repository<TeamForDevBattle>,
    @InjectRepository(DevProgressForTeam)
    private devProgressForTeamRepo: Repository<DevProgressForTeam>,
    @InjectRepository(MemberForDevTeam)
    private memberForDevTeamRepo: Repository<MemberForDevTeam>,
    @InjectRepository(UsersModel)
    private usersRepo: Repository<UsersModel>,
  ) { }

  async deleteDevProgressForTeam(idForProgressForDevBattle: number): Promise<{ message: string }> {
    const devProgressForTeam = await this.devProgressForTeamRepo.findOne({
      where: { id: idForProgressForDevBattle },
    });

    if (!devProgressForTeam) {
      throw new NotFoundException(`DevProgressForTeam with ID ${idForProgressForDevBattle} not found`);
    }

    await this.devProgressForTeamRepo.remove(devProgressForTeam);
    return { message: 'DevProgressForTeam deleted successfully' };
  }

  async addMemberToTeam(
    teamId: number,
    memberId: number,
  ) {
    const team = await this.teamForDevBattleRepo.findOneBy({ id: teamId });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const member = await this.usersRepo.findOneBy({ id: memberId });
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const existingMemberForDevTeam = await this.memberForDevTeamRepo.findOneBy({
      user: { id: memberId },
      team: { id: teamId },
    });

    if (existingMemberForDevTeam) {
      await this.memberForDevTeamRepo.remove(existingMemberForDevTeam);
      return {
        statusCode: 200,
        message: 'Member has been removed from team',
        data: null,
      };
    }

    const memberForDevTeam = new MemberForDevTeam();
    memberForDevTeam.user = member;
    memberForDevTeam.team = team;

    const savedMemberForDevTeam = await this.memberForDevTeamRepo.save(memberForDevTeam);
    return {
      statusCode: 201,
      message: 'Member has been added to team',
      data: savedMemberForDevTeam,
    };
  }

  async deleteTeamForDevBattle(teamId: number): Promise<void> {
    const team = await this.teamForDevBattleRepo.findOneBy({ id: teamId });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Delete the team's dev progress records
    const devProgressRecords = await this.devProgressForTeamRepo.findBy({ team: team });
    await this.devProgressForTeamRepo.remove(devProgressRecords);

    // Delete the team's member records
    const memberRecords = await this.memberForDevTeamRepo.findBy({ team: team });
    await this.memberForDevTeamRepo.remove(memberRecords);

    // Delete the team record
    await this.teamForDevBattleRepo.remove(team);
  }

  async removeDevBattleById(id: number): Promise<void> {
    const devBattle = await this.devBattleRepo.findOneBy({ id });

    if (!devBattle) {
      throw new NotFoundException(`DevBattle with ID ${id} not found`);
    }

    await this.devBattleRepo.remove(devBattle);
  }

  async findAllDevBattle(): Promise<DevBattle[]> {
    return await this.devBattleRepo.find({
      relations: ['tags', 'teams', 'teams.devProgressForTeams', 'teams.members', 'teams.members.user'],
      order: {
        id: 'ASC',
        teams: {
          devProgressForTeams: {
            id: 'ASC', // teams.devProgressForTeams 엔티티 내 id 필드 오름차순 정렬
          },
        },
      },
    });
  }

  async getAllTeams(): Promise<TeamForDevBattle[]> {
    return await this.teamForDevBattleRepo.find();
  }

  async addDevProgressForTeam(teamId: number, addDevProgressForTeamDto: AddDevProgressForTeamDto): Promise<DevProgressForTeam> {
    const team = await this.teamForDevBattleRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const devProgress = new DevProgressForTeam();
    devProgress.task = addDevProgressForTeamDto.task;
    devProgress.figmaUrl = addDevProgressForTeamDto.figmaUrl;
    devProgress.youtubeUrl = addDevProgressForTeamDto.youtubeUrl;
    devProgress.noteUrl = addDevProgressForTeamDto.noteUrl;
    devProgress.status = addDevProgressForTeamDto.status;
    devProgress.team = team;

    return await this.devProgressForTeamRepo.save(devProgress);
  }

  async addTeamToDevBattle(
    devBattleId: number,
    addTeamDto: AddTeamToDevBattleDto,
  ): Promise<DevBattle> {
    const { name, description } = addTeamDto;

    // 해당 DevBattle을 찾음
    const devBattle = await this.devBattleRepo.findOne({
      where: { id: devBattleId },
      relations: ['teams'], // 관련된 teams도 로드
    });

    if (!devBattle) {
      // DevBattle이 없을 경우 예외 처리
      throw new Error(`DevBattle with id ${devBattleId} not found`);
    }

    // TeamForDevBattle 엔티티 생성
    const team = this.teamForDevBattleRepo.create({
      name,
      description,
      devBattle,
    });

    // 데이터베이스에 저장
    const savedTeam = await this.teamForDevBattleRepo.save(team);

    // DevBattle에 저장된 팀 추가
    devBattle.teams.push(savedTeam);

    // DevBattle 업데이트
    await this.devBattleRepo.save(devBattle);

    // 업데이트된 DevBattle 반환
    return devBattle;
  }

  // async findAllDevBattle(): Promise<DevBattle[]> {
  //   return await this.devBattleRepo.find({
  //     relations: ['tags', 'teams'], // Include 'teams' in the relations array
  //     order: { id: 'ASC' },
  //   });
  // }

  async addTagToDevBattle(devBattleId: number, textForTag: string): Promise<DevBattle> {
    const devBattle = await this.devBattleRepo.findOne({
      where: { id: devBattleId },
      relations: ['tags'],
    });

    if (!devBattle) {
      throw new Error('DevBattle not found');
    }

    let tag = await this.tagForDevBattleRepo.findOne({ where: { name: textForTag } });

    if (!tag) {
      // Create a new tag if it doesn't exist
      tag = new TagForDevBattle();
      tag.name = textForTag;
      tag = await this.tagForDevBattleRepo.save(tag);
    }

    devBattle.tags.push(tag);
    return await this.devBattleRepo.save(devBattle);
  }

  async bulkCreateDevBattles(subjects: string[]): Promise<DevBattle[]> {
    const devBattles: DevBattle[] = [];

    for (const subject of subjects) {
      const devBattle = new DevBattle();
      devBattle.subject = subject;
      devBattles.push(devBattle);
    }

    return await this.devBattleRepo.save(devBattles);
  }

  async createDevBattle(createDevBattleDto: CreateDevBattleDto): Promise<DevBattle> {
    const devBattle = new DevBattle();
    devBattle.subject = createDevBattleDto.subject;
    return await this.devBattleRepo.save(devBattle);
  }

  findOne(id: number) {
    return `This action returns a #${id} devBattle`;
  }

  update(id: number, updateDevBattleDto: UpdateDevBattleDto) {
    return `This action updates a #${id} devBattle`;
  }


}
