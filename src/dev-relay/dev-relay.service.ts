import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDevRelayDto } from './dto/create-dev-relay.dto';
import { UpdateDevRelayDto } from './dto/update-dev-relay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DevRelay } from './entities/dev-relay.entity';
import { Repository } from 'typeorm';
import { DevAssignment } from './entities/dev-assignment.entity';
import { CreateDevAssignmentDto } from './dto/create-dev-assignment.dto';
import { DevAssignmentSubmission } from './entities/dev-assignment-submission.entity';
import { CreateDevAssignmentSubmissionDto } from './dto/create-dev-assignment-submission.dto';
import { CategoryForDevAssignment } from './entities/category-for-dev-assignment.entity';
import { CategoryForDevAssignmentDto } from './dto/category-for-dev-assignment.dto';
import { SubjectForCategory } from './entities/subject-for-category.entity';
import { CreateSubjectDto } from './dto/subject-for-category.dto';
import { UpdateSubjectForCategoryDto } from './dto/update-subject-for-category.dto';

@Injectable()
export class DevRelayService {

  constructor(
    @InjectRepository(DevRelay)
    private devRelayRepo: Repository<DevRelay>,
    @InjectRepository(CategoryForDevAssignment)
    private categoryForDevAssignmentRepo: Repository<CategoryForDevAssignment>,
    @InjectRepository(DevAssignment)
    private devAssignmentRepo: Repository<DevAssignment>,

    @InjectRepository(DevAssignmentSubmission)
    private devAssignmentSubmissionRepo: Repository<DevAssignmentSubmission>,

    @InjectRepository(SubjectForCategory)
    private subjectForCategoryRepo: Repository<SubjectForCategory>,

  ) { }

  async getAllCategoriesBySubject(subjectId: number): Promise<CategoryForDevAssignment[]> {
    const categories = await this.categoryForDevAssignmentRepo
      .createQueryBuilder("category")
      .select("category.id", "id")
      .addSelect("category.name", "name")
      .addSelect("COUNT(devAssignment.id)", "dev_assignments_count")
      .leftJoin("category.devAssignments", "devAssignment")
      .where("category.subjectId = :subjectId", { subjectId })
      .groupBy("category.id")
      .orderBy("category.id", "ASC") // ID 순으로 정렬 (오름차순)
      .getRawMany();

    return categories;
  }

  // src/dev-relay/dev-relay.service.ts
  async getAllCategories(): Promise<CategoryForDevAssignment[]> {
    const categories = await this.categoryForDevAssignmentRepo
      .createQueryBuilder("category")
      .select("category.id", "id")
      .addSelect("category.name", "name")
      .addSelect("COUNT(devAssignment.id)", "dev_assignments_count")
      .leftJoin("category.devAssignments", "devAssignment")
      .groupBy("category.id")
      .orderBy("category.id", "ASC") // ID 순으로 정렬 (오름차순)
      .getRawMany();

    return categories;
  }

  async updateSubjectForCategory(id: number): Promise<number> {
    const newSubject = await this.subjectForCategoryRepo.findOneBy({ id });

    if (!newSubject) {
      throw new NotFoundException(`SubjectForCategory with ID ${id} not found`);
    }

    const categories = await this.categoryForDevAssignmentRepo.find();

    // 각 카테고리의 subject를 업데이트합니다.
    for (const category of categories) {
      category.subject = newSubject;
      await this.categoryForDevAssignmentRepo.save(category);
    }

    return categories.length;
  }


  async createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectForCategory> {
    const subject = new SubjectForCategory();
    subject.name = createSubjectDto.name;

    // Subject 저장
    const savedSubject = await this.subjectForCategoryRepo.save(subject);

    // 만약 카테고리 생성 로직을 따로 분리하고 싶다면, 여기서 카테고리 생성 함수를 호출할 수 있습니다.

    return savedSubject;
  }


  async getAllSubjects(): Promise<SubjectForCategory[]> {
    return this.subjectForCategoryRepo.find();
  }


