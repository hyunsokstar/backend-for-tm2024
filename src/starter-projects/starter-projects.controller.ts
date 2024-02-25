import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StarterProjectsService } from './starter-projects.service';
import { CreateStarterProjectDto } from './dto/create-starter-project.dto';
import { UpdateStarterProjectDto } from './dto/update-starter-project.dto';

@Controller('starterkits')
export class StarterProjectsController {
  constructor(private readonly starterProjectsService: StarterProjectsService) { }

  @Post()
  create(@Body() createStarterProjectDto: CreateStarterProjectDto) {
    return this.starterProjectsService.create(createStarterProjectDto);
  }

  @Get()
  findAllStarterKitsWithPagination(
    @Query('pageNum') pageNum: number,
  ) {
    const perPage = 20;

    return this.starterProjectsService.findAllStarterKitsWithPagination({ pageNum, perPage });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.starterProjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStarterProjectDto: UpdateStarterProjectDto) {
    return this.starterProjectsService.update(+id, updateStarterProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.starterProjectsService.remove(+id);
  }
}
