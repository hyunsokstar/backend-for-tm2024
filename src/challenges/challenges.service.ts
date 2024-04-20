import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengesModel } from './entities/challenge.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SubChallengesModel } from './entities/sub_challenge.entity';
import { CreateSubChallengeDto } from './dto/create-sub-challenge.dto';
import { ParticipantsForSubChallengeModel } from './entities/participants-for-sub-challenge.entity';
import { SubChallengeBriefingsModel } from './entities/sub-challenge-briefings.entity';
import { CreateBriefingForSubChallengeDto } from './dto/create-briefing-for-sub-challenge.dto';

@Injectable()
export class ChallengesService {

  constructor(
    @InjectRepository(ChallengesModel)
    private challengesRepo: Repository<ChallengesModel>,
    @InjectRepository(SubChallengesModel)
    private subChallengesRepo: Repository<SubChallengesModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(ParticipantsForSubChallengeModel)
    private readonly participantsForSubChallengeRepo: Repository<ParticipantsForSubChallengeModel>,
    @InjectRepository(SubChallengeBriefingsModel)
    private readonly subChallengeBriefingsRepo: Repository<SubChallengeBriefingsModel>
  ) { }

  async createBriefingForSubChallenge(subChallengeId: number, loginUser, createBriefingDto: CreateBriefingForSubChallengeDto): Promise<SubChallengeBriefingsModel> {
    // SubChallenge 확인
    const subChallenge = await this.subChallengesRepo.findOne({ where: { id: subChallengeId } });
    if (!subChallenge) {
      throw new NotFoundException(`SubChallenge with ID ${subChallengeId} not found`);
    }


    // 새로운 브리핑 생성
    const newBriefing = this.subChallengeBriefingsRepo.create({
      ...createBriefingDto,
      subChallenge,
      writer: loginUser,
    });

    // 생성된 브리핑 저장
    return await this.subChallengeBriefingsRepo.save(newBriefing);
  }

  async updateParticipantNoteUrl(participantId: number, noteUrlForUpdate: string) {
    try {
      // 참가자를 찾음
      const participant = await this.participantsForSubChallengeRepo.findOne({ where: { id: participantId } });
      if (!participant) {
        throw new Error('Participant not found');
      }

      // 노트 URL 업데이트
      participant.noteUrl = noteUrlForUpdate;

      // 업데이트된 참가자 저장
      await this.participantsForSubChallengeRepo.save(participant);

      // 성공 응답 반환
      return { success: true, message: `noteUrl을 ${noteUrlForUpdate}로 업데이트 했습니다` };
    } catch (error) {
      // 오류 발생 시 오류 응답 반환
      return { success: false, message: `오류: ${error.message}` };
    }
  }

  async updateIsPassedForParticipantForSubChallenge(subChallengeId: number, participantId: number, isPassed: boolean) {
    try {
      console.log("요청 확인 isPassedUpdate");
      console.log("요청 확인 subChallengeId : ", subChallengeId);
      console.log("요청 확인 participantId : ", participantId);

      // 해당하는 subChallenge와 participant를 찾습니다.
      const subChallenge = await this.subChallengesRepo.findOne({ where: { id: subChallengeId } });
      const participant = await this.participantsForSubChallengeRepo.findOne({ where: { user: { id: participantId }, subChallenge: { id: subChallengeId } } });

      console.log('subChallenge : ', subChallenge);
      console.log('participant : ', participant);


      if (!subChallenge || !participant) {
        throw new NotFoundException('SubChallenge or Participant not found');
      }

      // isPassed 값을 업데이트하고 저장합니다.
      const previousIsPassed = participant.isPassed;
      participant.isPassed = !previousIsPassed;

      await this.participantsForSubChallengeRepo.save(participant);

      return {
        message: `isPassed updated from ${previousIsPassed} to ${!previousIsPassed} successfully`
      };
    } catch (error) {
      console.log("error : ", error);

      throw new InternalServerErrorException('Failed to update isPassed');
    }
  }

  async findSubchallengeById(subChallengeId: number): Promise<SubChallengesModel> {
    return await this.subChallengesRepo.findOne({ where: { id: subChallengeId } });
  }

  async findAllParticipantsForSubChallenges(subChallengeId: number): Promise<ParticipantsForSubChallengeModel[]> {

    console.log("subChallengeId : ", subChallengeId);

    try {
      // subChallengeId에 해당하는 subChallenge를 찾습니다.
      const subChallenge = await this.subChallengesRepo.findOne({ where: { id: subChallengeId } });
      console.log("subChallenge : ", subChallenge);


      if (!subChallenge) {
        throw new NotFoundException('Sub Challenge not found');
      }

      // subChallenge에 대한 모든 참가자 목록을 가져옵니다.
      const participantsForSubChallenge = await this.participantsForSubChallengeRepo.find({ where: { subChallenge: { id: subChallengeId } }, relations: ['user'] });
      console.log("participantsForSubChallenge : ", participantsForSubChallenge);

      return participantsForSubChallenge;
    } catch (error) {
      throw new InternalServerErrorException('서버 오류가 발생했습니다.');
    }
  }

