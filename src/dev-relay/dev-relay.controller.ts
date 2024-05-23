import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { DevRelayService } from './dev-relay.service';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';
import { CreateDevAssignmentSubmissionDto } from './dto/create-dev-assignment-submission.dto';
import { CategoryForDevAssignmentDto } from './dto/category-for-dev-assignment.dto';
import { CategoryForDevAssignment } from './entities/category-for-dev-assignment.entity';
import { DevAssignment } from './entities/dev-assignment.entity';


@Controller('dev-relay')
export class DevRelayController {
  constructor(private readonly devRelayService: DevRelayService) { }

  @Put('category-for-dev-assignment/:id')
  updateCategoryForDevAssginment(
    @Param('id') id: number,
    @Body() updateCategoryDto: CategoryForDevAssignmentDto,
  ): Promise<CategoryForDevAssignmentDto> {
    console.log("category-for-dev-assignment 2 : ", id);

    return this.devRelayService.updateCategoryForDevAssginment(id, updateCategoryDto);
  }


  @Post(':categoryId/create-dev-assignment')
  createDevAssignment(@Param('categoryId') categoryId: number, @Body() createDevAssignmentDto: CreateDevAssignmentDto) {
    return this.devRelayService.createDevAssignment(categoryId, createDevAssignmentDto);
  }

  @Get(':categoryId/dev-assignments')
  async findDevAssignmentsByCategory(@Param('categoryId') categoryId: number): Promise<DevAssignment[]> {
    return this.devRelayService.findDevAssignmentsByCategory(categoryId);
  }

  @Get('dev-assignments')
  async findAllDevAssignments(@Query() query): Promise<DevAssignment[]> {
    return this.devRelayService.findAllDevAssignments();
  }

  @Post(':categoryId/create-dev-assignments')
  createDevAssignments(@Param('categoryId') categoryId: number, @Body() createDevAssignmentsDto: CreateDevAssignmentDto[]) {
    return this.devRelayService.createDevAssignments(categoryId, createDevAssignmentsDto);
  }

  @Get('categories')
  async getAllCategories(): Promise<CategoryForDevAssignment[]> {
    return this.devRelayService.getAllCategories();
  }

  @Post('categories')
  async createCategories(@Body() categoriesDto: CategoryForDevAssignmentDto[]) {
    return this.devRelayService.createCategories(categoriesDto);
  }

  @Post('category')
  async createCategory(@Body() categoryDto: CategoryForDevAssignmentDto) {
    return this.devRelayService.createCategory(categoryDto);
  }

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
