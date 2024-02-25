import { Injectable } from '@nestjs/common';
import { CreateStarterProjectDto } from './dto/create-starter-project.dto';
import { UpdateStarterProjectDto } from './dto/update-starter-project.dto';

@Injectable()
export class StarterProjectsService {
  create(createStarterProjectDto: CreateStarterProjectDto) {
    return 'This action adds a new starterProject';
  }

  findAll() {
    return `This action returns all starterProjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} starterProject`;
  }

  update(id: number, updateStarterProjectDto: UpdateStarterProjectDto) {
    return `This action updates a #${id} starterProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} starterProject`;
  }
}
