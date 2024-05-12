import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateFavoriteDevSpecDto, UpdateFavoriteDevSpecDto } from './dto/create-favorite-dev-spec.dto';
import { FavoriteDevSpecService } from './favorite-dev-spec.service';
import { ParseIntPipe } from '@nestjs/common';


@Controller('favorite-dev-spec')
export class FavoriteDevSpecController {
  constructor(private readonly favoriteDevSpecService: FavoriteDevSpecService) { }

  @Put(':id/boiler-plate')
  async updateVoilerPlateInfo(@Param('id') id: number, @Body() updateFavoriteDevSpecDto: UpdateFavoriteDevSpecDto) {
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
    return this.favoriteDevSpecService.findAll();
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