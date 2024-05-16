import { Injectable } from '@nestjs/common';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DevRelay } from './entities/dev-relay.entity';
import { Repository } from 'typeorm';
import { DevAssignment } from './entities/dev-assignment.entity';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';

@Injectable()
export class DevRelayService {

  constructor(
    @InjectRepository(DevRelay)
    private devRelayRepo: Repository<DevRelay>,
    @InjectRepository(DevAssignment)
    private devAssignmentRepo: Repository<DevAssignment>,
  ) { }

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

  async findAllDevAssignments(): Promise<DevAssignment[]> {
    return await this.devAssignmentRepo.find();
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