  async addParticipantForSubChallenge(loginUser: UsersModel, subChallengeId: number, noteUrl: string): Promise<ParticipantsForSubChallengeModel> {
    // userId와 subChallengeId에 해당하는 사용자 및 서브 챌린지가 존재하는지 확인
    const subChallenge = await this.subChallengesRepo.findOne({ where: { id: subChallengeId } });

    if (!loginUser || !subChallenge) {
      throw new NotFoundException('User or sub challenge not found');
    }

    // participantsForSubChallengeRepo에서 loginUser에 해당하는 데이터가 존재할 경우, 이미 참여중이므로 삭제 후 탈퇴 메시지 응답
    const existingParticipant = await this.participantsForSubChallengeRepo.findOne({ where: { user: { id: loginUser.id }, subChallenge: { id: subChallengeId } } });

    if (existingParticipant) {
      await this.participantsForSubChallengeRepo.remove(existingParticipant);
      return null; // 참여를 취소했으므로, 응답값을 반환하지 않음
    }

    // ParticipantsForSubChallengeModel 엔티티 생성 및 저장
    const participant = new ParticipantsForSubChallengeModel();
    participant.user = loginUser;
    participant.subChallenge = subChallenge;
    participant.noteUrl = noteUrl;

    return this.participantsForSubChallengeRepo.save(participant);
  }


  async createSubChallenge(loginUser: UsersModel, challengeId: number, createSubChallengeDto: CreateSubChallengeDto): Promise<SubChallengesModel> {
    const challenge = await this.challengesRepo.findOne({ where: { id: challengeId } });

    if (!challenge) {
      throw new NotFoundException(`해당 ID(${challengeId})의 챌린지를 찾을 수 없습니다.`);
    }

    const subChallenge = new SubChallengesModel();
    subChallenge.challengeName = createSubChallengeDto.challengeName;
    subChallenge.description = createSubChallengeDto.description;
    subChallenge.prize = createSubChallengeDto.prize;
    subChallenge.deadline = new Date(createSubChallengeDto.deadline);
    subChallenge.challenge = challenge;
    subChallenge.writer = loginUser;

    const savedSubChallenge = await this.subChallengesRepo.save(subChallenge);

    return savedSubChallenge;
  }

  async findAllSubChallenges(challengeId: number): Promise<SubChallengesModel[]> {
    const challenge = await this.challengesRepo.findOne({ where: { id: challengeId }, relations: ['subChallenges'] });

    if (!challenge) {
      throw new NotFoundException(`해당 ID(${challengeId})의 챌린지를 찾을 수 없습니다.`);
    }

    return challenge.subChallenges;
  }

  async updateMainChallenge(id: number, updateChallengeDto: UpdateChallengeDto): Promise<ChallengesModel> {
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
  async updateSubChallenge(id: number, updateChallengeDto: UpdateChallengeDto): Promise<SubChallengesModel> {
    console.log("check for update challenge id : ", id);

    const challenge = await this.subChallengesRepo.findOne({ where: { id } });

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

    const updatedSubChallenge = await this.subChallengesRepo.save(challenge);

    return updatedSubChallenge;
  }


  async deleteMainChallenge(id: number): Promise<void> {
    // 챌린지 id로 챌린지를 찾습니다.
    const challenge = await this.challengesRepo.findOne({ where: { id } });

    // 챌린지가 없으면 예외를 던집니다.
    if (!challenge) {
      throw new NotFoundException(`해당 ID(${id})의 챌린지를 찾을 수 없습니다.`);
    }

    // 챌린지를 삭제합니다.
    await this.challengesRepo.delete(id);
  }

  async deleteSubChallenge(id: number): Promise<void> {
    // 챌린지 id로 챌린지를 찾습니다.
    const challenge = await this.subChallengesRepo.findOne({ where: { id } });

    // 챌린지가 없으면 예외를 던집니다.
    if (!challenge) {
      throw new NotFoundException(`해당 ID(${id})의 챌린지를 찾을 수 없습니다.`);
    }

    // 챌린지를 삭제합니다.
    await this.subChallengesRepo.delete(id);
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
      .leftJoinAndSelect('challenge.subChallenges', 'subChallenges')
      .leftJoinAndSelect('subChallenges.briefings', 'briefings')
      .leftJoinAndSelect('briefings.writer', 'briefingWriter')
      .leftJoinAndSelect('subChallenges.writer', 'subChallengeWriter')
      .skip(skip)
      .take(perPage)
      .getManyAndCount();

    return { challengeList, totalCount, perPage };
  }


}
