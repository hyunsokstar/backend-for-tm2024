import { Injectable } from '@nestjs/common';
import { CreateDevSpecDto } from './dto/create-dev-spec.dto';
import { UpdateDevSpecDto } from './dto/update-dev-spec.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, DevSpec } from './entities/dev-spec.entity';
import { BestDevSkillSet } from './interface/best-dev-skill-set.interface';
import { GroupedDevSpecs } from './types/grouped-dev-specs.type';


@Injectable()
export class DevSpecService {

  constructor(
    @InjectRepository(DevSpec)
    private devSpecRepo: Repository<DevSpec>,
  ) { }

  async create(createDevSpecDto: CreateDevSpecDto) {
    const devSpec = new DevSpec();
    devSpec.spec = createDevSpecDto.spec;
    devSpec.category = createDevSpecDto.category;
    await this.devSpecRepo.save(devSpec);
    return devSpec;
  }

  async findAll(): Promise<DevSpec[]> {
    return await this.devSpecRepo.find();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} devSpec`;
  // }

  update(id: number, updateDevSpecDto: UpdateDevSpecDto) {
    return `This action updates a #${id} devSpec`;
  }

  remove(id: number) {
    return `This action removes a #${id} devSpec`;
  }

  // multiple insert function
  async createBestDevSkillSets(bestDevSkillSets: BestDevSkillSet[]) {
    const devSpecEntities = bestDevSkillSets.flatMap((skillSet) => [
      {
        spec: skillSet.language,
        category: Category.LANGUAGE,
      },
      {
        spec: skillSet.backend,
        category: Category.BACKEND,
      },
      {
        spec: skillSet.frontend,
        category: Category.FRONTEND,
      },
      {
        spec: skillSet.orm,
        category: Category.ORM,
      },
      {
        spec: skillSet.css,
        category: Category.CSS,
      },
      {
        spec: skillSet.app,
        category: Category.APP,
      },
    ]);

    const devSpecs = this.devSpecRepo.create(devSpecEntities);
    await this.devSpecRepo.save(devSpecs);

    return devSpecs;
  }

  async findAllGroupedByCategory(): Promise<GroupedDevSpecs> {
    console.log("list with category !");


    const devSpecs = await this.devSpecRepo.find();

    const groupedDevSpecs: GroupedDevSpecs = {
      language: [],
      backend: [],
      frontend: [],
      orm: [],
      css: [],
      app: []
    };

    devSpecs.forEach((devSpec) => {
      switch (devSpec.category) {
        case Category.LANGUAGE:
          groupedDevSpecs.language.push(devSpec);
          break;
        case Category.BACKEND:
          groupedDevSpecs.backend.push(devSpec);
          break;
        case Category.FRONTEND:
          groupedDevSpecs.frontend.push(devSpec);
          break;
        case Category.ORM:
          groupedDevSpecs.orm.push(devSpec);
          break;
        case Category.CSS:
          groupedDevSpecs.css.push(devSpec);
          break;
        case Category.APP:
          groupedDevSpecs.app.push(devSpec);
          break;
      }
    });

    return groupedDevSpecs;
  }

}
