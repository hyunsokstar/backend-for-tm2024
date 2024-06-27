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
import { SubjectResponse } from './interface/subject-response.interface';
import { CategoryResponse } from './interface/category-response.interface';
import { TechNotesModel } from 'src/technotes/entities/technotes.entity';
import { SkilNotesModel } from 'src/technotes/entities/skilnotes.entity';

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

    @InjectRepository(TechNotesModel)
    private techNotesModelRepo: Repository<TechNotesModel>,

    @InjectRepository(SkilNotesModel)
    private skilNotesModelRepo: Repository<SkilNotesModel>,

  ) { }

  async createCategoriesForSubject(names: string[], subjectId: number): Promise<CategoryForDevAssignment[]> {
    const subject = await this.subjectForCategoryRepo.findOne({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }
    const categories = names.map(name => this.categoryForDevAssignmentRepo.create({ name, subject }));
    return this.categoryForDevAssignmentRepo.save(categories);
  }

  async createCategoryForSubject(name: string, subjectId: number) {
    console.log("name :::::::: ", name);
    const subject = await this.subjectForCategoryRepo.findOne({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }
    const category = this.categoryForDevAssignmentRepo.create({ name, subject });
    return this.categoryForDevAssignmentRepo.save(category);
  }

  async updateSubjectName(subjectId: number, name: string): Promise<SubjectForCategory> {
    const subject = await this.subjectForCategoryRepo.findOne({ where: { id: subjectId } });

    if (!subject) {
      throw new NotFoundException(`Subject with id ${subjectId} not found`);
    }

    subject.name = name;
    return this.subjectForCategoryRepo.save(subject);
  }

  async deleteDevAssignmentSubmission(id: number): Promise<{ message: string }> {
    const submission = await this.devAssignmentSubmissionRepo.findOneBy({ id });

    if (!submission) {
      throw new NotFoundException(`DevAssignmentSubmission with ID "${id}" not found`);
    }

    // skilNoteId를 사용하여 SkilNotesModel 엔티티 삭제
    const skilNote = await this.skilNotesModelRepo.findOneBy({ id: submission.skilNoteId });
    if (skilNote) {
      await this.skilNotesModelRepo.remove(skilNote);
    }

    await this.devAssignmentSubmissionRepo.remove(submission);

    return { message: `DevAssignmentSubmission has been deleted successfully. for ${id}` };
  }


  async createDevAssignmentSubmission(devAssignmentId: number, createDevAssignmentSubmissionDto: CreateDevAssignmentSubmissionDto): Promise<DevAssignmentSubmission> {
    const { title, figmaUrl, youtubeUrl } = createDevAssignmentSubmissionDto;

    // DevAssignment 조회
    const devAssignment = await this.devAssignmentRepo.findOne({
      where: { id: devAssignmentId },
    });

    // devAssignment.techNoteId
    // devAssignment.techNoteListUrl

    const targetTechNote = await this.techNotesModelRepo.findOne({ where: { id: devAssignment.techNoteId } });

    const skilNote = this.skilNotesModelRepo.create({
      title: title,
      techNote: targetTechNote,
    });

    const savedSkilNote = await this.skilNotesModelRepo.save(skilNote);

    if (!devAssignment) {
      throw new NotFoundException(`Dev Assignment with ID ${devAssignmentId} not found`);
    }

    // DevAssignmentSubmission 생성
    const devAssignmentSubmission = this.devAssignmentSubmissionRepo.create({
      title,
      skilNoteId: savedSkilNote.id,
      noteUrl: `http://13.209.211.181:3000/Note/SkilNoteContents/${savedSkilNote.id}/1`,
      figmaUrl,
      youtubeUrl,
      devAssignment, // 이 부분이 수정된 부분입니다.
    });

    return await this.devAssignmentSubmissionRepo.save(devAssignmentSubmission);
  }

  async deleteDevAssignment(id: number): Promise<void> {
    const devAssignment = await this.devAssignmentRepo.findOne({ where: { id } });

    if (!devAssignment) {
      throw new NotFoundException(`DevAssignment with ID "${id}" not found`);
    }

    // 해당 DevAssignment에 대한 TechNotesModel 삭제
    if (devAssignment.techNoteId) {
      await this.techNotesModelRepo.delete(devAssignment.techNoteId);
    }

    // 해당 DevAssignment에 대한 제출 데이터 모두 삭제
    const devAssignmentSubmissions = await this.devAssignmentSubmissionRepo.find({
      where: { devAssignment },
    });
    await this.devAssignmentSubmissionRepo.remove(devAssignmentSubmissions);

    // DevAssignment 엔티티 삭제
    await this.devAssignmentRepo.remove(devAssignment);
  }


  async createDevAssignment(categoryId: number, createDevAssignmentDto: CreateDevAssignmentDto): Promise<DevAssignment> {
    const category = await this.categoryForDevAssignmentRepo.findOne({
      where: {
        id: categoryId
      }
    });

    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
    }

    const { title, subtitle } = createDevAssignmentDto;

    // TechNotesModel 엔티티 생성
    const techNote = this.techNotesModelRepo.create({
      title: `${title} 에 대한 테크 노트`,
      category: `${subtitle}`,
    });

    // TechNotesModel 데이터베이스에 저장
    const savedTechNote = await this.techNotesModelRepo.save(techNote);

    const newAssignment = await this.devAssignmentRepo.create({ title, subtitle, category });
    const savedDevAssignment = await this.devAssignmentRepo.save(newAssignment);

    // DevAssignment update
    savedDevAssignment.techNoteId = savedTechNote.id;
    savedDevAssignment.techNoteListUrl = `http://13.209.211.181:3000/Note/TechNoteList/${savedTechNote.id}/SkilNoteListPage`;

    // DevAssignment 저장
    await this.devAssignmentRepo.save(savedDevAssignment);

    return savedDevAssignment;
  }



  async getAllSubjects(): Promise<SubjectResponse[]> {
    const subjects = await this.subjectForCategoryRepo.find({
      relations: ['categories'],
      order: {
        id: 'ASC',
      },
    });

    return subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      countForCategories: subject.categories.length,
    }));
  }

  async deleteCategory(id: number): Promise<CategoryResponse> {
    const category = await this.categoryForDevAssignmentRepo.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // 먼저 관련된 DevAssignment를 찾아서 삭제합니다.
    const relatedAssignments = await this.devAssignmentRepo.find({ where: { category: category } });
    for (const assignment of relatedAssignments) {
      await this.devAssignmentRepo.remove(assignment);
    }

    await this.categoryForDevAssignmentRepo.remove(category);

    return { id: category.id, name: category.name };
  }

  async deleteSubject(id: number): Promise<SubjectForCategory> {
    const subject = await this.subjectForCategoryRepo.findOneBy({ id });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    await this.subjectForCategoryRepo.remove(subject);
    return subject;
  }

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


  async createDevAssignments(categoryId: number, createDevAssignmentsDto: CreateDevAssignmentDto[]): Promise<DevAssignment[]> {
    // 해당 categoryId에 대한 카테고리가 존재하는지 확인
    const category = await this.categoryForDevAssignmentRepo.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
    }

    // createDevAssignmentsDto 배열을 순회하면서 DevAssignment 생성
    const devAssignments: DevAssignment[] = [];
    for (const assignmentDto of createDevAssignmentsDto) {
      const { title, subtitle } = assignmentDto;

      // DevAssignment 생성
      const devAssignment = this.devAssignmentRepo.create({
        title,
        subtitle,
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

  // async createCategories(categoriesDto: CategoryForDevAssignmentDto[]) {
  //   const categories = categoriesDto.map(categoryDto => {
  //     const { name } = categoryDto;
  //     return this.categoryForDevAssignmentRepo.create({ name });
  //   });
  //   return this.categoryForDevAssignmentRepo.save(categories);
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
