import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Category, DevSpec } from './entities/dev-spec.entity';
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
    favoriteDevSpec.app = createFavoriteDevSpecDto.app;

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

  async updateFavoriteDevSpec(id: number, updateFavoriteDevSpecDto: any): Promise<FavoriteDevSpec> {
    const favoriteDevSpec = await this.favoriteDevSpecRepo.findOne({ where: { id: id } });
    if (!favoriteDevSpec) {
      throw new Error('FavoriteDevSpec not found');
    }

    this.favoriteDevSpecRepo.merge(favoriteDevSpec, updateFavoriteDevSpecDto);
    return this.favoriteDevSpecRepo.save(favoriteDevSpec);
  }

}
