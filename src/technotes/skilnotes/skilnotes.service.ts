import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechNotesModel } from '../entities/technotes.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { SkilNotesModel } from '../entities/skilnotes.entity';
import { dtoForCreateSkilNote } from '../dtos/dtoForCreateSkilNote.dto';
import { SkilNoteContentsModel } from '../entities/skilnote_contents.entity';
import { dtoForCreateSkilNoteContent } from '../dtos/dtoForCreateSkilNoteContents';
import { dtoForReorderContents } from '../dtos/dtoForReorderContents';
import { DeleteSkilNoteContentsDto } from 'src/users/dtos/DeleteSkilNoteContentsDto';
import { BookMarksForSkilNoteContentsModel } from '../entities/bookMarksForSkilNoteContent.entity';
import { DtoForChangePagesOrderForSkilNoteContent } from '../dtos/dtoForChangePagesOrderForSkilNote';
import { ParticipantsForSkilNoteModel } from '../entities/participantsForSkilNote.entity';

@Injectable()
export class SkilnotesService {
    constructor(
        @InjectRepository(TechNotesModel)
        private techNotesRepo: Repository<TechNotesModel>,
        @InjectRepository(SkilNotesModel)
        private skilNotesRepo: Repository<SkilNotesModel>,
        @InjectRepository(SkilNoteContentsModel)
        private skilNoteContentsRepo: Repository<SkilNoteContentsModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,

        @InjectRepository(BookMarksForSkilNoteContentsModel)
        private readonly skilNoteContentBookmarkRepo: Repository<BookMarksForSkilNoteContentsModel>,

        @InjectRepository(ParticipantsForSkilNoteModel)
        private ParticipantsForSkilNoteRepo: Repository<ParticipantsForSkilNoteModel>

    ) { }

