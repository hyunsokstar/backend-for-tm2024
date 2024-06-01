import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { UsersModel } from 'src/users/entities/users.entity';
import { DevSpecForTeamBattle } from './entities/dev-spec-for-team-battle.entity';
import { AddItemToSpecificFieldForTeamDevSpecDto } from './dto/add-Item-to-Specific-field-for-team-dev-spec.dto';
import { TechNotesModel } from 'src/technotes/entities/technotes.entity';

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
    @InjectRepository(DevSpecForTeamBattle)
    private devSpecForTeamBattleRepo: Repository<DevSpecForTeamBattle>,

    @InjectRepository(TechNotesModel)
    private techNotesModelRepo: Repository<TechNotesModel>,

  ) { }

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

    // DevSpecForTeamBattle 엔티티 생성
    const devSpecForTeamBattle = this.devSpecForTeamBattleRepo.create({
      // 여기서는 빈 값으로 설정하지만, 필요에 따라 초기값을 설정할 수 있습니다.
      backendLanguage: null,
      frontendLanguage: null,
      backendLibrary: null,
      frontendLibrary: null,
      orm: null,
      css: null,
      app: null,
      collaborationTool: null,
      devops: null,
      devTeam: savedTeam, // 여기서 savedTeam을 할당합니다.
    });

    // DevSpecForTeamBattle을 데이터베이스에 저장합니다.
    const savedDevSpecForTeamBattle = await this.devSpecForTeamBattleRepo.save(devSpecForTeamBattle);

    // DevBattle에 저장된 팀 추가
    devBattle.teams.push(savedTeam);

    // DevBattle 업데이트
    await this.devBattleRepo.save(devBattle);

    // 업데이트된 DevBattle 반환
    return devBattle;
  }

  async updateForSpecificDevSpecForNotArryTypeForTeamBattle(
    teamId: number,
    fieldName: string,
    itemText: string,
  ): Promise<void> {
    console.log("teamId fieldName itemText :", teamId, fieldName, itemText);

    const team = await this.teamForDevBattleRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    let devSpec = await this.devSpecForTeamBattleRepo.findOne({
      where: {
        devTeam: { id: team.id },
      },
    });

    if (!devSpec) {
      devSpec = new DevSpecForTeamBattle();
    }

    const validFields = [
      'backendLanguage',
      'frontendLanguage',
      'orm',
      'css',
      'app',
    ];

    if (validFields.includes(fieldName)) {
      devSpec[fieldName] = itemText;
    } else {
      throw new BadRequestException(
        `Field name '${fieldName}' is not a valid string field in DevSpecForTeamBattle entity`,
      );
    }

    await this.devSpecForTeamBattleRepo.save(devSpec, { reload: true });
  }

  async addItemToSpecificFieldForDevSpec(
    teamId: number,
    devSpecForTeamBattleUpdateDto: AddItemToSpecificFieldForTeamDevSpecDto,
  ): Promise<void> {
    console.log("teamId : ", teamId);
    console.log("devSpecForTeamBattleUpdateDto : ", devSpecForTeamBattleUpdateDto);

    // Retrieve the TeamForDevBattle object that corresponds to the provided teamId
    const team = await this.teamForDevBattleRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const fieldName = devSpecForTeamBattleUpdateDto.fieldName;
    let devSpec = await this.devSpecForTeamBattleRepo.findOne({
      where: {
        devTeam: { id: team.id },
      },
    });

    if (!devSpec) {
      devSpec = new DevSpecForTeamBattle();
    }

    // Initialize the properties of the devSpec object as empty arrays
    devSpec.backendLibrary = devSpec.backendLibrary || [];
    devSpec.frontendLibrary = devSpec.frontendLibrary || [];
    devSpec.collaborationTool = devSpec.collaborationTool || [];
    devSpec.devops = devSpec.devops || [];

    // Add the new item to the current value of the field using a switch statement
    switch (fieldName) {
      case 'backendLibrary':
        devSpec.backendLibrary.push(devSpecForTeamBattleUpdateDto.itemText);
        break;
      case 'frontendLibrary':
        devSpec.frontendLibrary.push(devSpecForTeamBattleUpdateDto.itemText);
        break;
      case 'collaborationTool':
        devSpec.collaborationTool.push(devSpecForTeamBattleUpdateDto.itemText);
        break;
      case 'devops':
        devSpec.devops.push(devSpecForTeamBattleUpdateDto.itemText);
        break;
      default:
        throw new BadRequestException(`Field name '${fieldName}' is not a valid array field in DevSpecForTeamBattle entity`);
    }

    console.log("devSpec : ", devSpec);

    // Save the updated DevSpecForTeamBattle object to the database
    await this.devSpecForTeamBattleRepo.save(devSpec, { reload: true });
  }

  async deleteTeamForDevBattle(teamId: number): Promise<void> {
    const team = await this.teamForDevBattleRepo.findOneBy({ id: teamId });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const devProgressRecords = await this.devProgressForTeamRepo.findBy({ id: team.id });
    await this.devProgressForTeamRepo.remove(devProgressRecords);

    // Delete the team's member records
    const memberRecords = await this.memberForDevTeamRepo.findBy({ id: team.id });
    await this.memberForDevTeamRepo.remove(memberRecords);

    // Delete dev specs for team id
    const devSpecs = await this.devSpecForTeamBattleRepo
      .createQueryBuilder("devSpec")
      .leftJoinAndSelect("devSpec.devTeam", "devTeam")
      .where("devTeam.id = :id", { id: teamId })
      .getMany();

    await this.devSpecForTeamBattleRepo.remove(devSpecs);

    // Delete the team record
    await this.teamForDevBattleRepo.remove(team);
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

  async removeDevBattleById(id: number): Promise<void> {
    const devBattle = await this.devBattleRepo.findOneBy({ id });

    if (!devBattle) {
      throw new NotFoundException(`DevBattle with ID ${id} not found`);
    }

    await this.devBattleRepo.remove(devBattle);
  }

  async findAllDevBattle(): Promise<DevBattle[]> {
    return await this.devBattleRepo.find({
      relations: [
        'tags',
        'teams',
        'teams.devProgressForTeams',
        'teams.members',
        'teams.members.user',
        'teams.devSpecs', // Added this line to include DevSpecForTeamBattle entities
      ],
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
function IsNull() {
  throw new Error('Function not implemented.');
}

function IsNullable(arg0: string): any {
  throw new Error('Function not implemented.');
}

