import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateFavoriteDevSpecDto, UpdateFavoriteDevSpecBoilerPlateInfoDto } from './dto/create-favorite-dev-spec.dto';
import { FavoriteDevSpecService } from './favorite-dev-spec.service';
import { ParseIntPipe } from '@nestjs/common';
import { CreateLibraryForFavoriteDevSpecDto } from './dto/library-for-favorite-dev-spec-dto';
import { FavoriteDevSpec } from './entities/favorite-dev-spec.entity';
import { LibraryForFavoriteDevSpec } from './entities/library-for-favorite-dev-spec';



@Controller('favorite-dev-spec')
export class FavoriteDevSpecController {
  constructor(private readonly favoriteDevSpecService: FavoriteDevSpecService) { }

  // @Post(':id/libraries')
  // async addLibraryToFavoriteDevSpec(
  //   @Param('id', ParseIntPipe) favoriteDevSpecId: number,
  //   @Body() createLibraryDto: CreateLibraryForFavoriteDevSpecDto,
  // ): Promise<FavoriteDevSpec> {
  //   return await this.favoriteDevSpecService.addLibraryToFavoriteDevSpec(favoriteDevSpecId, createLibraryDto);
  // }

  @Post(':id/libraries')
  async addLibraryToFavoriteDevSpec(
    @Param('id', ParseIntPipe) favoriteDevSpecId: number,
    @Body() createLibraryDto: CreateLibraryForFavoriteDevSpecDto,
  ): Promise<LibraryForFavoriteDevSpec> {
    return await this.favoriteDevSpecService.addLibraryToFavoriteDevSpec(favoriteDevSpecId, createLibraryDto);
  }

  @Put(':id/company')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body('company') company: string,
  ) {
    await this.favoriteDevSpecService.updateCompany(id, company);
  }

  @Put(':id/boiler-plate')
  async updateVoilerPlateInfo(@Param('id') id: number, @Body() updateFavoriteDevSpecDto: UpdateFavoriteDevSpecBoilerPlateInfoDto) {
    console.log("update boiler plate info check");
    // return "hello world"
    return this.favoriteDevSpecService.updateFavoriteDevSpec(id, updateFavoriteDevSpecDto);
  }

  @Post()
  create(@Body() createFavoriteDevSpecDto: CreateFavoriteDevSpecDto) {
    return this.favoriteDevSpecService.create(createFavoriteDevSpecDto);
  }

  @Get()
  findAll() {
    return this.favoriteDevSpecService.findAllWithLibraries();
  }

  @Patch(':id/like')
  like(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteDevSpecService.like(id);
  }

  @Patch(':id/dislike')
  dislike(@Param('id', ParseIntPipe) id: number) {
    return this.favoriteDevSpecService.dislike(id);
  }

}
