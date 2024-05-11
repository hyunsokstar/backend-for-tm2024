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

  async like(id: number) {
    const devSpec = await this.favoriteDevSpecRepo.findOne({ where: { id: id } });
    devSpec.likeCount++;
    await this.favoriteDevSpecRepo.save(devSpec);
    return devSpec;
  }

  async dislike(id: number) {
    const devSpec = await this.favoriteDevSpecRepo.findOne({ where: { id: id } });
    devSpec.dislikeCount++;
    await this.favoriteDevSpecRepo.save(devSpec);
    return devSpec;
  }

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

    return await this.favoriteDevSpecRepo.find({
      order: {
        likeCount: "DESC" // likeCount를 오름차순으로 정렬
      }
    });
  }

  // update(id: number, updateDevSpecDto: UpdateDevSpecDto) {
  //   return `This action updates a #${id} devSpec`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} devSpec`;
  // }


}
