import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevRelayService } from './dev-relay.service';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';

@Controller('dev-relay')
export class DevRelayController {
  constructor(private readonly devRelayService: DevRelayService) { }

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

  @Get('dev-assignments')
  findAllDevAssignments() {
    return this.devRelayService.findAllDevAssignments();
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
