import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Category, DevSpec } from './entities/dev-spec.entity';
import { FavoriteDevSpec } from './entities/favorite-dev-spec.entity';
import { CreateFavoriteDevSpecDto } from './dto/create-favorite-dev-spec.dto';
import { LibraryForFavoriteDevSpec } from './entities/library-for-favorite-dev-spec';
import { CreateLibraryForFavoriteDevSpecDto } from './dto/library-for-favorite-dev-spec-dto';


@Injectable()
export class FavoriteDevSpecService {

  constructor(
    @InjectRepository(FavoriteDevSpec)
    private favoriteDevSpecRepo: Repository<FavoriteDevSpec>,
    @InjectRepository(LibraryForFavoriteDevSpec)
    private libraryForFavoriteDevSpecRepo: Repository<LibraryForFavoriteDevSpec>,
  ) { }


  // async addLibraryToFavoriteDevSpec(favoriteDevSpecId: number, createLibraryDto: CreateLibraryForFavoriteDevSpecDto): Promise<FavoriteDevSpec> {
  //   const favoriteDevSpec = await this.favoriteDevSpecRepo.findOneOrFail({ where: { id: favoriteDevSpecId }, relations: ['libraries'] });

  //   const newLibrary = new LibraryForFavoriteDevSpec();
  //   newLibrary.library = createLibraryDto.library;
  //   newLibrary.siteUrl = createLibraryDto.siteUrl;
  //   newLibrary.favoriteDevSpec = favoriteDevSpec; // Set the relationship

  //   await this.libraryForFavoriteDevSpecRepo.save(newLibrary);
  //   favoriteDevSpec.libraries.push(newLibrary);

  //   return favoriteDevSpec;
  // }

  async addLibraryToFavoriteDevSpec(favoriteDevSpecId: number, createLibraryDto: CreateLibraryForFavoriteDevSpecDto): Promise<LibraryForFavoriteDevSpec> {
    const favoriteDevSpec = await this.favoriteDevSpecRepo.findOneOrFail({ where: { id: favoriteDevSpecId } });

    const newLibrary = new LibraryForFavoriteDevSpec();
    newLibrary.library = createLibraryDto.library;
    newLibrary.siteUrl = createLibraryDto.siteUrl;
    newLibrary.favoriteDevSpec = favoriteDevSpec; // LibraryForFavoriteDevSpec 쪽에만 관계 설정

    return this.libraryForFavoriteDevSpecRepo.save(newLibrary);
  }

  async updateCompany(id: number, company: string) {
    const favoriteDevSpec = await this.favoriteDevSpecRepo.findOneBy({ id });
    if (!favoriteDevSpec) {
      throw new Error(`FavoriteDevSpec with ID ${id} not found`);
    }
    favoriteDevSpec.company = company;
    await this.favoriteDevSpecRepo.save(favoriteDevSpec);
  }

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
