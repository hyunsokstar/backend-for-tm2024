import { Injectable } from '@nestjs/common';
import { CreateDevSpecDto } from './dto/create-dev-spec.dto';
import { UpdateDevSpecDto } from './dto/update-dev-spec.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Category, DevSpec } from './entities/dev-spec.entity';
import { BestDevSkillSet } from './interface/best-dev-skill-set.interface';
import { GroupedDevSpecs } from './types/grouped-dev-specs.type';
import { FavoriteDevSpec } from './entities/favorite-dev-spec.entity';
import { CreateFavoriteDevSpecDto } from './dto/create-favorite-dev-spec.dto';


@Injectable()
export class FavoriteDevSpecService {

  constructor(
    @InjectRepository(FavoriteDevSpec)
    private favoriteDevSpecRepo: Repository<FavoriteDevSpec>,
  ) { }

  async create(createFavoriteDevSpecDto: CreateFavoriteDevSpecDto): Promise<FavoriteDevSpec> {
    const favoriteDevSpec = new FavoriteDevSpec();
    favoriteDevSpec.language = createFavoriteDevSpecDto.language;
    favoriteDevSpec.backend = createFavoriteDevSpecDto.backend;
    favoriteDevSpec.frontend = createFavoriteDevSpecDto.frontend;
    favoriteDevSpec.orm = createFavoriteDevSpecDto.orm;
    favoriteDevSpec.css = createFavoriteDevSpecDto.css;

    return await this.favoriteDevSpecRepo.save(favoriteDevSpec);
  }

  async findAll(): Promise<FavoriteDevSpec[]> {
    console.log("find All Dev Spec List");

    return await this.favoriteDevSpecRepo.find();
  }

  // update(id: number, updateDevSpecDto: UpdateDevSpecDto) {
  //   return `This action updates a #${id} devSpec`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} devSpec`;
  // }


}