    async changePagesOrderForSkilNoteContent({ skilNoteId, targetOrder, destinationOrder }: DtoForChangePagesOrderForSkilNoteContent) {

        console.log("skilNoteId : ", skilNoteId);
        console.log("targetOrder : ", targetOrder);
        console.log("destinationOrder : ", destinationOrder);


        const skilNote = await this.skilNotesRepo.findOne({ where: { id: skilNoteId } });

        // 스킬 노트 객체가 없는 경우 처리
        if (!skilNote) {
            return { success: false, message: '해당하는 스킬 노트를 찾을 수 없습니다.', error: '스킬 노트를 찾을 수 없음' };
        }

        // 트랜잭션 시작
        const queryRunner = this.skilNotesRepo.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            // 대상 페이지의 내용을 가져옵니다.
            const targetPages = await this.skilNoteContentsRepo.find({ where: { page: targetOrder, skilNote } });
            console.log("targetPages : ", targetPages);

            // 목적지 페이지의 내용을 가져옵니다.
            const destinationPages = await this.skilNoteContentsRepo.find({ where: { page: destinationOrder, skilNote } });
            console.log("destinationPages : ", destinationPages);

            // 대상 및 목적지 페이지가 모두 존재하는지 확인합니다.
            if (targetPages.length === 0 || destinationPages.length === 0) {
                throw new Error('대상 페이지 또는 목적지 페이지를 찾을 수 없습니다.');
            }

            // 대상 페이지의 내용을 임시 변수에 저장합니다.
            const tempPageContents = [];
            for (const page of targetPages) {
                tempPageContents.push({ ...page });
            }

            // 대상 페이지의 순서를 목적지 페이지로 변경합니다.
            for (const page of targetPages) {
                page.page = destinationOrder;
            }

            // // 목적지 페이지의 순서를 임시 변수에 저장된 내용으로 변경합니다.
            for (const page of destinationPages) {
                page.page = targetOrder
            }

            // 변경된 내용을 저장합니다.
            await this.skilNoteContentsRepo.save([...targetPages, ...destinationPages]);

            // 트랜잭션 커밋
            await queryRunner.commitTransaction();

            // 성공적으로 변경되었음을 반환
            return { success: true, message: '페이지 순서가 성공적으로 변경되었습니다.' };
        } catch (err) {
            // 트랜잭션 롤백 및 에러 처리
            await queryRunner.rollbackTransaction();
            return { success: false, message: '페이지 순서 변경 중에 오류가 발생했습니다.', error: err.message };
        } finally {
            // 쿼리 러너 반환 및 연결 종료
            await queryRunner.release();
        }
    }




    async deleteForCheckNoteIdsForCheckedIds(checkedIds: number[], loginUser: { email: string }): Promise<number | { success: boolean; message: string; }> {
        try {
            // console.log("checkedIds : ", checkedIds);
            const notesToDelete = await this.skilNotesRepo.find({
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

            const deleteResult = await this.skilNotesRepo.delete(checkedIds);
            // console.log("result for delete skilnote: ", deleteResult);
            // return deleteResult.affected ?? 0;
            const deletedCount = deleteResult.affected ?? 0;
            return { success: true, message: `총 ${deletedCount}명의 note가 삭제되었습니다.` }

        } catch (error) {
            console.log("error : ", error);

            throw new Error('삭제 중 오류가 발생했습니다.');
        }
    }

    async reorderContents(contents: dtoForReorderContents[]) {
        const updatedContents = [];

        console.log("contents : ", contents);


        for (const [index, content] of contents.entries()) {
            const { id, order } = content;

            await this.skilNoteContentsRepo.update(
                { id }, // 해당 ID에 대해
                { order: index + 1 }, // 주어진 order 값으로 업데이트
            );

            // 업데이트된 정보를 findOne 메서드로 얻기
            const updatedContent =
                await this.skilNoteContentsRepo.findOne({ where: { id } });

            if (updatedContent) {
                updatedContents.push(updatedContent);
            } else {
                console.error(`Failed to find updated content with ID ${id}`);
            }
        }

        return updatedContents;
    }

    async createSkilNoteContents(skilNoteId: string, pageNum: any, loginUser, dto: dtoForCreateSkilNoteContent) {
        const { title, file, content } = dto;
        console.log("skilnoteId : ", skilNoteId);
        console.log("skilnoteId : ", typeof skilNoteId);

        // todo 
        // const writerObj = await this.usersRepository.findOne({ where: { id: writerId } });
        const skilNoteObj = await this.skilNotesRepo.findOne({ where: { id: parseInt(skilNoteId) } })

        if (!loginUser || !skilNoteObj) {
            throw new Error('loginUser or skilNoteId가 필요합니다.');
        }

        const existingSkilNoteContents = await this.skilNoteContentsRepo.find({
            where: { skilNote: { id: parseInt(skilNoteId) } },
            order: { order: 'DESC' }, // order를 내림차순으로 정렬하여 최대값을 가져옴
            take: 1 // 최대값 하나만 가져오기
        });

        const maxOrder = existingSkilNoteContents.length > 0 ? existingSkilNoteContents[0].order : 0;

        const skilNoteContentsObj = new SkilNoteContentsModel();
        skilNoteContentsObj.title = title;
        skilNoteContentsObj.file = file;
        skilNoteContentsObj.content = content;
        skilNoteContentsObj.page = pageNum;
        skilNoteContentsObj.order = maxOrder + 1;
        skilNoteContentsObj.writer = loginUser
        skilNoteContentsObj.skilNote = skilNoteObj
        const saveResult = await this.skilNoteContentsRepo.save(skilNoteContentsObj);

        console.log("saveResult : ", saveResult);

        return saveResult;
    }

    async getSkilNoteContentsBySkilNoteId(skilNoteId: any, pageNum: any) {
        // 

        // SkilNoteId로 SkilNote 가져오기
        // const skilNote = await this.skilNotesRepo.findOne({ where: { id: skilNoteId } });
        const skilNote = await this.skilNotesRepo.findOne({
            where: { id: skilNoteId },
            relations: ['techNote']
        });

        // SkilNote가 존재하는지 확인 후 처리
        if (!skilNote) {
            throw new Error('SkilNote not found');
        }

        const techNoteId = skilNote.techNote.id
        console.log("techNoteId : ", techNoteId);

        const relatedSkilnoteList = await this.skilNotesRepo.find({ where: { techNote: { id: techNoteId } } })
        console.log("relatedSkilnoteList : ", relatedSkilnoteList);

        const options: FindManyOptions<SkilNoteContentsModel> = {
            where: { skilNote: { id: parseInt(skilNoteId) }, page: pageNum },
            order: { order: 'ASC' },
            relations: ['bookMarks', 'bookMarks.user', 'bookMarks.skilNoteContent'] // Include the user information
        };

        const skilnoteContents = await this.skilNoteContentsRepo.find(options);

        const skilnoteContentsPagesInfo =
            await this.skilNoteContentsRepo.find({
                where: {
                    skilNote: { id: parseInt(skilNoteId) },
                    file: ".todo"
                },
                order: {
                    page: 'ASC'
                }
            });
        // console.log("skilnoteContentsPagesInfo : ", skilnoteContentsPagesInfo);

        const skilNoteInfo = await this.skilNotesRepo
            .findOne({
                where: { id: skilNoteId },
                relations: ['writer']
            });

        const skilnotePagesCount = await this.skilNoteContentsRepo.count({
            where: { skilNote: { id: skilNoteId }, file: ".todo" }
        })

        // const skilnote_contents


        // console.log("skilnotePagesCount ?? ", skilnotePagesCount);

        const responseObj = {
            title: skilNoteInfo.title,
            writer: skilNoteInfo.writer,
            countForSkilNoteContents: skilnoteContents.length,
            skilnoteContents: skilnoteContents,
            skilnoteContentsPagesInfo: skilnoteContentsPagesInfo,
            skilnotePagesCount: skilnotePagesCount,
            relatedSkilnoteList: relatedSkilnoteList
        };

        return responseObj;
    }

    // fix 0217
    async getAllSkilNoteList(
        pageNum: number = 1,
        perPage: number = 10,
        searchOption: string,
        searchText: string,
        isBestByLikes: any,
        isBestByBookMarks: any
    ): Promise<{
        skilNoteList: SkilNotesModel[],
        totalCount: number,
        perPage: number,
    }> {
        // return this.techNotesRepo.find();
        console.log("pageNum at all skilnote list: ", pageNum);

        // const [skilNoteList, totalCount] = await this.skilNotesRepo.findAndCount({
        //     skip: (pageNum - 1) * perPage,
        //     take: perPage,
        //     relations: ['writer'], // 이 부분이 추가된 부분입니다. User 정보를 가져오도록 설정합니다.
        //     order: {
        //         id: 'DESC'
        //     }
        // });

        let query = this.skilNotesRepo.createQueryBuilder('skilnotes')
            .skip((pageNum - 1) * perPage)
            .take(perPage)
            .orderBy('skilnotes.order', 'DESC');

        if (searchOption && searchText) {
            if (searchOption === "email") {
                query = query
                    .where('writer.email LIKE :searchText', { searchText: `%${searchText}%` });
            } else {
                query = query.where(`skilnotes.${searchOption} LIKE :searchText`, { searchText: `%${searchText}%` });

            }
        }

        const [skilNoteList, totalCount] = await query
            .leftJoinAndSelect('skilnotes.writer', 'writer')
            .leftJoinAndSelect('skilnotes.skilnote_contents', 'skilnote_contents')
            .leftJoinAndSelect('skilnotes.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('skilnotes.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .leftJoinAndSelect('skilnotes.bookMarks', 'bookMarks')
            .leftJoinAndSelect('bookMarks.user', 'bookMarksUser')
            .getManyAndCount();

        const skilNoteListWithCounts = skilNoteList.map(skilNote => {
            skilNote.countForLikes = skilNote.likes.length; // 수정 필요
            skilNote.countForBookMarks = skilNote.bookMarks.length; // 수정 필요
            skilNote.countForSkilNoteContents = skilNote.skilnote_contents.length;
            skilNote.countForSkilNoteContentsPages = skilNote.skilnote_contents.filter((contents) => {
                if (contents.file === ".todo") {
                    return contents
                }
            }).length
            return skilNote;
        });

        if (isBestByLikes == "true") {
            console.log("excute check 11111");
            /* The above code is a comment in TypeScript. It is not performing any specific action or
            functionality in the code. It is used to provide information or explanations about the
            code to other developers who may read it. */
            skilNoteListWithCounts.sort((a, b) => b.countForLikes - a.countForLikes);
        }

        // isBestByBookMarks 가 true 일 경우 countForBookMarks 기준으로 큰거부터
        if (isBestByBookMarks == "true") {
            console.log("excute check 22222");
            skilNoteListWithCounts.sort((a, b) => b.countForBookMarks - a.countForBookMarks);
        }
        // console.log("skilNoteListWithCounts : ", skilNoteListWithCounts);

        return {
            skilNoteList: skilNoteListWithCounts,
            totalCount,
            perPage
        }

    }

    async createSkilnote(dto: dtoForCreateSkilNote) {
        const { title, description, category, email, techNoteId } = dto;

        const writer = await this.usersRepository.findOne({ where: { email: email } });
        const techNote = await this.techNotesRepo.findOne({ where: { id: techNoteId } })

        if (!writer) {
            // throw new Error('Writer not found'); // 작가를 찾을 수 없는 경우 예외 처리
            return { status: "error", message: `skilnote is not found for ${email}` };
        }

        if (!techNote) {
            throw new Error('techNote not found'); // 작가를 찾을 수 없는 경우 예외 처리
        }

        const skilNote = new SkilNotesModel();
        skilNote.title = title;
        skilNote.description = description;
        skilNote.category = category;
        skilNote.writer = writer;
        // skilNote.techNote = techNote;

        return this.skilNotesRepo.save(skilNote);
    }

    async getSkilnotesForTechNote(
        techNoteId: number,
        pageNum: number = 1,
        perPage: number = 10,
        searchOption: string,
        searchText: string,
        isBestByLikes: any,
        isBestByBookMarks: any
    ): Promise<{ skilNoteList: SkilNotesModel[], totalCount: number, perPage: number }> {

        const techNoteObj = await this.techNotesRepo.findOne({
            where: {
                id: techNoteId
            }
        });

        let query = this.skilNotesRepo.createQueryBuilder('skilnotes')
            .where({ techNote: techNoteObj })
            .skip((pageNum - 1) * perPage)
            .take(perPage)
            .orderBy('skilnotes.order', 'DESC');

        if (searchOption && searchText) {
            if (searchOption === "email") {
                query = query
                    .where('writer.email LIKE :searchText', { searchText: `%${searchText}%` });
            } else {
                query = query.where(`skilnotes.${searchOption} LIKE :searchText`, { searchText: `%${searchText}%` });

            }
        }

        const [skilNoteList, totalCount] = await query
            .leftJoinAndSelect('skilnotes.writer', 'writer')
            .leftJoinAndSelect('skilnotes.skilnote_contents', 'skilnote_contents')  // 주석 해제
            .leftJoinAndSelect('skilnotes.likes', 'likes')
            .leftJoinAndSelect('likes.user', 'likeUser')
            .leftJoinAndSelect('skilnotes.bookMarks', 'bookMarks')
            .leftJoinAndSelect('bookMarks.user', 'bookMarksUser')
            .getManyAndCount();


        const skilNoteListWithCounts = skilNoteList.map(skilNote => {
            skilNote.countForLikes = skilNote.likes.length; // 수정 필요
            skilNote.countForBookMarks = skilNote.bookMarks.length; // 수정 필요
            skilNote.countForSkilNoteContents = skilNote.skilnote_contents.length;
            skilNote.countForSkilNoteContentsPages = skilNote.skilnote_contents.filter((contents) => {
                if (contents.file === ".todo") {
                    return contents
                }
            }).length
            return skilNote;
        });

        // console.log("isBestByLikes : ", isBestByLikes);
        // console.log("isBestByBookMarks : ", isBestByBookMarks);


        if (isBestByLikes == "true") {
            console.log("excute check 11111");
            /* The above code is a comment in TypeScript. It is not performing any specific action or
            functionality in the code. It is used to provide information or explanations about the
            code to other developers who may read it. */
            skilNoteListWithCounts.sort((a, b) => b.countForLikes - a.countForLikes);
        }

        // isBestByBookMarks 가 true 일 경우 countForBookMarks 기준으로 큰거부터
        if (isBestByBookMarks == "true") {
            console.log("excute check 22222");
            skilNoteListWithCounts.sort((a, b) => b.countForBookMarks - a.countForBookMarks);
        }
        // console.log("skilNoteListWithCounts : ", skilNoteListWithCounts);

        return {
            skilNoteList: skilNoteListWithCounts,
            totalCount,
            perPage
        }
    }

    async saveSkilNoteRows(skilNotesToSave: any[], loginUser: UsersModel): Promise<any> {

        console.log("skilNotesToSave : ", skilNotesToSave);
        console.log("skilNotesToSave.length : ", skilNotesToSave.length);

        let count = 0;

        for (const note of skilNotesToSave) {
            const { id, title, description, category, email, techNoteId, order, ...data } = note;

            console.log("order ?? ", order);

            const writerObj = await this.usersRepository.findOne({
                where: {
                    email: email
                }
            });
            const techNoteObj = await this.techNotesRepo.findOne({
                where: {
                    id: techNoteId
                }
            });

            if (id) {
                console.log("id : ", id);
                const existingNote = await this.skilNotesRepo.findOne({ where: { id: id } }); // 변경된 부분

                // Find the maximum order value among existing notes
                const maxOrderNote = await this.skilNotesRepo
                    .createQueryBuilder("skilNotes")
                    .select("MAX(skilNotes.order)", "maxOrder")
                    .getRawOne();

                const newOrder = maxOrderNote && maxOrderNote.maxOrder ? maxOrderNote.maxOrder + 1 : 1;

                if (existingNote) {
                    count++;
                    console.log("update here");
                    await this.skilNotesRepo.update(id, {
                        title: title,
                        description: description,
                        category: category,
                        updatedAt: new Date(),
                        writer: writerObj,
                        techNote: techNoteObj,
                        order: order
                    });
                } else {
                    console.log("save here");
                    count++;

                    if (!loginUser) {
                        return { status: "error", message: `login is required to add skil note` }
                    }

                    await this.skilNotesRepo
                        .save({
                            title: title,
                            description: description,
                            category: category,
                            createdAt: new Date(),
                            writer: loginUser,
                            techNote: techNoteObj,
                            order: newOrder
                        });
                }


            }
        }
        return { message: `save skil note is successfully excuted ${count}` };
    }

    async updateSkilNoteContent(skilNoteContentId: string, dto: dtoForCreateSkilNoteContent, loginUser) {
        console.log("skilNoteContentId : ", skilNoteContentId);
        console.log("skilNoteContentId : ", typeof skilNoteContentId);

        if (!loginUser || !skilNoteContentId) {
            throw new Error('loginUser or skilNoteId가 필요합니다.');
        }

        const skilNoteContentObj =
            await this.skilNoteContentsRepo.findOne({
                where: { id: parseInt(skilNoteContentId) },
                relations: ['writer']
            })

        console.log("skilNoteContentObj ????? ", skilNoteContentObj);


        //
        if (skilNoteContentObj.writer.email !== loginUser.email) {
            throw new UnauthorizedException("작성자만 수정 할 수 있습니다.");
        }

        const update_result = await this.skilNoteContentsRepo.update(skilNoteContentId, {
            title: dto.title,
            file: dto.file,
            content: dto.content,
        });

        return update_result;
    }

    // fix 
    async deleteSkilNoteContentForCheckedIds(
        { checkedIds }: DeleteSkilNoteContentsDto,
        loginUser
    ) {
        try {
            console.log("check by checked ids for skilnote contents : ", checkedIds);
            console.log("loginUser.email : ", loginUser.email);

            // checkedIds에 해당하는 모든 ID에 대해 삭제
            for (const id of checkedIds) {
                const content = await this.skilNoteContentsRepo.findOne({ where: { id: id }, relations: ['writer'], });

                // console.log("content.writer.email : ", content.writer.email);


                if (!content) {
                    throw new NotFoundException(`Content with ID ${id} not found.`);
                }

                if (content.writer && content.writer.email !== loginUser.email) {
                    throw new HttpException('작성자만 삭제 가능합니다.', HttpStatus.UNAUTHORIZED);
                }

                await this.skilNoteContentsRepo.remove(content);
            }
            return { success: true };
        } catch (error) {
            // throw new Error(`Error deleting skilnote content: ${error.message}`);
            throw new NotFoundException(`Error deleting skilnote content: ${error.message}`);

        }
    }

    async toggleBookMarkForSkilNoteContent(userId: number, skilNoteContentId: number): Promise<boolean> {
        console.log("skilNoteContentId ?? ", skilNoteContentId);

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const skilNoteContent = await this.skilNoteContentsRepo.findOne(
            { where: { id: skilNoteContentId } }
        );
        console.log("user : ", user);
        console.log("skilNoteContent ?? ", skilNoteContent);

        if (!user || !skilNoteContent) {
            return false; // 사용자 또는 기술 노트가 없을 경우 실패
        }

        // 이미 좋아요를 했는지 확인
        const existingBookMark = await this.skilNoteContentBookmarkRepo
            .findOne({ where: { user: { id: user.id }, skilNoteContent: { id: skilNoteContent.id } } });


        console.log("existingBookMark ?? ", existingBookMark);

        if (existingBookMark) {
            // 이미 좋아요를 했을 경우 좋아요 취소
            await this.skilNoteContentBookmarkRepo.remove(existingBookMark);
            return false;
        }

        const bookmark = this.skilNoteContentBookmarkRepo.create({ user, skilNoteContent });
        await this.skilNoteContentBookmarkRepo.save(bookmark);

        console.log("bookmark : ", bookmark);


        return true;
    }

    async reorderSkilNoteListOrder(contents: dtoForReorderContents[]) {
        const updatedContents = [];
        console.log("contents for reorder: ", contents);

        const maxOrder = Math.max(...contents.map(content => content.order));

        console.log("maxOrder : ", maxOrder);

        for (const [index, content] of contents.entries()) {
            const { id, order } = content;
            console.log("id, index : ", id, index);

            await this.skilNotesRepo.update(
                { id }, // 해당 ID에 대해
                { order: maxOrder - index }, // 주어진 order 값으로 업데이트
            );

            // 업데이트된 정보를 findOne 메서드로 얻기
            const updatedContent =
                await this.skilNotesRepo.findOne({ where: { id } });
            if (updatedContent) {
                updatedContents.push(updatedContent);
            } else {
                console.error(`Failed to find updated content with ID ${id}`);
            }
        }
        return updatedContents;
    }


    async addParticipantsForSkilnote(skilNoteId: number, userId: number) {
        const skilNoteObj = await this.skilNotesRepo.findOne({ where: { id: skilNoteId } });
        if (!skilNoteObj) {
            throw new Error('SkilNote not found');
        }

        // userId로 userObj 찾기
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        try {
            // 이미 해당 유저에 대한 ParticipantsForRoadMapModel 데이터가 있는지 확인
            const existingParticipant = await this.ParticipantsForSkilNoteRepo.findOne({ where: { user: user } });

            if (existingParticipant) {
                // 이미 해당 유저에 대한 데이터가 있으면 삭제
                await this.ParticipantsForSkilNoteRepo.remove(existingParticipant);
                return {
                    message: `Cancle Particlpate for SkilNote : ${skilNoteObj.title}`
                };
            } else {
                // ParticipantsForRoadMapModel에 데이터 추가
                const participant = new ParticipantsForSkilNoteModel();
                participant.skilNote = skilNoteObj;
                participant.user = user;
                // 추가적으로 필요한 데이터가 있다면 여기에 추가

                // ParticipantsForRoadMapModel 저장
                await this.ParticipantsForSkilNoteRepo.save(participant);

                // 성공적으로 추가되었음을 반환
                return {
                    message: `Success Participate for SkilNote : ${skilNoteObj.title}`
                };
            }
        } catch (error) {
            // 오류 발생 시 예외 처리
            throw new Error(`Failed to add participant to SkilNote: ${error.message}`);
        }
    }


}
