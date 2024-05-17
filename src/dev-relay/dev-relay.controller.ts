import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DevRelayService } from './dev-relay.service';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';
import { CreateDevAssignmentSubmissionDto } from './dto/create-dev-assignment-submission.dto';
import { AssignmentCategory } from './entities/dev-assignment.entity';

@Controller('dev-relay')
export class DevRelayController {
  constructor(private readonly devRelayService: DevRelayService) { }

  @Get('dev-assignments')
  findAllDevAssignments(@Query('category') category: AssignmentCategory) {
    return this.devRelayService.findAllDevAssignments(category);
  }

  // DevAssignmentSubmission 생성 라우트
  @Post(':id/dev-assignment-submission')
  async createDevAssignmentSubmission(
    @Param('id') devAssignmentId: number,
    @Body() createDevAssignmentSubmissionDto: CreateDevAssignmentSubmissionDto,
  ) {
    console.log("devAssignmentId : ", devAssignmentId);
    return this.devRelayService.createDevAssignmentSubmission(devAssignmentId, createDevAssignmentSubmissionDto);
  }

  @Get('')
  findAllDevRelays() {
    return this.devRelayService.findAllDevRelays();
  }

  @Post('create-dev-assignments')
  createDevAssignments(@Body() createDevAssignmentsDto: CreateDevAssignmentDto[]) {
    return this.devRelayService.createDevAssignments(createDevAssignmentsDto);
  }

  @Post('create-dev-assignment')
  createDevAssignment(@Body() createDevAssignmentDto: CreateDevAssignmentDto) {
    return this.devRelayService.createDevAssignment(createDevAssignmentDto);
  }

  @Post()
  create(@Body() createDevRelayDto: CreateDevRelayDto) {
    return this.devRelayService.create(createDevRelayDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devRelayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevRelayDto: UpdateDevRelayDto) {
    return this.devRelayService.update(+id, updateDevRelayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devRelayService.remove(+id);
  }
}
