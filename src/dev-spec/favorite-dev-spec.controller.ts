import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateFavoriteDevSpecDto } from './dto/create-favorite-dev-spec.dto';
import { FavoriteDevSpecService } from './favorite-dev-spec.service';


@Controller('favorite-dev-spec')
export class FavoriteDevSpecController {
  constructor(private readonly favoriteDevSpecService: FavoriteDevSpecService) { }

  @Post()
  create(@Body() createFavoriteDevSpecDto: CreateFavoriteDevSpecDto) {
    return this.favoriteDevSpecService.create(createFavoriteDevSpecDto);
  }

  @Get()
  findAll() {
    return this.favoriteDevSpecService.findAll();
  }

}
