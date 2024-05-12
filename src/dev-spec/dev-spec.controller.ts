import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DevSpecService } from './dev-spec.service';
import { CreateDevSpecDto } from './dto/create-dev-spec.dto';
import { UpdateDevSpecDto } from './dto/update-dev-spec.dto';
import { BestDevSkillSet } from './interface/best-dev-skill-set.interface';
import { GroupedDevSpecs } from './types/grouped-dev-specs.type';


@Controller('dev-spec')
export class DevSpecController {
  constructor(private readonly devSpecService: DevSpecService) { }

  @Post()
  create(@Body() createDevSpecDto: CreateDevSpecDto) {
    return this.devSpecService.create(createDevSpecDto);
  }

  @Get()
  findAll() {
    return this.devSpecService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevSpecDto: UpdateDevSpecDto) {
    return this.devSpecService.update(+id, updateDevSpecDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devSpecService.remove(+id);
  }

  @Post('best-skill-sets')
  createBestDevSkillSets(@Body() bestDevSkillSets: BestDevSkillSet[]) {
    return this.devSpecService.createBestDevSkillSets(bestDevSkillSets);
  }

  @Get('grouped-by-category')
  findAllGroupedByCategory(): Promise<GroupedDevSpecs> {
    console.log("grouped-by-category !! ");

    return this.devSpecService.findAllGroupedByCategory();
  }

}