  async updateCategoryForDevAssginment(id: number, updateCategoryDto: CategoryForDevAssignmentDto): Promise<CategoryForDevAssignmentDto> {
    const category = await this.categoryForDevAssignmentRepo.findOne({ where: { id: id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // 이름 필드만 업데이트
    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }

    return this.categoryForDevAssignmentRepo.save(category);
  }

  async findDevAssignmentsByCategory(categoryId: number): Promise<DevAssignment[]> {
    // 특정 카테고리 ID에 해당하는 DevAssignment 리스트를 조회합니다.
    return this.devAssignmentRepo
      .createQueryBuilder('devAssignment')
      .leftJoinAndSelect('devAssignment.category', 'category')
      .leftJoinAndSelect('devAssignment.submissions', 'submission') // DevAssignment과 DevAssignmentSubmission의 관계를 설정합니다.
      .where('category.id = :categoryId', { categoryId })
      .getMany();
  }


  async findAllDevAssignments(): Promise<DevAssignment[]> {
    return this.devAssignmentRepo.find({
      relations: ['category']
    });
  }

  async createDevAssignment(categoryId: number, createDevAssignmentDto: CreateDevAssignmentDto): Promise<DevAssignment> {
    // 해당 categoryId에 대한 카테고리가 존재하는지 확인
    const category = await this.categoryForDevAssignmentRepo.findOne({
      where: {
        id: categoryId
      }
    });

    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
    }

    // DevAssignment 생성
    const { day, title } = createDevAssignmentDto;
    const newAssignment = this.devAssignmentRepo.create({ day, title, category });
    return this.devAssignmentRepo.save(newAssignment);
  }


  async createDevAssignments(categoryId: number, createDevAssignmentsDto: CreateDevAssignmentDto[]): Promise<DevAssignment[]> {
    // 해당 categoryId에 대한 카테고리가 존재하는지 확인
    const category = await this.categoryForDevAssignmentRepo.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
    }

    // createDevAssignmentsDto 배열을 순회하면서 DevAssignment 생성
    const devAssignments: DevAssignment[] = [];
    for (const assignmentDto of createDevAssignmentsDto) {
      const { title, day } = assignmentDto;

      // DevAssignment 생성
      const devAssignment = this.devAssignmentRepo.create({
        title,
        day,
        category: category,
      });

      // 생성된 DevAssignment을 저장
      const savedDevAssignment = await this.devAssignmentRepo.save(devAssignment);

      // 생성된 DevAssignment을 결과 배열에 추가
      devAssignments.push(savedDevAssignment);
    }

    // 생성된 DevAssignment들을 반환
    return devAssignments;
  }

  async createCategories(categoriesDto: CategoryForDevAssignmentDto[]) {
    const categories = categoriesDto.map(categoryDto => {
      const { name } = categoryDto;
      return this.categoryForDevAssignmentRepo.create({ name });
    });
    return this.categoryForDevAssignmentRepo.save(categories);
  }

  async createCategory(categoryDto: CategoryForDevAssignmentDto) {
    const { name } = categoryDto;
    const category = this.categoryForDevAssignmentRepo.create({ name });
    return this.categoryForDevAssignmentRepo.save(category);
  }

  async createDevAssignmentSubmission(devAssignmentId: number, createDevAssignmentSubmissionDto: CreateDevAssignmentSubmissionDto): Promise<DevAssignmentSubmission> {
    const { title, noteUrl, figmaUrl, youtubeUrl } = createDevAssignmentSubmissionDto;

    // DevAssignment 조회
    const devAssignment = await this.devAssignmentRepo.findOne({
      where: { id: devAssignmentId },
    });

    if (!devAssignment) {
      throw new NotFoundException(`Dev Assignment with ID ${devAssignmentId} not found`);
    }

    // DevAssignmentSubmission 생성
    const devAssignmentSubmission = this.devAssignmentSubmissionRepo.create({
      title,
      noteUrl,
      figmaUrl,
      youtubeUrl,
      devAssignment, // 이 부분이 수정된 부분입니다.
    });

    return await this.devAssignmentSubmissionRepo.save(devAssignmentSubmission);
  }

  // async createDevAssignments(createDevAssignmentsDto: CreateDevAssignmentDto[]): Promise<DevAssignment[]> {
  //   const createdAssignments: DevAssignment[] = [];
  //   for (const assignmentDto of createDevAssignmentsDto) {
  //     const createdAssignment = await this.createDevAssignment(assignmentDto);
  //     createdAssignments.push(createdAssignment);
  //   }
  //   return createdAssignments;
  // }

  // async createDevAssignment(createDevAssignmentDto: CreateDevAssignmentDto): Promise<DevAssignment> {
  //   const { day, title } = createDevAssignmentDto;
  //   const newAssignment = this.devAssignmentRepo.create({ day, title });
  //   return this.devAssignmentRepo.save(newAssignment);
  // }

  async findAllDevRelays(): Promise<DevRelay[]> {
    return await this.devRelayRepo.find();
  }

  // dev relay data 하나 추가
  async create(createDevRelayDto: CreateDevRelayDto): Promise<DevRelay> {
    const devRelay = this.devRelayRepo.create(createDevRelayDto);
    return await this.devRelayRepo.save(devRelay);
  }

  findOne(id: number) {
    return `This action returns a #${id} devRelay`;
  }

  update(id: number, updateDevRelayDto: UpdateDevRelayDto) {
    return `This action updates a #${id} devRelay`;
  }

  remove(id: number) {
    return `This action removes a #${id} devRelay`;
  }
}
