import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, HttpCode } from '@nestjs/common';
import { DevRelayService } from './dev-relay.service';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';
import { CreateDevAssignmentSubmissionDto } from './dto/create-dev-assignment-submission.dto';
import { CategoryForDevAssignmentDto } from './dto/category-for-dev-assignment.dto';
import { CategoryForDevAssignment } from './entities/category-for-dev-assignment.entity';
import { DevAssignment } from './entities/dev-assignment.entity';
import { SubjectForCategory } from './entities/subject-for-category.entity';
import { CreateSubjectDto } from './dto/subject-for-category.dto';
import { SubjectResponse } from './interface/subject-response.interface';
import { CreateCategoriesForDevAssignmentDto } from './dto/create-categories-for-dev-assignment.dto';

@Controller('dev-relay')
export class DevRelayController {
  constructor(private readonly devRelayService: DevRelayService) { }

  @Post('subject/:subjectId/categories')
  async createCategories(
    @Param('subjectId') subjectId: number,
    @Body() createCategoriesDto: CreateCategoriesForDevAssignmentDto
  ) {

    console.log("createCategoriesDto: ", createCategoriesDto);
    console.log("subjectId :", subjectId);

    const categories = await this.devRelayService.createCategoriesForSubject(createCategoriesDto.name, subjectId);
    return {
      message: `${categories.length} categories were successfully added.`,
    };
  }

  @Post('subject/:subjectId/category')
  async createCategory(@Param('subjectId') subjectId: number, @Body('name') name: string) {
    return await this.devRelayService.createCategoryForSubject(name, subjectId);
  }

  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: number): Promise<{ id: number; name: string }> {
    const subject = await this.devRelayService.deleteSubject(id);
    return { id: subject.id, name: subject.name };
  }

  @Delete('dev-assignment/:id')
  @HttpCode(200)
  async deleteDevAssignment(@Param('id') id: number): Promise<object> {
    await this.devRelayService.deleteDevAssignment(id);
    return { message: `DevAssignment has been deleted successfully. ofr ${id}` };
  }

  @Put('subject/:subjectId/update-name')
  async updateSubjectName(
    @Param('subjectId') subjectId: number,
    @Body('name') name: string,
  ): Promise<{ id: number, name: string }> {
    const updatedSubject = await this.devRelayService.updateSubjectName(
      subjectId,
      name,
    );

    return {
      id: updatedSubject.id,
      name: updatedSubject.name,
    };

  }

  @Post('dev-assignment/:id/dev-assignment-submission')
  async createDevAssignmentSubmission(
    @Param('id') devAssignmentId: number,
    @Body() createDevAssignmentSubmissionDto: CreateDevAssignmentSubmissionDto,
  ) {
    console.log("dev-assignment-submission 생성 요청 check : ", devAssignmentId);
    return this.devRelayService.createDevAssignmentSubmission(devAssignmentId, createDevAssignmentSubmissionDto);
  }

  @Delete('dev-assignment-submission/:id')
  @HttpCode(200)
  async deleteDevAssignmentSubmission(@Param('id') id: number): Promise<{ message: string }> {
    return this.devRelayService.deleteDevAssignmentSubmission(id);
  }

  @Post(':categoryId/create-dev-assignment')
  createDevAssignment(@Param('categoryId') categoryId: number, @Body() createDevAssignmentDto: CreateDevAssignmentDto) {
    return this.devRelayService.createDevAssignment(categoryId, createDevAssignmentDto);
  }

  @Get('subjects')
  async getAllSubjects(): Promise<SubjectResponse[]> {
    return this.devRelayService.getAllSubjects();
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: number): Promise<any> {
    console.log("cateogory delete 요청 check !");
    const category = await this.devRelayService.deleteCategory(id);
    return { message: `Category with ID ${id} has been deleted.`, name: category.name };
  }

  @Post('subjects')
  async createSubjectForCategory(@Body() createSubjectForCategoryDto: CreateSubjectDto): Promise<SubjectForCategory> {
    return this.devRelayService.createSubject(createSubjectForCategoryDto);
  }

  @Get('categories-by-subject/:subjectId')
  async getAllCategoriesBySubject(@Param('subjectId') subjectId: number): Promise<CategoryForDevAssignment[]> {
    return this.devRelayService.getAllCategoriesBySubject(subjectId);
  }

  @Get('categories')
  async getAllCategories(): Promise<CategoryForDevAssignment[]> {
    return this.devRelayService.getAllCategories();
  }

  @Put('updateAllCategoriesToSpecificSubject/:subjectId')
  @HttpCode(200)
  async updateSubject(
    @Param('subjectId') subjectId: number,
  ): Promise<{ updatedCategoryCount: number }> {
    const updatedCategoryCount = await this.devRelayService.updateSubjectForCategory(subjectId);
    return { updatedCategoryCount };
  }

  @Put('category-for-dev-assignment/:id')
  updateCategoryForDevAssginment(
    @Param('id') id: number,
    @Body() updateCategoryDto: CategoryForDevAssignmentDto,
  ): Promise<CategoryForDevAssignmentDto> {
    console.log("category-for-dev-assignment 2 : ", id);

    return this.devRelayService.updateCategoryForDevAssginment(id, updateCategoryDto);
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

  // @Post('categories')
  // async createCategories(@Body() categoriesDto: CategoryForDevAssignmentDto[]) {
  //   return this.devRelayService.createCategories(categoriesDto);
  // }

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
