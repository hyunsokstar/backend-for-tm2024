import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechNotesModel } from './entities/technotes.entity';
import { DtoForCreateTechNote } from './dtos/dtoForCreateTechNote.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from './entities/skilnotes.entity';
import { LikesModelForTechNote } from './entities/likesForTechNote.entity';
import { bookMarksForTechNoteModel } from './entities/bookMarks.entity';
import { LikesModelForSkilNote } from './entities/likesForSkilNote.entity';
import { BookMarksForSkilNoteModel } from './entities/bookMarksForSkilNote.entity';

@Injectable()
export class TechnotesService {

    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>,
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

    ) { }

    async toggleLikeForTechNote(userId: number, techNoteId: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const techNote = await this.techNotesRepo.findOne({ where: { id: techNoteId } });

        if (!user || !techNote) {
            return false; // 사용자 또는 기술 노트가 없을 경우 실패
        }

        // 이미 좋아요를 했는지 확인
        const existingLike = await this.likesForTechNoteRepo.findOne({ where: { user, techNote } });

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

    // 1122
    async deleteForCheckNoteIdsForCheckedIds(checkedIds: number[]): Promise<number> {
        try {
            console.log("checkedIds : ", checkedIds);
            const deleteResult = await this.techNotesRepo.delete(checkedIds);
            console.log("result for delete techNoteRowsForCheckedIds: ", deleteResult);

            return deleteResult.affected ?? 0;

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

    // async getAllTechNotes(
    //     pageNum: number = 1,
    //     perPage: number = 10,
    //     searchOption: string,
    //     earchText: string

    // ): Promise<{
    //     techNoteList: TechNotesModel[],
    //     totalCount: number,
    //     perPage: number,
    // }> {
    //     // return this.techNotesRepo.find();

    //     const [techNoteList, totalCount] = await this.techNotesRepo.findAndCount({
    //         skip: (pageNum - 1) * perPage,
    //         take: perPage,
    //         relations: ['writer', 'skilnotes'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
    //         order: {
    //             id: 'DESC'
    //         }
    //     });

    //     return {
    //         techNoteList,
    //         totalCount,
    //         perPage
    //     }

    // }

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
            .leftJoinAndSelect('techNotes.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .leftJoinAndSelect('techNotes.bookMarks', 'bookMarks')
            .leftJoinAndSelect('bookMarks.user', 'bookMarksUser')
            .getManyAndCount();

        // countForLikes 및 countForBookMarks를 계산하여 결과에 추가
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

        // isBestByBookMarks 가 true 일 경우 countForBookMarks 기준으로 큰거부터
        if (isBestByBookMarks == "true") {
            techNoteListWithCounts.sort((a, b) => b.countForBookMarks - a.countForBookMarks);
        }


        console.log("isBestByLikes at skilnote: ", isBestByLikes);
        console.log("isBestByBookMarks : at skilnote", isBestByBookMarks);

        // console.log("techNoteListWithCounts : ", techNoteListWithCounts);

        return {
            techNoteList: techNoteListWithCounts,
            totalCount,
            perPage
        };
    }


    async getAllSkilNotes(
        pageNum: number = 1,
        perPage: number = 10
    ): Promise<{
        skilNoteList: SkilNotesModel[],
        totalCount: number,
        perPage: number,
    }> {
        // return this.techNotesRepo.find();

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

    // saveTechNotes
    async saveTechNotes(techNotesToSave: any[], loginUser: UsersModel): Promise<any> {

        console.log("techNotesToSave : ", techNotesToSave);
        console.log("todoRowsForSave.length : ", techNotesToSave.length);

        let count = 0;

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

                    await this.techNotesRepo.save({
                        title: title,
                        description: description,
                        category: category,
                        createdAt: new Date(),
                        writer: loginUser
                    });
                }


            }
        }
        return { message: `Todos updated successfully ${count}` };
    }

}