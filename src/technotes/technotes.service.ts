import { ParticipantsForTechNoteModel } from './entities/participantsForTechNote.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TechNotesModel } from './entities/technotes.entity';
import { DtoForCreateTechNote } from './dtos/dtoForCreateTechNote.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from './entities/skilnotes.entity';
import { LikesModelForTechNote } from './entities/likesForTechNote.entity';
import { bookMarksForTechNoteModel } from './entities/bookMarks.entity';
import { LikesModelForSkilNote } from './entities/likesForSkilNote.entity';
import { BookMarksForSkilNoteModel } from './entities/bookMarksForSkilNote.entity';
import { RoadMapModel } from './entities/roadMap.entity';
import { ParticipantsForSkilNoteModel } from './entities/participantsForSkilNote.entity';

@Injectable()
export class TechnotesService {

    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>,

        @InjectRepository(RoadMapModel)
        private roadMapsRepo: Repository<RoadMapModel>,

        @InjectRepository(SkilNotesModel)
        private skilNotesRepo: Repository<SkilNotesModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,

        @InjectRepository(LikesModelForTechNote)
        private readonly likesForTechNoteRepo: Repository<LikesModelForTechNote>,
        @InjectRepository(LikesModelForSkilNote)
        private readonly likesForSkilNoteRepo: Repository<LikesModelForSkilNote>,

        @InjectRepository(bookMarksForTechNoteModel)
        private readonly bookMarksForTechNoteRepo: Repository<bookMarksForTechNoteModel>,

        @InjectRepository(BookMarksForSkilNoteModel)
        private readonly bookMarksForSkilNoteRepo: Repository<BookMarksForSkilNoteModel>,

