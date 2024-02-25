import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStarterProjectDto } from './dto/create-starter-project.dto';
import { UpdateStarterProjectDto } from './dto/update-starter-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StarterKitsModel } from './entities/starter-project.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { DtoTypeStarterKitList, ResponseTypeForStarterKitList } from './type/typeForStarterKit';

@Injectable()
export class StarterProjectsService {

  constructor(
    @InjectRepository(StarterKitsModel)
    private starterKitRepo: Repository<StarterKitsModel>,
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,

  ) {

  }

  async create(createStarterProjectDto: CreateStarterProjectDto): Promise<StarterKitsModel> {
    const { title, description, skilNoteUrl, writerId } = createStarterProjectDto;

    // Writer를 찾습니다.
    const writer = await this.usersRepository.findOne({ where: { id: writerId } });
    if (!writer) {
      throw new NotFoundException(`User with ID ${writerId} not found.`);
    }

    // 새로운 스타터 프로젝트를 생성하고 저장합니다.
    const newStarterProject = this.starterKitRepo.create({
      title,
      description,
      skilNoteUrl,
      writer,
    });

    return await this.starterKitRepo.save(newStarterProject);
  }

  async findAllStarterKitsWithPagination(
    { perPage, pageNum }: DtoTypeStarterKitList): Promise<ResponseTypeForStarterKitList> {

    console.log("typeof", typeof perPage, typeof pageNum);

    // return await this.starterKitRepo.find();

    let query = this.starterKitRepo.createQueryBuilder('starterKit')
      .skip((pageNum - 1) * perPage)
      .take(perPage)
      .orderBy('starterKit.id', 'DESC');


    const [starterKitList, totalCount] = await query
      .getManyAndCount();

    return {
      perPage: perPage,
      totalCount: totalCount,
      starterKitList: starterKitList,
    };

  }

  async findOne(id: number): Promise<StarterKitsModel> {
    const starterProject = await this.starterKitRepo.findOne({ where: { id: id } });
    if (!starterProject) {
      throw new NotFoundException(`Starter project with ID ${id} not found.`);
    }
    return starterProject;
  }

  update(id: number, updateStarterProjectDto: UpdateStarterProjectDto) {
    return `This action updates a #${id} starterProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} starterProject`;
  }
}
