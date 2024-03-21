import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengesModel } from './entities/challenge.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SubChallengesModel } from './entities/sub_challenge.entity';
import { CreateSubChallengeDto } from './dto/create-sub-challenge.dto';

@Injectable()
export class ChallengesService {

  constructor(
    @InjectRepository(ChallengesModel)
    private challengesRepo: Repository<ChallengesModel>,
    @InjectRepository(SubChallengesModel)
    private SubChallengesRepo: Repository<SubChallengesModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) { }

  async createSubChallenge(challengeId: string, createSubChallengeDto: CreateSubChallengeDto): Promise<SubChallengesModel> {
    const challenge = await this.challengesRepo.findOne({ where: { id: challengeId } });

    if (!challenge) {
      throw new NotFoundException(`해당 ID(${challengeId})의 챌린지를 찾을 수 없습니다.`);
    }

    const subChallenge = new SubChallengesModel();
    subChallenge.subChallengeName = createSubChallengeDto.subChallengeName;
    subChallenge.description = createSubChallengeDto.description;
    subChallenge.prize = createSubChallengeDto.prize;
    subChallenge.deadline = new Date(createSubChallengeDto.deadline);
    subChallenge.challenge = challenge;

    const savedSubChallenge = await this.SubChallengesRepo.save(subChallenge);

    return savedSubChallenge;
  }

  async findAllSubChallenges(challengeId: string): Promise<SubChallengesModel[]> {
    const challenge = await this.challengesRepo.findOne({ where: { id: challengeId }, relations: ['subChallenges'] });

    if (!challenge) {
      throw new NotFoundException(`해당 ID(${challengeId})의 챌린지를 찾을 수 없습니다.`);
    }

    return challenge.subChallenges;
  }

  async updateChallenge(id: string, updateChallengeDto: UpdateChallengeDto): Promise<ChallengesModel> {
    console.log("check for update challenge id : ", id);

    const challenge = await this.challengesRepo.findOne({ where: { id } });

    if (!challenge) {
      console.log("check for id : ", id);

      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }

    // 업데이트할 필드들만 설정
    if (updateChallengeDto.challengeName) {
      challenge.challengeName = updateChallengeDto.challengeName;
    }
    if (updateChallengeDto.description) {
      challenge.description = updateChallengeDto.description;
    }
    if (updateChallengeDto.prize) {
      challenge.prize = updateChallengeDto.prize;
    }
    if (updateChallengeDto.deadline) {
      challenge.deadline = new Date(updateChallengeDto.deadline);
    }

    const updatedChallenge = await this.challengesRepo.save(challenge);

    return updatedChallenge;
  }


  async deleteChallenge(id: string): Promise<void> {
    // 챌린지 id로 챌린지를 찾습니다.
    const challenge = await this.challengesRepo.findOne({ where: { id } });

    // 챌린지가 없으면 예외를 던집니다.
    if (!challenge) {
      throw new NotFoundException(`해당 ID(${id})의 챌린지를 찾을 수 없습니다.`);
    }

    // 챌린지를 삭제합니다.
    await this.challengesRepo.delete(id);
  }

  // challenge 하나 입력 구현
  async createChallenge(loginUser: UsersModel, createChallengeDto: CreateChallengeDto): Promise<ChallengesModel> {
    console.log("create challenge check !!");

    const writer = await this.usersRepository.findOne({ where: { id: loginUser.id } });
    console.log("create challenge check !! ", writer);

    if (!writer) {
      throw new HttpException('Writer not found', HttpStatus.NOT_FOUND);
    }

    console.log("create 111");
    console.log("createChallengeDto.prize : ", createChallengeDto.prize);


    const challenge = new ChallengesModel();
    challenge.challengeName = createChallengeDto.challengeName;
    challenge.description = createChallengeDto.description;
    challenge.prize = createChallengeDto.prize;
    challenge.deadline = new Date(createChallengeDto.deadline);
    challenge.writer = writer;

    const savedChallenge = await this.challengesRepo.save(challenge);

    // 클라이언트에게 생성된 챌린지 정보를 반환합니다.
    return savedChallenge;
  }


  async findAllChallenges(pageNum: number = 1):
    Promise<{ challengeList: ChallengesModel[], totalCount: number, perPage: number }> {
    const perPage = 20;
    const skip = (pageNum - 1) * perPage;

    console.log("perPage : ", perPage);
    console.log("perPage : ", typeof perPage);

    const [challengeList, totalCount] = await this.challengesRepo
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.writer', 'writer')
      .skip(skip)
      .take(perPage)
      .getManyAndCount();

    return { challengeList, totalCount, perPage };
  }

  findOne(id: number) {
    return `This action returns a #${id} challenge`;
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

}