        @InjectRepository(ParticipantsForTechNoteModel)
        private readonly participantsForTechNoteRepo: Repository<ParticipantsForTechNoteModel>,
        @InjectRepository(ParticipantsForSkilNoteModel)
        private readonly participantsForSkilNoteRepo: Repository<ParticipantsForSkilNoteModel>,

    ) { }

    async getTechNotesByRoadMapId(
        roadMapId: number,
        pageNum: number = 1,
        perPage: number = 10,
        searchOption: string,
        searchText: string,
        isBestByLikes,
        isBestByBookMarks
    ): Promise<{
        techNoteList: TechNotesModel[];
        totalCount: number;
        perPage: number;
    }> {
        const roadMap = await this.roadMapsRepo.findOne({
            where: { id: roadMapId },
            relations: [
                'techNotes',
                'techNotes.writer',
                'techNotes.skilnotes',
                'techNotes.participants',
                'techNotes.participants.user',
                'techNotes.likes',
                'techNotes.likes.user',
                'techNotes.bookMarks',
                'techNotes.bookMarks.user',
            ],
        });

        if (!roadMap) {
            throw new HttpException('RoadMap not found', HttpStatus.NOT_FOUND);
        }

        let query = this.techNotesRepo
            .createQueryBuilder('techNotes')
            .where('techNotes.roadMapId = :roadMapId', { roadMapId })
            .skip((pageNum - 1) * perPage)
            .take(perPage)
            .orderBy('techNotes.id', 'DESC');

        // 검색 옵션에 따라 where 조건 추가
        if (searchOption && searchText) {
            if (searchOption === 'email') {
                query = query.where('writer.email LIKE :searchText', {
                    searchText: `%${searchText}%`,
                });
            } else {
                query = query
                    .where(`techNotes.${searchOption} LIKE :searchText`, {
                        searchText: `%${searchText}%`,
                    })
                    .andWhere('techNotes.roadMapId = :roadMapId', { roadMapId });
            }
        }

        const [techNoteList, totalCount] = await query
            .leftJoinAndSelect('techNotes.writer', 'writer')
            .leftJoinAndSelect('techNotes.skilnotes', 'skilnotes')
            .leftJoinAndSelect('techNotes.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('techNotes.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .leftJoinAndSelect('techNotes.bookMarks', 'bookMarks')
            .leftJoinAndSelect('bookMarks.user', 'bookMarksUser')
            .getManyAndCount();

        const techNoteListWithCounts = techNoteList.map((techNote) => {
            techNote.countForLikes = techNote.likes.length;
            techNote.countForBookMarks = techNote.bookMarks.length;
            techNote.countForSkilNotes = techNote.skilnotes.length;
            return techNote;
        });

        if (isBestByLikes == 'true') {
            techNoteListWithCounts.sort((a, b) => b.countForLikes - a.countForLikes);
        }

        if (isBestByBookMarks == 'true') {
            techNoteListWithCounts.sort((a, b) => b.countForBookMarks - a.countForBookMarks);
        }

        return {
            techNoteList: techNoteListWithCounts,
            totalCount,
            perPage,
        };
    }

    async getAllTechNotes(
        pageNum: number = 1,
        perPage: number = 10,
        searchOption: string,
        searchText: string,
        isBestByLikes,
        isBestByBookMarks
    ): Promise<{
        techNoteList: TechNotesModel[];
        totalCount: number;
        perPage: number;
    }> {

        console.log("pageNum : ", pageNum);
        console.log("perPage : ", perPage);
        console.log("searchOption : ", searchOption);
        console.log("searchText : ", searchText);

        let query = this.techNotesRepo.createQueryBuilder('techNotes')
            .skip((pageNum - 1) * perPage)
            .take(perPage)
            .orderBy('techNotes.id', 'DESC');

        // 검색 옵션에 따라 where 조건 추가
        if (searchOption && searchText) {
            if (searchOption === "email") {
                query = query
                    .where('writer.email LIKE :searchText', { searchText: `%${searchText}%` });
            } else {
                query = query.where(`techNotes.${searchOption} LIKE :searchText`, { searchText: `%${searchText}%` });

            }
        }

        const [techNoteList, totalCount] = await query
            .leftJoinAndSelect('techNotes.writer', 'writer')
            .leftJoinAndSelect('techNotes.skilnotes', 'skilnotes')
            .leftJoinAndSelect('techNotes.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('techNotes.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .leftJoinAndSelect('techNotes.bookMarks', 'bookMarks')
            .leftJoinAndSelect('bookMarks.user', 'bookMarksUser')
            .getManyAndCount();

        const techNoteListWithCounts = techNoteList.map(techNote => {
            techNote.countForLikes = techNote.likes.length; // 수정 필요
            techNote.countForBookMarks = techNote.bookMarks.length; // 수정 필요
            techNote.countForSkilNotes = techNote.skilnotes.length; // 수정 필요
            return techNote;
        });

        // console.log("techNoteList ?? ", techNoteList);

        if (isBestByLikes == "true") {
            console.log("excute check 11111");
            techNoteListWithCounts.sort((a, b) => b.countForLikes - a.countForLikes);
        }

        if (isBestByBookMarks == "true") {
            techNoteListWithCounts.sort((a, b) => b.countForBookMarks - a.countForBookMarks);
        }

        console.log("isBestByLikes at skilnote: ", isBestByLikes);
        console.log("isBestByBookMarks : at skilnote", isBestByBookMarks);

        return {
            techNoteList: techNoteListWithCounts,
            totalCount,
            perPage
        };
    }

    async toggleLikeForTechNote(userId: number, techNoteId: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const techNote = await this.techNotesRepo.findOne({ where: { id: techNoteId } });

        if (!user || !techNote) {
            return false; // 사용자 또는 기술 노트가 없을 경우 실패
        }

        // 이미 좋아요를 했는지 확인
        const existingLike = await this.likesForTechNoteRepo.findOne({ where: { user: { id: user.id }, techNote: { id: techNote.id } } });

        if (existingLike) {
            // 이미 좋아요를 했을 경우 좋아요 취소
            await this.likesForTechNoteRepo.remove(existingLike);
            return false;
        }

        // 좋아요 추가
        const newLike = this.likesForTechNoteRepo.create({ user, techNote });
        await this.likesForTechNoteRepo.save(newLike);

        return true;
    }

    async toggleLikeForSkilNote(userId: number, skilNoteId: number): Promise<boolean> {

        console.log("skilnote id !!!1!!?? : ", skilNoteId);

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const skilNote = await this.skilNotesRepo.findOne({ where: { id: skilNoteId } });

        if (!user || !skilNote) {
            return false; // 사용자 또는 기술 노트가 없을 경우 실패
        }

        // 이미 좋아요를 했는지 확인
        const existingLike = await this.likesForSkilNoteRepo.findOne({ where: { user, skilNote } });

        if (existingLike) {
            // 이미 좋아요를 했을 경우 좋아요 취소
            await this.likesForSkilNoteRepo.remove(existingLike);
            return false;
        }

        // 좋아요 추가
        const newLike = this.likesForSkilNoteRepo.create({ user, skilNote });
        await this.likesForSkilNoteRepo.save(newLike);

        return true;
    }

    async toggleBookMarkForTechNote(userId: number, skilNoteId: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const techNote = await this.techNotesRepo.findOne({ where: { id: skilNoteId } });

        if (!user || !techNote) {
            return false; // 사용자 또는 기술 노트가 없을 경우 실패
        }

        // 이미 좋아요를 했는지 확인
        const existingBookMark = await this.bookMarksForTechNoteRepo.findOne({ where: { user, techNote } });

        if (existingBookMark) {
            // 이미 좋아요를 했을 경우 좋아요 취소
            await this.bookMarksForTechNoteRepo.remove(existingBookMark);
            return false;
        }

        // 좋아요 추가
        const newLike = this.bookMarksForTechNoteRepo.create({ user, techNote });
        await this.bookMarksForTechNoteRepo.save(newLike);

        return true;
    }

    async toggleBookMarkForSkilNote(userId: number, skilNoteId: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const skilNote = await this.skilNotesRepo.findOne({ where: { id: skilNoteId } });

        if (!user || !skilNote) {
            return false;
        }

        const existingBookMark = await this.bookMarksForSkilNoteRepo.findOne({ where: { user, skilNote } });

        if (existingBookMark) {
            await this.bookMarksForSkilNoteRepo.remove(existingBookMark);
            return false;
        }

        const newLike = this.bookMarksForSkilNoteRepo.create({ user, skilNote });
        await this.bookMarksForSkilNoteRepo.save(newLike);

        return true;
    }

    async searchTechNoteBySearchOptionAndSearchWorld(searchOption: string, searchText: string) {
        console.log(`searchOption at service: ${searchOption}`);
        console.log(`searchText at service: ${searchText}`);

        const searchColumns = ['email', 'title', 'category'];
        if (!searchColumns.includes(searchOption)) {
            console.log(`Invalid search option: ${searchOption}`);
            return;
        }

        const query = this.techNotesRepo.createQueryBuilder('techNotes')
            .where(`techNotes.${searchOption} LIKE :searchText`, { searchText: `%${searchText}%` })
            .getMany();

        return query;
    }

    async deleteForCheckNoteIdsForCheckedIds(checkedIds: number[], loginUser): Promise<string | { success: boolean, message: string }> {
        try {
            // console.log("checkedIds : ", checkedIds);
            // console.log("loginUser : ", loginUser);

            // todo
            // this.techNotesRepo 에서 checkedIds를 삭제 하되 각 note 의 writer 가 loginUser와 다를 경우 삭제 권한 없습니다 응답 하기 
            // success: false, message:loginUser와 다를 경우 삭제 권한 없습니다
            const notesToDelete = await this.techNotesRepo.find({
                where: { id: In(checkedIds) },
                relations: ['writer'], // writer 관계를 가져옵니다.
            });

            // console.log("notesToDelete ?? : ", notesToDelete);


            const filteredNotesToDelete = notesToDelete.filter(todo => todo.writer.email !== loginUser.email);
            console.log("filteredTodosToDelete.length : ", filteredNotesToDelete.length);

            if (filteredNotesToDelete.length > 0) {
                return {
                    success: false,
                    message: `삭제할 권한이 없습니다.`
                };
            }

            const deleteResult = await this.techNotesRepo.delete(checkedIds);
            console.log("result for delete techNoteRowsForCheckedIds: ", deleteResult);

            const deletedCount = deleteResult.affected ?? 0;
            return { success: true, message: `총 ${deletedCount}명의 note가 삭제되었습니다.` }

        } catch (error) {
            console.log("error : ", error);

            throw new Error('삭제 중 오류가 발생했습니다.');
        }
    }

    async createTechNote(dto: DtoForCreateTechNote) {
        const { title, description, category, writerId } = dto;
        const writer = await this.usersRepository.findOne({ where: { id: writerId } });

        const techNote = new TechNotesModel();
        techNote.title = title;
        techNote.description = description;
        techNote.category = category;

        // Assume 'writerId' corresponds to an existing user ID in the 'UsersModel'
        // Find the user by ID
        if (!writer) {
            throw new Error('Writer not found'); // 작가를 찾을 수 없는 경우 예외 처리
        }

        techNote.writer = writer; // Assign the writer object to the tech note

        return this.techNotesRepo.save(techNote);
    }

    async createTechNoteForRoadMap(dto: DtoForCreateTechNote) {
        const { title, description, category, writerId, roadMapId } = dto;
        const writer = await this.usersRepository.findOne({ where: { id: writerId } });
        const roadmapObj = await this.roadMapsRepo.findOne({ where: { id: roadMapId } });

        const techNote = new TechNotesModel();
        techNote.title = title;
        techNote.description = description;
        techNote.category = category;

        if (!writer) {
            throw new Error('Writer not found'); // 작가를 찾을 수 없는 경우 예외 처리
        }

        techNote.writer = writer; // Assign the writer object to the tech note
        techNote.roadMap = roadmapObj;

        return this.techNotesRepo.save(techNote);
    }

    async getAllSkilNotes(
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<{
        skilNoteList: SkilNotesModel[],
        totalCount: number,
        perPage: number,
    }> {

        const [skilNoteList, totalCount] = await this.skilNotesRepo.findAndCount({
            skip: (pageNum - 1) * perPage,
            take: perPage,
            relations: ['writer'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
            order: {
                id: 'DESC'
            }
        });

        return {
            skilNoteList,
            totalCount,
            perPage
        }
    }

    async saveTechNotes(techNotesToSave: any[], loginUser: UsersModel, roadMapId?: any): Promise<any> {
        let count = 0;

        let roadMapObj;

        if (roadMapId) {
            roadMapObj = await this.roadMapsRepo.findOne({ where: { id: roadMapId } })
        }

        for (const note of techNotesToSave) {
            const { id, title, description, category, email, ...data } = note;

            const writerObj = await this.usersRepository.findOne({
                where: {
                    email: email
                }
            });

            if (id) {
                console.log("id : ", id);
                const existingNote = await this.techNotesRepo.findOne({ where: { id: id } }); // 변경된 부분

                if (existingNote) {
                    count++;
                    console.log("update here");
                    await this.techNotesRepo.update(id, {
                        title: title,
                        description: description,
                        category: category,
                        updatedAt: new Date(),
                        writer: writerObj
                    });
                } else {
                    console.log("save here");
                    count++;

                    if (!loginUser) {
                        return { status: "error", message: `login is required to add tech note` }
                    }

                    if (roadMapObj !== null) {
                        console.log("로드맵 저장 실행 된것을 확인? ", roadMapObj);

                        await this.techNotesRepo.save({
                            title: title,
                            description: description,
                            category: category,
                            createdAt: new Date(),
                            writer: loginUser,
                            roadMap: roadMapObj
                        });
                    } else {
                        await this.techNotesRepo.save({
                            title: title,
                            description: description,
                            category: category,
                            createdAt: new Date(),
                            writer: loginUser,
                            // roadmap: roadMapObj
                        });
                    }

                }

            }
        }
        return { message: `Todos updated successfully ${count}` };
    }

    async addParticipantsForTechNote(skilNoteId: number, userId: number) {
        const techNoteObj = await this.techNotesRepo.findOne({ where: { id: skilNoteId } });
        if (!techNoteObj) {
            throw new Error('SkilNote not found');
        }

        // userId로 userObj 찾기
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        try {
            // 이미 해당 유저에 대한 ParticipantsForRoadMapModel 데이터가 있는지 확인
            const existingParticipant = await this.participantsForTechNoteRepo.findOne({ where: { user: user } });

            if (existingParticipant) {
                // 이미 해당 유저에 대한 데이터가 있으면 삭제
                await this.participantsForTechNoteRepo.remove(existingParticipant);
                return {
                    message: `Cancle Particlpate for TechNote : ${techNoteObj.title}`
                };
            } else {
                // ParticipantsForRoadMapModel에 데이터 추가
                const participant = new ParticipantsForTechNoteModel();
                participant.techNote = techNoteObj;
                participant.user = user;
                // 추가적으로 필요한 데이터가 있다면 여기에 추가

                // ParticipantsForRoadMapModel 저장
                await this.participantsForTechNoteRepo.save(participant);

                // 성공적으로 추가되었음을 반환
                return {
                    message: `Success Participate for TechNote : ${techNoteObj.title}`
                };
            }
        } catch (error) {
            // 오류 발생 시 예외 처리
            throw new Error(`Failed to add participant to TechNote: ${error.message}`);
        }
    }

    async getAllCorriculmnsForUserCorricumnsForSkilNotes(techNoteId: number, userId: { techNoteId: number, userId: number }) {
        console.log("techNoteId", techNoteId);
        console.log("userId", userId);

        try {
            // ParticipantsForSkilNoteModel에서 techNoteId와 userId에 해당하는 데이터 가져오기
            const participants = await this.participantsForSkilNoteRepo.find({
                where: {
                    techNote: { id: techNoteId },
                    user: { id: userId.userId }, // userId.userId를 사용하여 유저 아이디를 가져옴
                },
                relations: ['skilNote']
            });

            // 가져온 데이터를 반환
            return {
                message: "success",
                participants: participants
            };
        } catch (error) {
            // 에러 처리
            throw error;
        }
    }


}