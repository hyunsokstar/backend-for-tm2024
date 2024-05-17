import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DevRelay } from './entities/dev-relay.entity';
import { Repository } from 'typeorm';
import { AssignmentCategory, DevAssignment } from './entities/dev-assignment.entity';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';
import { DevAssignmentSubmission } from './entities/dev-assignment-submission.entity';
import { CreateDevAssignmentSubmissionDto } from './dto/create-dev-assignment-submission.dto';

@Injectable()
export class DevRelayService {

  constructor(
    @InjectRepository(DevRelay)
    private devRelayRepo: Repository<DevRelay>,
    @InjectRepository(DevAssignment)
    private devAssignmentRepo: Repository<DevAssignment>,
    @InjectRepository(DevAssignmentSubmission)
    private devAssignmentSubmissionRepo: Repository<DevAssignmentSubmission>,
  ) { }

  async findAllDevAssignments(category: AssignmentCategory): Promise<DevAssignment[]> {
    if (category) {
      return await this.devAssignmentRepo.find({
        where: { category },
        relations: ['submissions'],
      });
    } else {
      return await this.devAssignmentRepo.find({ relations: ['submissions'] });
    }
  }

  async createDevAssignmentSubmission(devAssignmentId: number, createDevAssignmentSubmissionDto: CreateDevAssignmentSubmissionDto): Promise<DevAssignmentSubmission> {
    const { title, noteUrl, figmaUrl, youtubeUrl } = createDevAssignmentSubmissionDto;

    // DevAssignment 조회
    const devAssignment = await this.devAssignmentRepo.findOne({
      where: { id: devAssignmentId },
    });

    if (!devAssignment) {
      throw new NotFoundException(`Dev Assignment with ID ${devAssignmentId} not found`);
    }

    // DevAssignmentSubmission 생성
    const devAssignmentSubmission = this.devAssignmentSubmissionRepo.create({
      title,
      noteUrl,
      figmaUrl,
      youtubeUrl,
      devAssignment, // 이 부분이 수정된 부분입니다.
    });

    return await this.devAssignmentSubmissionRepo.save(devAssignmentSubmission);
  }

  async createDevAssignments(createDevAssignmentsDto: CreateDevAssignmentDto[]): Promise<DevAssignment[]> {
    const createdAssignments: DevAssignment[] = [];
    for (const assignmentDto of createDevAssignmentsDto) {
      const createdAssignment = await this.createDevAssignment(assignmentDto);
      createdAssignments.push(createdAssignment);
    }
    return createdAssignments;
  }

  async createDevAssignment(createDevAssignmentDto: CreateDevAssignmentDto): Promise<DevAssignment> {
    const { day, title, category } = createDevAssignmentDto;
    const newAssignment = this.devAssignmentRepo.create({ day, title, category });
    return this.devAssignmentRepo.save(newAssignment);
  }

  async findAllDevRelays(): Promise<DevRelay[]> {
    return await this.devRelayRepo.find();
  }

  // dev relay data 하나 추가
  async create(createDevRelayDto: CreateDevRelayDto): Promise<DevRelay> {
    const devRelay = this.devRelayRepo.create(createDevRelayDto);
    return await this.devRelayRepo.save(devRelay);
  }

  findOne(id: number) {
    return `This action returns a #${id} devRelay`;
  }

  update(id: number, updateDevRelayDto: UpdateDevRelayDto) {
    return `This action updates a #${id} devRelay`;
  }

  remove(id: number) {
    return `This action removes a #${id} devRelay`;
  }
}
